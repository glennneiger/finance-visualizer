const express = require("express");
const moment = require("moment");

module.exports = class TransactionsHandler {

  constructor(express) {
    express.get("/api/transactions", (request, response) => {
      let transactions = [
        { dateTime: moment().subtract(7, "day"), amount: 25, category: "Car", subCategory: "Gas", description: "Quick Trip" },
        { dateTime: moment(), amount: 300, category: "Car", subCategory: "Car Payment", description: "Bank of America" },
        { dateTime: moment(), amount: 1200, category: "Rent", subCategory: "Rent", description: "Sunny Hills Apartments" },
        { dateTime: moment(), amount: 10, category: "Food", subCategory: "Dining", description: "McDonalds" },
        { dateTime: moment(), amount: 57, category: "Food", subCategory: "Groceries", description: "Target" },
        { dateTime: moment(), amount: 50, category: "Utilities", subCategory: "Water", description: "Water Payment" },
        { dateTime: moment(), amount: 120, category: "Utilities", subCategory: "Electricity", description: "OGPL" },
        { dateTime: moment(), amount: 245, category: "Church", subCategory: "Church of the Water Lake", description: "Debit payment water lake" }
      ];
      response.send(JSON.stringify(transactions));
    }); 
  }
}