var express = require('express');
var router = express.Router();
const https = require('https');
const db = require('../models/database');
const API_KEY = "WFB176B27UHHBCFS";
const STOCK_API_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&apikey=' + API_KEY + '&symbol=';


router.get('/stocks', async function (req, res, next) {
    console.log("/*** FETCH STOCKS ***/");
    console.log("Fetch started...");
    let rows = await fetchSymbols();
    console.log("Stocks fetched");

    console.log("/*** GET API DATA ***/");
    for (let i = 0; i < rows.length; i++) {
        await getStockData(rows[i].symbol, rows[i].id);
        totalcount++;
    }

    console.log("---------------");
    console.log("DONE!");
    console.log("---------------");
    console.log("Result: " + (totalcount - successcount) + " failed");

    res.json({ result: "Result: " + (totalcount - successcount) + " failed" });
});


function fetchSymbols() {
    return new Promise((resolve, reject) => {
        db.Stock.allSymbols().then((rows) => {
            resolve(rows);
        }).catch(e => {
            reject(null);
            console.log("Couldn't get data");
            return;
        });
    });
}

// timeindex - index of time series array.
// 0 for the latest data, 1 for the second latest data, ...
var successcount = 0, totalcount = 0;
function getStockData(symbol, stockid, timeindex = 0) {
    return new Promise((resolve, reject) => {
        https.get(STOCK_API_URL + symbol, res => {
            let data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                let apidata;
                try {
                    apidata = JSON.parse(Buffer.concat(data).toString());
                } catch (e) {
                    console.log("!!!! | " + symbol + " fetch failed, retrying...");
                    console.log(e);
                    setTimeout(() => {
                        getStockData(symbol, stockid, timeindex);
                        return resolve();
                    }, 1000 * 10);
                }
                if (Object.keys(apidata).length === 1) {
                    console.log("Too many calls, waiting 60 seconds...");
                    setTimeout(() => {
                        getStockData(symbol, stockid, timeindex);
                        return resolve();
                    }, 1000 * 60);
                } else {
                    const timeseries = apidata[Object.keys(apidata)[1]];
                    if (!timeseries) {
                        console.log("!!!! | " + symbol + " fetch failed:");
                        console.log(apidata);
                        return resolve();
                    }
                    const todaysdata = timeseries[Object.keys(timeseries)[timeindex]];

                    const stockdata = {};
                    stockdata.open = todaysdata[Object.keys(todaysdata)[0]];
                    stockdata.high = todaysdata[Object.keys(todaysdata)[1]];
                    stockdata.low = todaysdata[Object.keys(todaysdata)[2]];
                    stockdata.close = todaysdata[Object.keys(todaysdata)[3]];
                    stockdata.date = Object.keys(timeseries)[timeindex];
                    stockdata.stockid = stockid;

                    console.log(symbol + " loaded, starting SQL insert...");
                    db.Stock.insertStockData(stockdata).then((result) => {
                        console.log("SQL Returned: " + result);
                        successcount++;
                        return resolve();
                    });
                }
            });

        }).on('error', () => {
            console.log("Request failed for " + symbol);
            return reject();
        });
    });
}




module.exports = router;


