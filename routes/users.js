const express = require('express'),
  fs =          require('fs'),
  Users =       require('../models/user'),
  router =      express.Router(),
  config =      require('../config/main'),
  jwt =         require('jsonwebtoken'),
  passport =    require('passport'),
  passportService = require('../config/passport'),
  _ = require('lodash'),
  utils = require('../utils/utils')

const requireLogin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

/* GET users listing. */
router.get('/', function (req, res, next) {

  fs.readFile("/tmp/test", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    try {
      let json = JSON.parse(data);
    } catch (err) {
      console.log('ups invalid json')
      return;
    }
    res.json(data);
  })
});

router.get('/all', (req, res) => {
  Users
    .fetchAll()
    .then(function (data) {
      res.json({data});
    });
})

router.post('/addsm/', function (req, res) {
  let text;

  try {
    text = req.body.text;
    console.log(text);
  } catch (err) {
    res.json(err)
  }
  if (typeof text == 'undefined') {
    res.json('fail');
  }
  fs.writeFile("/tmp/test", text, function (err) {
    if (err) {
      res.json(err);
      return
    }

    console.log("The file was saved!");
    res.json('ok')
  });
})


module.exports = router;
