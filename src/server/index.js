var express = require('express');
var app = express();
app.use(express.static("build")); //if we don't define a response for base url, we will serve build/index.html

app.listen(8080, function () {
  console.log('Finance Visualizer Listening on port 8080!');
});