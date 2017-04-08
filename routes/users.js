const express     = require('express'),
  fs              = require('fs'),
  multer          = require('multer'),
  router          = express.Router(),
  config          = require('../config/main'),
  jwt             = require('jsonwebtoken'),
  passport        = require('passport'),
  passportService = require('../config/passport'),
  _               = require('lodash'),
  uploadAvatar    = require('../services/fileUpload').avatar
  userService     = require('../services/users')

const requireLogin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })

/* GET users listing. */
router.get('/all', requireAuth, (req, res) => {
  userService.getAllUsers().then(function (data) {
    res.json({data})
  })
})

router.get('/avatar', requireAuth,  (req, res) => {

})

router.post('/avatar', requireAuth, uploadAvatar.single('avatar'),  (req, res) => {
  res.json({msg: 'ok'})
})

router.post('/adile/', function (req, res) {
  let text

  try {
    text = req.body.text
    console.log(text)
  } catch (err) {
    res.json(err)
  }
  if (typeof text === 'undefined') {
    res.json('fail')
  }
  fs.writeFile("/tmp/test", text, function (err) {
    if (err) {
      res.json(err)
      return
    }

    console.log("The file was saved!")
    res.json('ok')
  })
})


module.exports = router
