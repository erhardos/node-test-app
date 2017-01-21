const express = require('express'),
  Posts = require('../models/posts'),
  Users = require('../models/user'),
  router = express.Router(),
  config = require('../config/main'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  passportService = require('../config/passport'),
  utils = require('../utils/utils')

const requireAuth = passport.authenticate('jwt', {session: false});

router.post('/add', requireAuth, (req, res) => {
  const user = utils.setUserInfo(req)
  Posts
    .forge({
    user_id: user.id,
    title: req.body.title,
    content: req.body.content,
    })
    .save()
    .then(saved => {
      res.json({saved});
    })
    .catch(() => {
      res.json({
        message: 'invalid payload!'
      })
    });
})

router.get('/all', (req, res) => {
  Posts
    .fetchAll()
    .then(data => {
      res.json({data});
    });
})

module.exports = router;
