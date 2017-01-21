const express = require('express'),
  Users = require('../models/user'),
  router = express.Router(),
  config = require('../config/main'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  passportService = require('../config/passport'),
  utils = require('../utils/utils')

const requireLogin = passport.authenticate('local', {session: false});
const requireAuth = passport.authenticate('jwt', {session: false});

router.post('/login', requireLogin, (req, res) => {

  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
})

router.post('/register', (req, res) => {
  // Check for registration errors
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  if (!username || !email || !password)
    return res.status(400).send({error: 'There are some required fields fucker!'})

  Users
    .forge({username})
    .fetch()
    .then(existingUser => {

      // If user is not unique, return error
      if (existingUser)
        return res.status(422).json({error: 'That username is already in use.'});

      // If email is unique and password was provided, create account
      Users
        .forge({username, email, password})
        .save()
        .then(user => {
          // Respond with JWT if user was create

          const userInfo = utils.setUserInfo(user);

          res.status(201).json({
            token: 'JWT ' + generateToken(userInfo),
            user: userInfo
          });
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({error: 'something is broken!', err})
        });
    })
    .catch(err =>
      res.status(500).json({error: "more than broken!!", err})
    );
})

router.delete('/delete', requireAuth, (req, res) => {
  const user = utils.setUserInfo(req)
  Users
    .forge({id:user.id})
    .destroy()
    .then(()=>{
      res.status(204)
    })
    .catch(()=> {
      res.json({
        message: 'Error while processing, account was not deleted!'
      })
    })
})

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

module.exports = router;