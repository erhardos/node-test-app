const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  passportService = require('../config/passport'),
  utils = require('../services/utils'),
  usersService = require('../services/users')

const requireLogin = passport.authenticate('local', {session: false})
const requireAuth = passport.authenticate('jwt', {session: false})

router.post('/login', requireLogin, (req, res) => {

  let userInfo = utils.setUserInfo(req.user)

  res.status(200).json({
    token: 'JWT ' + usersService.generateToken(userInfo),
    user: userInfo
  })
})

router.post('/register', (req, res) => {
  // Check for registration errors
  const userObj = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }

  if (!userObj.username || !userObj.email || !userObj.password)
    return res.status(400).send({error: 'There are some required fields!'})

  usersService
    .getOneByUsername(userObj.username)
    .then(existingUser => {

      // If user is not unique, return error
      if (existingUser)
        return res.status(422).json({error: 'That username is already in use.'})

      // If email is unique and password was provided, create account
      usersService
        .create(userObj)
        .then(user => {
          // Respond with JWT if user was create

          const userInfo = utils.setUserInfo(user)

          res.status(201).json({
            token: 'JWT ' + usersService.generateToken(userInfo),
            user: userInfo
          })
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({error: 'something is broken!', err})
        })
    })
    .catch(err =>
      res.status(500).json({error: "more than broken!!", err})
    )
})

router.delete('/delete', requireAuth, (req, res) => {
  const user = utils.setUserInfo(req.user)
  usersService
    .destroy(user.id)
    .then(()=>{
      res.status(204)
    })
    .catch(()=> {
      res.json({
        message: 'Error while processing, account was not deleted!'
      })
    })
})

module.exports = router