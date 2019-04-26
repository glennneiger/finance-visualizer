const express = require("express");
const bodyParser = require('body-parser');

const TransactionsHandler = require("./handler/transactions-handler.js");
const SaveCategoriesHandler = require("./handler/categories-save-handler.js");
const UpdateCategoriesHandler = require("./handler/categories-update-handler.js");
const GetCategoriesHandler = require("./handler/categories-get-handler.js");
const TransactionsByDateDAO = require("./dao/transactions-by-date-dao.js");
const CategoriesDAO = require("./dao/categories-dao.js");
const PROPERTIES_FILE = "config.prp";
const fs = require('fs');

(async function run() {
    let app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    let properties = await loadProperties();

    let categoriesDAO = new CategoriesDAO(properties.CATEGORIES_FILE);
    new TransactionsHandler(app, new TransactionsByDateDAO(properties.DATA_FILE), categoriesDAO);
    new SaveCategoriesHandler(app, categoriesDAO);
    new UpdateCategoriesHandler(app, categoriesDAO);
    new GetCategoriesHandler(app, categoriesDAO);

    app.listen(8080, function () {
        console.log('Finance Visualizer Listening on port 8080!');
    });
})();

async function loadProperties() {
    return new Promise((resolve, reject) => {
        let propertyMap = {};
        fs.readFile(PROPERTIES_FILE, 'utf8', function (err, contents) {
            if (err) {
                console.log("Unable to load properties");
                reject(err);
            }
            let properties = contents.split("\r\n");
            for (let propIndex = 0; propIndex < properties.length; propIndex++) {
                let keyAndValue = properties[propIndex].split("=");
                propertyMap[keyAndValue[0]] = keyAndValue[1];
            }
            if (Object.keys(propertyMap).length == 0) {
                console.log("Unable to load properties");
                reject("Successfully read properties file, but no properties were found.");
            }
            resolve(propertyMap);
        });
    });
}
