const express     = require('express'),
  router          = express.Router(),
  passport        = require('passport'),
  passportService = require('../config/passport'),
  validator       = require('validator'),
  _               = require('lodash')
  assert          = require('assert')
  postService     = require('../services/posts')
  userService     = require('../services/users')
  ResponseError   = require('../utils/ResponseError')

const requireAuth = passport.authenticate('jwt', {session: false})

function errorHandler (req, res, err) {
  if (err.code)
    return res.status(err.code).json({msg: err.message})
  res.status(500).json({msg:'Unxepected error!.'})
}

router.get('/', async (req, res) => {
  try {
    const posts = await postService.getAll()
    res.json({data: posts})
  } catch (err) {
    errorHandler(req, res, err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const post = await postService.getOneById(req.params.id)
    if (!post)
      throw new ResponseError('Post does not exists.', 404)
    res.json({data: post})
  } catch (err) {
    errorHandler(req, res, err)
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const user = await userService.getUserInfo(req.user)
    const createdPost = await postService.create({
      user_id: user.id,
      title: req.body.title,
      content: req.body.content
    })
    res.json({data: createdPost})
  } catch (err) {
    errorHandler(req, res, err)
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const user = await userService.getUserInfo(req.user)
    const post = await postService.getOneById(req.params.id)
    if (!post)
      throw new ResponseError ('Post does not exists.', 404)
    if (post.get('user_id') !== user.id)
      throw new ResponseError ('You don\'t have permission to do that.', 401)

    const updatedPost = await post.patch(req.body)
    res.json({data: updatedPost})
  } catch (err) {
    console.log(err)
    errorHandler(req, res, err)
  }
})

module.exports = router
