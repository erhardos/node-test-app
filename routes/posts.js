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

router.get('/', (req, res) => {
  postService
    .getAll()
    .then(data => {
      res.json({data})
    })
    .catch(err =>{
      if (err.code)
        return res.status(err.code).json({msg: err.message})
      res.status(500).json({msg:'B like broken.'})
    })
})

router.get('/:id', (req, res) => {
  postService
    .getOneById(req.params.id)
    .then(data => {
      if (data)
        res.json({data})
      else {
        throw new ResponseError('Post does not exists.', 404)
      }

    })
    .catch(err => {
      if (err.code)
        return res.status(err.code).json({msg: err.message})
      res.status(500).json({msg:'B like broken.'})
    })
})

router.post('/', requireAuth, (req, res) => {
  userService
    .getUserInfo(req.user)
    .then(user => postService.create({user_id: user.id,
                                      title: req.body.title,
                                      content: req.body.content})
    )
    .then(data => res.json({data}))
    .catch(err => {
      if (err.code)
        return res.status(err.code).json({msg: err.message})
      res.status(400).json({message: err.message})
    })
})

router.put('/:id', requireAuth, (req, res) => {
  let authUser = null
  userService
    .getUserInfo(req.user)
    .then(user => {
      authUser = user
      return postService.getOneById(req.params.id)
    })
    .then(post => {
      if (!post)
        throw new ResponseError ('Post does not exists.', 404)
      if (post.get('user_id') !== authUser.id)
        throw new ResponseError ('You don\'t have permission to do that.', 401)

      return post.patch(req.body)
    })
    .then(data => res.status(200).json({data}))
    .catch(err => {
      if (err.code)
        return res.status(err.code).json({msg: err.message})
      return res.status(500).json({msg:'B like broken.'})
    })

})


module.exports = router
