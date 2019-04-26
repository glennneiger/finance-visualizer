/**
 * An object representing a category matcher for a transaction.  This matcher is specific to the transaction.
 */

export default class CategoryMatcher {

    /**
     * 
     * @param {*} sourceReference the string value to base any changes to the source criteria off of.
     * @param {*} sourceCriteriaList An ordered list of the characters that must match in the source for it to be considered a match. 
     *                               If empty, everything will be considered a match. If null, nothing.
     * @param {*} descriptionReference the string value to base any changes to the description criteria off of.
     * @param {*} descriptionCriteriaList An ordered list of the characters that must match in the description for it to be considered a match. 
     *                               If empty, everything will be considered a match. If null, nothing.
     * @param {*} currentAmount the numeric amount of the transaction this categorization matcher is being based on.
     * @param {*} minAmount the default minimum amount of the range the numeric amount a transaction can have to be matched by this matcher.
     * @param {*} maxAmount the default maximum amount of the range the numeric amount a transaction can have to be matched by this matcher.
     * @param {*} categoryName [optional] the name of the category a transaction represents if it is matched by this matcher.
     * @param {*} subCategoryName [optional] the name of the sub-category a transaction represents if it is matched by this matcher.
     */
    constructor(categorizationId, sourceReference, sourceCriteriaList, descriptionReference, descriptionCriteriaList,
        currentAmount, minAmount, maxAmount, categoryName, subCategoryName) {
        this.sourceReference = sourceReference;
        this.matchedSourceIndexes = this._findMatchedIndexes(sourceReference, sourceCriteriaList);
        this.descriptionReference = descriptionReference;
        this.matchedDescriptionIndexes = this._findMatchedIndexes(descriptionReference, descriptionCriteriaList);
        this.currentAmount = currentAmount;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.categorizationId = categorizationId;
        this.id = CategoryMatcher.getNextId();
        this.categoryName = categoryName;
        this.subCategoryName = subCategoryName;
    }

    addSourceCharacter(index) {
        let response = this._addCharacterToField("sourceReference", "matchedSourceIndexes", index)
        return response;
    }

    addDescriptionCharacter(index) {
        return this._addCharacterToField("descriptionReference", "matchedDescriptionIndexes", index)
    }

    removeSourceCharacter(characterIndex) {
        return this._removeFieldCharacter("matchedSourceIndexes", characterIndex);
    }

    removeDescriptionCharacter(characterIndex) {
        return this._removeFieldCharacter("matchedDescriptionIndexes", characterIndex);
    }

    generateSourceRegex() {
        return this._generateRegex(this.matchedSourceIndexes, this.sourceReference);
    }

    generateDescriptionRegex() {
        return this._generateRegex(this.matchedDescriptionIndexes, this.descriptionReference);
    }

    _generateRegex(matchedIndexes, reference) {
        if (matchedIndexes.length == 0) {
            return ".*";
        } else if (matchedIndexes.length == 1) {
            let longResponse = ".*" + reference[matchedIndexes[0]] + ".*";
            return reference.length > 1 ? longResponse : ("^" + reference[0] + "$");
        }

        let response = "";
        if (matchedIndexes[0] == 0) { //contains first index
            response += "^";
        } else {
            response += ".*";
        }

        response += reference[matchedIndexes[0]];
        for (let msiIndex = 1; msiIndex < matchedIndexes.length; msiIndex++) {
            let matchedChar = reference[matchedIndexes[msiIndex]];
            if (matchedIndexes[msiIndex] - matchedIndexes[msiIndex - 1] == 1) { //adjacent characters
                response += matchedChar;
            } else {
                response += ".*" + matchedChar;
            }
        }

        if (matchedIndexes[matchedIndexes.length - 1] === reference.length - 1) {
            response += "$";
        } else {
            response += ".*";
        }
        return response;
    }

    _removeFieldCharacter(indexesFieldName, characterIndex) {
        if (this[indexesFieldName]) {
            return this._removeFromSortedArray(this[indexesFieldName], characterIndex);
        } else {
            console.warn("Unexpected error occurred, tried to remove a category-matcher index for " + indexesFieldName + " when " + indexesFieldName + " is null");
            return false;
        }
    }

    _addCharacterToField(fieldReferenceName, fieldIndexesName, index) {
        if (index >= this[fieldReferenceName].length || index < 0) {
            console.error("Illegal Argument: cannot add index " + index + " to the transaction's " + fieldReferenceName + "'s category matcher.  Out of bounds");
            return false;
        }
        if (this[fieldIndexesName] == null) {
            this[fieldIndexesName] = [index];
            return true;
        } else {
            return this._insertIntoSortedArray(this[fieldIndexesName], index);
        }
    }

    _findMatchedIndexes(reference, criteriaList) {
        if (criteriaList == null) {
            return null;
        } else if (criteriaList.length == 0) {
            return [];
        }
        let remainingString = reference;
        let matchedIndexes = [];
        for (let sourceCriteriaIndex = 0; sourceCriteriaIndex < criteriaList.length; sourceCriteriaIndex++) {
            let regex = criteriaList[sourceCriteriaIndex];
            if (!regex) {
                continue; //empty string, probably first entry.
            }
            let matches = remainingString.match(new RegExp(regex, "i"));
            if (matches) {
                for (let regexIndex = 0; regexIndex < matches[0].length; regexIndex++) {
                    matchedIndexes.push(regexIndex + (reference.length - remainingString.length));
                }
                remainingString = remainingString.substring(matches.index + matches[0].length, remainingString.length);
            } else {
                console.error("Received category matcher that does not match the source it was given with.");
                console.log(reference);
                console.log(criteriaList);
                return null;
            }
        }
        return matchedIndexes;
    }

    _removeFromSortedArray(array, value) {
        let removeIndex = this._findElementInSortedArray(array, value);
        if (array[removeIndex] == value) {
            array.splice(removeIndex, 1);
            return true;
        } else {
            //nothing to remove.
        }
        return false;
    }

    _insertIntoSortedArray(array, value) {
        let insertIndex = this._findElementInSortedArray(array, value);
        if (array[insertIndex] < value) {
            array.splice(insertIndex + 1, 0, value);
            return true;
        } else if (array[insertIndex] > value || insertIndex == array.length) {
            array.splice(insertIndex, 0, value);
            return true;
        } else {
            //value already added, we don't allow duplicates.
            return false;
        }
    }

    _findElementInSortedArray(array, value) {
        let lowIndex = 0;
        let highIndex = array.length - 1;
        let currentIndex = 0;
        while (lowIndex <= highIndex) {
            currentIndex = Math.floor((lowIndex + highIndex) / 2);
            let currentElement = array[currentIndex];
            if (currentElement < value) {
                lowIndex = currentIndex + 1;
            }
            else if (currentElement > value) {
                highIndex = currentIndex - 1;
            }
            else {
                break;
            }
        }
        return currentIndex;
    }

}
CategoryMatcher.nextId = 0;
CategoryMatcher.getNextId = () => {
    let response = CategoryMatcher.nextId;
    CategoryMatcher.nextId++;
    return response;
}