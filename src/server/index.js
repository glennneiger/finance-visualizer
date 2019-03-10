const express = require("express");
const TransactionsHandler = require("./handler/transactions-handler.js");
var app = express();

new TransactionsHandler(app);
app.listen(8080, function () {
  console.log('Finance Visualizer Listening on port 8080!');
});