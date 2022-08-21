const axios = require("axios");
const fs = require("fs");

const data = require("../mock-data");

// Re-usable function which returns a promise returning the data from the API

const getTransactions = () => {
  if (process.env.NODE_ENV === "test") {
    // console.log(data);
    return data;
  }
  // If cache is there, return it!

  let cacheStorage;
  if (fs.existsSync("./cache.json")) {
    cacheStorage = fs.readFileSync("./cache.json", {
      encoding: "utf8",
      flag: "r",
    });

    cacheStorage = JSON.parse(cacheStorage);

    // If less than 15 seconds have passed since the file was writter
    if ((Date.now() - new Date(cacheStorage.time).getTime()) / 1000 < 15) {
      return cacheStorage;
    }
  }

  // else call the API
  return axios.get(process.env.API_HOST + "/transactions");
};

exports.getTransactions = getTransactions;

exports.getDateGroupedData = async (req, res) => {
  try {
    const { data } = await getTransactions();

    fs.writeFileSync(
      "./cache.json",
      JSON.stringify({ data, time: new Date() })
    );

    const grouped = data.reverse().reduce((acc, el) => {
      const date = new Date(el.paymentDate).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          totalNum: 0,
          totalValue: 0,
          averageValue: 0,
        };
      }

      const newCount = acc[date].totalNum + 1;
      const newTotal = acc[date].totalValue + el.amount;
      const newAvg = newTotal / newCount;

      return {
        ...acc,
        [date]: {
          totalNum: newCount,
          totalValue: newTotal,
          averageValue: newAvg,
        },
      };
    }, {});

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

    fs.writeFileSync(
      "./cache.json",
      JSON.stringify({ data, time: new Date() })
    );

    const grouped = data.reduce((acc, el) => {
      const categoryName = el.category;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          totalNum: 0,
          totalValue: 0,
          averageValue: 0,
        };
      }

      const newCount = acc[categoryName].totalNum + 1;
      const newTotal = acc[categoryName].totalValue + el.amount;
      const newAvg = newTotal / newCount;

      return {
        ...acc,
        [categoryName]: {
          totalNum: newCount,
          totalValue: newTotal,
          averageValue: newAvg,
        },
      };
    }, {});

    res.json({ success: true, grouped });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Uh Oh! Something went wrong!" });
  }
};
