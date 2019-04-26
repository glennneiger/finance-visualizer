export default class CategoryMatcher {
    constructor() { }

    addCategorizationRule(criteria) {
        let payload = {};
        payload["sourceRegex"] = criteria.sourceRegex;
        payload["descriptionRegex"] = criteria.descriptionRegex;
        payload["minAmountInCents"] = Math.round(criteria.minAmount * 100);
        payload["maxAmountInCents"] = Math.round(criteria.maxAmount * 100);
        payload["categoryName"] = criteria.categoryName;
        payload["subCategoryName"] = criteria.subCategoryName;
        console.log("preparing to send new cateogrization rule to server");
        let postOptions = {
            method: "POST",
            mode: "same-origin",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        };

        return new Promise((resolve, reject) => {
            console.log("Sending save categorization rule web request");
            fetch("api/categories/save", postOptions).then(
                async (response) => {
                    console.log("Fetch completed.");
                    this._parseResponse(response, resolve, reject);
                },
                (error) => {
                    console.log("addCategorizationRule() failed.");
                    console.log(error);
                    reject(error);
                }
            )
        });
    }

    updateCategorizationRule(criteria) {
        let payload = {};
        payload["sourceRegex"] = criteria.sourceRegex;
        payload["descriptionRegex"] = criteria.descriptionRegex;
        payload["minAmountInCents"] = Math.round(criteria.minAmount * 100);
        payload["maxAmountInCents"] = Math.round(criteria.maxAmount * 100);
        payload["categoryName"] = criteria.categoryName;
        payload["subCategoryName"] = criteria.subCategoryName;
        payload["id"] = criteria.categorizationId;
        console.log("preparing to update cateogrization rule " + criteria.categorizationId);
        let postOptions = {
            method: "POST",
            mode: "same-origin",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        };

        return new Promise((resolve, reject) => {
            fetch("api/categories/update", postOptions).then(
                async (response) => {
                    this._parseResponse(response, resolve, reject);
                },
                (error) => {
                    console.log("updateCategorizationRule() failed.");
                    console.log(error);
                    reject(error);
                }
            )
        });
    }

    loadCategories() {
        return new Promise((resolve, reject) => {
            fetch("api/categories/get").then(
                async (response) => {
                    this._parseResponse(response, resolve, reject)
                },
                (error) => {
                    console.log("loadCategories() failed");
                    console.log(error);
                    reject(error);
                }
            );
        });
    }

    async _parseResponse(response, successFunc, failFunc) {
        if (response.status == 200) {
            try {
                let responseText = await response.text();
                if (responseText && responseText.length > 0) {
                    let json = JSON.parse(responseText);
                    console.log(json);
                    if (!("errors" in json) || json.errors.length == 0) {
                        successFunc(json);
                    } else {
                        failFunc(json);
                    }
                } else {
                    console.log("No data found in response");
                    successFunc();
                }
            } catch (e) {
                console.log(e);
                failFunc({ errors: ["Failed to parse response received from server. However, server claims request was successful."] });
            }
        } else {
            try {
                let json = JSON.parse(await response.text());
                if ("errors" in json) {
                    console.log(json);
                    failFunc(json.errors);
                } else {
                    failFunc({ errors: ["Unexpected Error occurred when saving category"] });
                }
            } catch (e) {
                console.log(e);
                console.log(response.text());
                failFunc({ errors: ["Unexpected Error occurred when saving category"] });
            }
        }
    }
}