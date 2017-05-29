const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  passportService = require('../config/passport'),
  usersService = require('../services/users')
  ReferenceError = require('../utils/ResponseError')

const requireLogin = passport.authenticate('local', {session: false})
const requireAuth = passport.authenticate('jwt', {session: false})

router.post('/login', requireLogin, (req, res) => {
  usersService
    .getUserInfo(req.user)
    .then(userInfo => {
      res.status(200).json({
        token: 'JWT ' + usersService.generateToken(userInfo),
        user: userInfo
      })
    })
    .catch(err => {
      if (err.code)
        return res(err.code).json({message: err.message})
      res.status(400).json({message: 'Error during login'})
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
        throw new ResponseError('That username is already in use.', 422)

      // If email is unique and password was provided, create account
      return usersService.create(userObj)
    })
    .then(user => usersService.getUserInfo(user))
    .then(userInfo => res.status(201).json({
        token: 'JWT ' + usersService.generateToken(userInfo),
        user: userInfo
      })
    )
    .catch(err => {
      if (err.code)
         return res.status(err.code).json({error: err.message})
      res.status(500).json({error: "more than broken!!", err})
    })
})

router.delete('/delete', requireAuth, (req, res) => {
  usersService
    .getUserInfo(req.user)
    .then(user => usersService.destroy(user.id))
    .then(() => res.status(204).send())
    .catch(() => {
       res.status(400).json({message: 'Error while processing, account was not deleted!'})
    })
})

module.exports = router
