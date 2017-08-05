const express     = require('express'),
  multer          = require('multer'),
  router          = express.Router(),
  config          = require('../config/main'),
  jwt             = require('jsonwebtoken'),
  passport        = require('passport'),
  passportService = require('../config/passport'),
  uploadAvatar    = require('../services/fileUpload').avatar,
  UsersController = require('../controllers/users'),
  c = require('../utils/controllerHandler')

const requireLogin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })

/* GET users listing. */
router.get('/all', requireAuth, c(UsersController.getAll))
router.get('/:id', requireAuth, c(UsersController.getOne, req => [req.params.id]))
router.post('/avatar', requireAuth, uploadAvatar.single('avatar'), c(UsersController.uploadAvatar))

module.exports = router
