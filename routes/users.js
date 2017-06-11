const express     = require('express'),
  multer          = require('multer'),
  router          = express.Router(),
  config          = require('../config/main'),
  jwt             = require('jsonwebtoken'),
  passport        = require('passport'),
  passportService = require('../config/passport'),
  uploadAvatar    = require('../services/fileUpload').avatar,
  UsersController = require('../controllers/users')

const requireLogin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })

/* GET users listing. */
router.get('/all', requireAuth, UsersController.getAll)
router.get('/:id', requireAuth, UsersController.getOne)
router.post('/avatar', requireAuth, uploadAvatar.single('avatar'), UsersController.uploadAvatar)

module.exports = router
