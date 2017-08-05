const express     = require('express'),
  router          = express.Router(),
  passport        = require('passport'),
  passportService = require('../config/passport'),
  PostsController = require('../controllers/posts'),
  c = require('../utils/controllerHandler')

const requireAuth = passport.authenticate('jwt', {session: false})

router.get('/', c(PostsController.getAll))
router.get('/:id', c(PostsController.getOne, req => [req.params.id]))
router.post('/',requireAuth, c(PostsController.create, req => [req.user, req.body]))
router.put('/:id', requireAuth, c(PostsController.update, req => [req.user, req.params.id, req.body]))

module.exports = router
