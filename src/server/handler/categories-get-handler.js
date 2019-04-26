const express = require("express");
const moment = require("moment");

module.exports = class GetCategoriesHandler {

    constructor(express, dao) {
        this.dao = dao;
        express.get("/api/categories/get", async (request, response) => {
            console.log("In Get Categories Handler...");
            try {
                let categories = await this.dao.read();
                if (categories && typeof categories == "object") {
                    response.send(JSON.stringify(categories));
                }
                else {
                    console.log("Received empty or unexpected categories.");
                    console.log(categories);
                    response.send(JSON.stringify({
                        errors: ["Failed to load categories, received an unexpected response"]
                    }));
                }
            }
            catch (error) {
                console.log(error);
                response.send(JSON.stringify({
                    errors: ["Failed to load categories due to an unexpected error"]
                }));
            }
        });
    }
}