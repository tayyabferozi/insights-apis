require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

// middlewares
const { getDateGroupedData, getCategoryGroupedData } = require("./controllers");

const app = express();

// To log the req/res

app.use(morgan("dev"));

const port = process.env.PORT || 5000;

// @route   GET /api/insights/categories
// @desc    To return the insights sorted by category
// @access  public

app.get("/api/insights/categories", getCategoryGroupedData);

// @route   GET /api/insights/cashflow
// @desc    To return the insights sorted by category
// @access  public

app.get("/api/insights/cashflow", getDateGroupedData);

app.get("/", (req, res) => {
  res.send("Works!");
});

app.listen(5000, () => {
  console.log("Server start on port " + port);
});

module.exports = app;
