const sql = require("..");

const Article = {};

Article.all = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT *
               FROM article
               ORDER BY date DESC LIMIT 6`, (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

Article.add = (data) => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO article (title,content,date,link,image) VALUES (?,?,?,?,?)",
      [data.title,data.snippet,mysqlDate(data.published_at),data.url,data.image_url], (err, res) => {
        if (err) { return reject(err); }
        return resolve("OK");
      });
  });
};

const mysqlDate = (date) => {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

module.exports = Article;

