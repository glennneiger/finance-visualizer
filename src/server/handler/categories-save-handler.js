const express = require("express");
const moment = require("moment");

module.exports = class SaveCategoriesHandler {

    constructor(express, dao) {
        this.dao = dao;
        express.post("/api/categories/save", async (request, response) => {
            console.log("In Save Categories Handler...");
            let postParams = {};
            try {
                postParams = request.body;
            } catch (e) {
                //bad request.
                console.log(request.body);
                console.log(e);
                response.status(400).end();
                return;
            }
            let sourceRegex = postParams.sourceRegex;
            let descriptionRegex = postParams.descriptionRegex;
            let minAmountInCents = postParams.minAmountInCents;
            let maxAmountInCents = postParams.maxAmountInCents;
            let minAmount = (minAmountInCents / 100);
            let maxAmount = (maxAmountInCents / 100);
            let categoryName = postParams.categoryName;
            let subCategoryName = postParams.subCategoryName;

            let errorMessages = [];
            if (!this.isValidRegex(sourceRegex)) {
                errorMessages.push("Invalid criteria defined for 'transaction source'");
            }
            if (!this.isValidRegex(descriptionRegex)) {
                errorMessages.push("Invalid criteria defined for 'transaction description'");
            }
            if (isNaN(minAmountInCents) || !Number.isSafeInteger(minAmountInCents)) {
                errorMessages.push("Minimum amount must be a valid numeric value, with maximum precision to the hundredth place. Found [" + minAmountInCents + "]");
            }
            if (isNaN(maxAmountInCents) || !Number.isSafeInteger(maxAmountInCents)) {
                errorMessages.push("Maximum amount must be a valid numeric value, with maximum precision to the hundredth place. Found [" + maxAmountInCents + "]");
            }
            if (!categoryName || typeof categoryName != "string" || categoryName.length == 0) {
                errorMessages.push("Categorization request must contain a 'category name'.");
            }
            if (!subCategoryName || typeof subCategoryName != "string" || subCategoryName.length == 0) {
                errorMessages.push("Categorization request must contain a 'sub-category name'.");
            }

            if (errorMessages.length > 0) {
                response.send(JSON.stringify({
                    errors: errorMessages
                }));
            }
            else {
                minAmount = parseInt(minAmount);
                maxAmount = parseInt(maxAmount);
                let success = await this.dao.save(sourceRegex, descriptionRegex, minAmount, maxAmount, categoryName, subCategoryName);
                if (success) {
                    console.log("success");
                    response.send();
                }
                else {
                    response.send(JSON.stringify({
                        errors: ["An unexpected error has occurred. Unable to save new category"]
                    }));
                }
            }
        });
    }

    isValidRegex(regex) {
        if (regex && typeof regex === "string" && regex.trim().length > 0) {
            try {
                new RegExp(regex);
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }
}