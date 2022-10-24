const path = require("path");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
require("dotenv").config();
const routes = require("./routes/index.js");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(process.env.PORT, () =>
  console.log(`Server started listening on port: ${process.env.PORT}`)
);

module.exports = app;
