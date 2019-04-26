const express = require("express");
const moment = require("moment");

module.exports = class TransactionsHandler {

  constructor(express, transactionDAO, categoryDAO) {
    this.transactionDAO = transactionDAO;
    this.categoryDAO = categoryDAO;
    express.get("/api/transactions", async (request, response) => {
      console.log("In Get Transactions Handler...");
      let startDate = moment(request.query.startDate);
      let endDate = moment(request.query.endDate);
      let transactions = await this.transactionDAO.getTransactionsByDate(startDate, endDate);
      let categoriesById = await this.categoryDAO.read();
      this.categorizeTransactions(transactions, categoriesById);
      response.send(JSON.stringify(transactions));
    });
  }

  /**
   * Danger, this method categorizes every transaction, regardless if it already belongs to a category.  It's not scaleable.
   * To make scaleable I'd suggest only doing something like this when you add or edit a category via a query, and then change the
   * category of anything that matches the query if the new category's priority holds more weight than the old categories priority, but
   * since this isn't in a sql database and maintaining the integrity of what I described above would be difficult when doing manual
   * edits, I've opted for this method. :D
   * @param {*} transactions The transactions to categorize, keyed by their id.
   * @param {*} categoryRules the category rules to apply.
   */
  categorizeTransactions(transactions, categoryRules) {
    //order category rules by priority in ascending order.
    let orderedRules = Object.keys(categoryRules).sort((main, other) => {
      return categoryRules[main].priority - categoryRules[other].priority;
    });
    //apply rules.
    transactions.forEach((transaction) => {
      transaction.category = "UNKNOWN";
      transaction.subCategory = "UNKNOWN"
    });
    let unCategorizedTransactions = transactions.map((input) => input);
    orderedRules.forEach((ruleId) => {
      let rule = categoryRules[ruleId];
      let descriptionRegex = new RegExp(rule.descriptionRegex);
      let sourceRegex = new RegExp(rule.sourceRegex);
      for (let unCategorizedIndex = unCategorizedTransactions.length - 1; unCategorizedIndex >= 0; unCategorizedIndex--) {
        let transaction = unCategorizedTransactions[unCategorizedIndex];
        let regexMatch = descriptionRegex.test(transaction.description) && sourceRegex.test(transaction.source);
        if (regexMatch && transaction.amount >= rule.minAmount && transaction.amount <= rule.maxAmount) {
          transaction.category = rule.categoryName;
          transaction.subCategory = rule.subCategoryName;
          transaction.categorizationId = ruleId;
          unCategorizedTransactions.splice(unCategorizedIndex, 1);
        }
      }
    });
  }
}