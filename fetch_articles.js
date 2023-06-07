const https = require('https');
const db = require('./models/database');
const API_KEY = "PpPKLCnwsry6aXNOgQni7EWSMdcb4pw6Vvv4N7wc";

const yesterdayDate = () => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear()
    return y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

const ARTICLE_API_URL = 'https://api.marketaux.com/v1/news/all?exchanges=NASDAQ&limit=3&published_after=' + yesterdayDate() + '&api_token=' + API_KEY;

function getArticles() {
    return new Promise((resolve, reject) => {
        https.get(ARTICLE_API_URL, res => {
            let data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', async () => {
                const apidata = JSON.parse(Buffer.concat(data).toString());
                const articles = apidata.data;
                for (let i = 0; i < articles.length; i++) {
                    try {
                        await db.Article.add(articles[i]);
                        console.log("Article Added");
                    } catch (e) {
                        console.log("SQL Returned: " + e);
                    }
                }
                return resolve();
            });

        }).on('error', () => {
            console.log("Request failed");
            return reject();
        });
    });
}

async function run() {
    console.log("/*** GET API ARTICLES ***/");
    console.log("Fetch started...");
    await getArticles();
    console.log("---------------");
    console.log("DONE!");
    process.exit();
}

run();


