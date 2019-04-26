const fs = require('fs');

module.exports = class CategoriesDAO {

    constructor(dataFileName) {
        this.dataFileName = dataFileName;
    }

    async save(sourceRegex, descriptionRegex, minAmount, maxAmount, categoryName, subCategoryName, id) {
        try {
            let categoriesById = await this.internalRead();
            let insertValue = {
                sourceRegex: sourceRegex,
                descriptionRegex: descriptionRegex,
                minAmount: minAmount,
                maxAmount: maxAmount,
                categoryName: categoryName,
                subCategoryName: subCategoryName,
                priority: categoriesById.nextPriority,
                id: null
            }
            if (id) {
                insertValue.id = id;
                categoriesById[id] = insertValue; //obvious injection issue.  For example, by providing non-valid id attacker could change nextId or priority.
            } else {
                insertValue.id = categoriesById.nextId;
                categoriesById[categoriesById.nextId] = insertValue;
                categoriesById.nextId = categoriesById.nextId + 1;
                categoriesById.nextPriority = categoriesById.nextPriority + 1;
            }
            console.log(insertValue);
            await new Promise((resolve, reject) => {
                fs.writeFile(this.dataFileName, JSON.stringify(categoriesById), function (error) {
                    if (error) {
                        console.log('Failed to save categories');
                        reject(error);
                    }
                    resolve();
                });
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    async internalRead() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.dataFileName, 'utf8', function (err, contents) {
                if (err) {
                    console.log("Failed to read categories");
                    reject(err);
                }
                let response = JSON.parse(contents);
                if (!response.nextId) { //this should only happen on the first read ever.
                    response.nextId = 0;
                    response.nextPriority = 0;
                }
                resolve(response);
            });
        });
    }

    async read() {
        let response = await this.internalRead();
        delete response.nextId;
        delete response.nextPriority;
        return response;
    }
}
