var express = require('express');
var router = express.Router();
const db = require('../models/database');
const { check } = require('express-validator');
const { validateInput } = require('../middleware/validate-input');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const reCAPTCHA_secret = '6LdBAB4lAAAAAHrzFo8w0tPkCYLE6saUDRJEAx1Z';
const axios = require('axios');

router.post('/login',[
  check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  validateInput
], (req, res = response) => {
  const { email, password } = req.body;
  db.User.auth(email,password).then(rows => {
    const user = rows[0];
    const userToken = { id: user.id , email: user.email };
    const token = jwt.sign(userToken, 'RKv5QwZcXImsPCfk', {expiresIn: '5y'});
    res.json({ token: token });
  }).catch(e => {
    return res.status(400).json({ msg: e });
  });
});

router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email not valid').not().isEmpty().isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  validateInput
], async (req, res = response) => {
  const captchaRes = await axios.post('https://www.google.com/recaptcha/api/siteverify?secret=' + reCAPTCHA_secret + '&response=' + req.body.token);
  if (!captchaRes.data.success)
    return res.status(400).json({ msg: "CAPTCHA" });

  if (req.body.password.length < 6 || req.body.password.length > 18) {
    return res.status(400).json({ msg: "PASSWORD" });
  }
  db.User.register(req.body).then((id) => {
    const userToken = { id: id , email: req.body.email };
    const token = jwt.sign(userToken, 'RKv5QwZcXImsPCfk', {expiresIn: '5y'});
    return res.json({ token: token });
  }).catch(e => {
    let error_message = "";
    let sqlerror = e.sqlMessage;
    if (sqlerror.includes("UNIQUE_EMAIL")) {
      error_message = "Email already exists";
    } else {
      error_message = "Unknown error, try again later";
    }
    return res.status(400).json({ msg: error_message });
  });
});

router.get('/mydetails', passport.authenticate('jwt', { session: false }), function (req, res) {
  const userId = req.user.id;
  if (userId) {
    db.User.details(userId).then(rows => {
      res.json({ data: rows });
    }).catch(e => {
      return res.status(400).json({ msg: e });
    });
  } else {
    return res.status(400).json({ msg: "AUTH_FAIL" });
  }
});

router.get('/mysaved', passport.authenticate('jwt', { session: false }), function (req, res) {
  const userId = req.user.id;
  db.Stock.mySaved(userId).then(rows => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.post('/reorder', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const userId = req.user.id;
  try {
    const neworder = req.body.neworder.split(',');
    for (let i = 0; i < neworder.length; i++) {
      await db.Stock.reorder(i, parseInt(neworder[i]), userId).catch(e => { });
    }
    res.json({ result: "OK" });
  } catch (e) {
    return res.status(400).json({ msg: "" });
  }
});

router.delete('/removesaved/:stockid', passport.authenticate('jwt', { session: false }), function (req, res) {
  db.Stock.removeFromSaved(req.params.stockid, req.user.id).then(() => {
    res.status(200).send({ status: "DELETED" });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.post('/addsaved', passport.authenticate('jwt', { session: false }), function (req, res) {
  db.Stock.addSaved(req.body.stockid, req.user.id).then(() => {
    res.status(200).send({ status: "OK" });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.delete('/deleteaccount', passport.authenticate('jwt', { session: false }), function (req, res) {
  db.User.deleteAccount(req.user.id).then(() => {
    res.status(200).send({ status: "DELETED" });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});
module.exports = router;