var express = require('express');
var router = express.Router();
const db = require('../models/database');
const passport = require('passport');
var nodemailer = require('nodemailer');
const axios = require('axios');

const reCAPTCHA_secret = '6LdBAB4lAAAAAHrzFo8w0tPkCYLE6saUDRJEAx1Z';
var transporter = nodemailer.createTransport({
  host: 'smtp.postmarkapp.com',
  port: 587,
  auth: {
    user: 'c8e0122c-d02b-42df-a4da-e40278ed58f7',
    pass: 'c8e0122c-d02b-42df-a4da-e40278ed58f7'
  }
});

router.get('/', function (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user) {
    let userid = null;
    if (!err && user) userid = user.id;
    db.Stock.fetch(userid).then((rows) => {
      res.json({ data: rows });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  })(req, res);
});

router.get('/articles', function (req, res, next) {
  db.Article.all().then((rows) => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.get('/stocks', function (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user) {
    let userid = null;
    if (!err && user) userid = user.id;
    fetch(userid).then(result => {
      res.json({ data: result });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  })(req, res);
});

router.get('/categories', function (req, res, next) {
  db.Stock.allCategories(null).then(result => {
    res.json({ data: result });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.get('/categories/:query', function (req, res, next) {
  const { query } = req.params;
  db.Stock.allCategories(query).then(result => {
    res.json({ data: result });
  }).catch(e => {
    return res.status(400).json({ msg: e });
  });
});

router.get('/stocks/:query', function (req, res, next) {
  const { query } = req.params;
  passport.authenticate('jwt', { session: false }, function (err, user) {
    let userid = null;
    if (!err && user) userid = user.id;
    fetch(userid, query).then(result => {
      res.json({ data: result });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  })(req, res);
});

router.post('/topmovers', function (req, res, next) {
  const { date, categories, by } = req.body;
  if (validTopParams(date, categories, by)) {
    db.Stock.topMovers(date, categories, by).then(topResult => {
      db.Stock.topMovers(date, categories, by, 'ASC').then(bottomResult => {
        res.json({ topResult, bottomResult });
      }).catch(e => {
        return res.status(400).json({ msg: "" });
      });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  } else {
    return res.status(400).json({ msg: "" });
  }
});

router.post('/contact', async function (req, res, next) {
  const { name, email, content, token } = req.body;

  const captchaRes = await axios.post('https://www.google.com/recaptcha/api/siteverify?secret=' + reCAPTCHA_secret + '&response=' + token);
  if (!validContactParams(name, email, content) || !captchaRes.data.success)
    return res.status(400).json({ msg: "" });

  var mailOptions = {
    from: "noreply@stockmaven.net",
    to: 'netanelkluzner@gmail.com',
    replyTo: email,
    subject: 'New message from ' + name,
    html: emailHTML(name, content)
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(400).json({ msg: "" });
    } else {
      res.json({ data: "OK" });
    }
  });
});

const validContactParams = (name, email, content) => {
  let valid = (name.length > 1 && name.length < 20);
  if (valid)
    valid = (content.length > 1 && content.length < 500);
  if (valid)
    valid = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i.test(email);
  return valid;
}

const validTopParams = (date, categories, by) => {
  let valid = Array.isArray(categories);
  if (valid)
    valid = !categories.some(e => /[^\d.-]+/g.test(e));
  if (valid)
    valid = (by === 0 || by === 1);
  if (valid)
    valid = /\d{4}-\d{2}-\d{2}/g.test(date);
  return valid;
}

const fetch = (userid = null, query = "", limit = 100) => {
  return new Promise((resolve, reject) => {
    db.Stock.fetch(userid, query, limit).then(result => {
      resolve(result);
    }).catch(e => {
      return reject();
    });
  });
}

const emailHTML = (name, content) => {
  return `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title></title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      table, td, div, h1, p {font-family: Arial, sans-serif;}
    </style>
  </head>
  <body style="margin:0;padding:0;direction:ltr;">
    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
      <tr>
        <td align="center" style="padding:0;">
          <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
            <tr>
              <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;font-size:20pt;color:#123a4b;font-weight:bold">
                New message from `+ name + `
              </td>
            </tr>
            <tr>
              <td style="padding:36px 30px 42px 30px;">
              `+ content + `
              </td>
            </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

module.exports = router;


