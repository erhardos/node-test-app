const express     = require('express'),
  router          = express.Router(),
  passport        = require('passport'),
  passportService = require('../config/passport'),
  PostsController = require('../controllers/posts')

const requireAuth = passport.authenticate('jwt', {session: false})

router.get('/', PostsController.getAll)
router.get('/:id', PostsController.getOne)
router.post('/', requireAuth, PostsController.create)
router.put('/:id', requireAuth, PostsController.update)

module.exports = router
