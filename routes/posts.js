const express = require('express'),
  Posts = require('../models/posts'),
  Users = require('../models/user'),
  router = express.Router(),
  config = require('../config/main'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  passportService = require('../config/passport'),
  utils = require('../utils/utils')

const requireAuth = passport.authenticate('jwt', {session: false})

router.post('/add', requireAuth, (req, res) => {

  const newPost = {
    user_id: utils.setUserInfo(req.user).id,
    title: req.body.title,
    content: req.body.content
  }

  Posts
    .createNewPost(newPost)
    .then(saved => {
      res.json({saved})
    })
    .catch((err) => {
      let msg = err.msg ? err.msg : 'invalid payload!'
      res.status(400).json({
        message: msg
      })
    })
})

router.get('/all', (req, res) => {
  Posts
    .fetchAll()
    .then(data => {
      res.json({data})
    })
})

module.exports = router
