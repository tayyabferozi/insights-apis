const axios = require("axios");
const NodeCache = require("node-cache");
const data = require("../mock-data");

// cache store

const cache = new NodeCache({ stdTTL: 15 }); // refreshes every 15 seconds

// Re-usable function which returns a promise returning the data from the API

const getTransactions = () => {
  if (process.env.NODE_ENV === "test") {
    // console.log(data);
    return data;
  }
  // If cache is there, return it!
  if (cache.has("API_RES")) {
    return { data: cache.get("API_RES") };
  }
  // else call the API
  return axios.get(process.env.API_HOST + "/transactions");
};

exports.getTransactions = getTransactions;

exports.getDateGroupedData = async (req, res) => {
  try {
    const { data } = await getTransactions();

    const grouped = {};

    cache.set("API_RES", data);

    data.forEach((el) => {
      const date = new Date(el.paymentDate).toLocaleDateString();
      if (grouped.hasOwnProperty(date)) {
        grouped[date].totalNum += 1;
        grouped[date].totalValue += el.amount;
        grouped[date].averageValue =
          grouped[date].totalValue / grouped[date].totalNum;
      } else {
        grouped[date] = {
          totalNum: 1,
          totalValue: el.amount,
          averageValue: el.amount,
        };
      }
    });

    res.json({ success: true, grouped });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Uh Oh! Something went wrong!" });
  }
};

exports.getCategoryGroupedData = async (req, res) => {
  try {
    const { data } = await getTransactions();

    const grouped = {};

    cache.set("API_RES", data);

    data.forEach((el) => {
      const categoryName = el.category;
      if (grouped.hasOwnProperty(categoryName)) {
        grouped[categoryName].totalNum += 1;
        grouped[categoryName].totalValue += el.amount;
        grouped[categoryName].averageValue =
          grouped[categoryName].totalValue / grouped[categoryName].totalNum;
      } else {
        grouped[categoryName] = {
          totalNum: 1,
          totalValue: el.amount,
          averageValue: el.amount,
        };
      }
    });

    res.json({ success: true, grouped });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Uh Oh! Something went wrong!" });
  }
};
