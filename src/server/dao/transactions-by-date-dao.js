const moment = require("moment");
const fs = require('fs');

module.exports = class TransactionsByDateDAO {

    constructor(dataFileName) {
        this.dataFileName = dataFileName;
    }

    async getTransactionsByDate(requestStartDate, requestEndDate) {
        let dataObject = await this.readTransactions(this.dataFileName);
        if ("transactions" in dataObject) {
            let response = [];
            dataObject.transactions.forEach((transaction) => {
                let transactionDate = moment(transaction.dateTime);
                if (transactionDate.isAfter(requestStartDate) && transactionDate.isBefore(requestEndDate)) {
                    response.push(transaction);
                }
            });
            return response;
        }
        else {
            return [];
        }
    }

    async readTransactions(fileName) {
        try {
            let jsonString = await this.readFile(fileName);
            if (jsonString != null && jsonString.trim().length > 0) {
                return JSON.parse(jsonString);
            }
            else {
                return [];
            }
        }
        catch (error) {
            console.log("Failed to read transactions from " + fileName);
            console.log(error);
            return [];
        }
    }
    async readFile(fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, 'utf8', function (err, contents) {
                if (err) {
                    console.log('Failed to read from file ' + fileName);
                    reject(err);
                }
                resolve(contents);
            })
        });
    }

}