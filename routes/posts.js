const express     = require('express'),
  router          = express.Router(),
  passport        = require('passport'),
  passportService = require('../config/passport'),
  validator       = require('validator'),
  _               = require('lodash')
  assert          = require('assert')
  postService     = require('../services/posts')
  userService     = require('../services/users')

const requireAuth = passport.authenticate('jwt', {session: false})

router.get('/', (req, res) => {
  postService
    .getAll()
    .then(data => {
      res.json({data})
    })
    .catch(err =>{
      res.status(500).json({msg:'B like broken.'})
    })
})

router.get('/:id', (req, res) => {
  postService
    .getOneById(req.params.id)
    .then(data => {
      if (data)
        res.json({data})
      else
        res.status(404).json({msg: 'Post does not exists.'})
    })
    .catch(err => {
      res.status(500).json({msg:'B like broken.'})
    })
})

router.post('/', requireAuth, (req, res) => {
  userService
    .getUserInfo(req.user)
    .then(user => {
      postService
        .create({
          user_id: user.id,
          title: req.body.title,
          content: req.body.content
        })
        .then(data => {
          res.json({data})
        })
        .catch(err => {
          throw new Error(err.message ? err.message : 'invalid payload!')
        })
      })
    .catch(err => {
      res.status(400).json({
        message: err.message
      })
    })
})

router.put('/:id', requireAuth, (req, res) => {
  userService
    .getUserInfo(req.user)
    .then(user => {
      postService
        .getOneById(req.params.id)
        .then(post => {
          if(!post)
            return res.status(404).json({msg: 'Post does not exists.'})

          if (post.get('user_id') !== user.id) {
            return res.status(401).json({msg: 'You don\'t have permission to do that.'})
          }

          post
            .patch(req.body)
            .then(data => {
              res.status(200).json({data})
            })
            .catch(err => {
              res.status(400).json({
                message: err.message
              })
            })
        })
        .catch(err => {
          throw new Error(err.message)
        })
    })
    .catch(err => {
      res.status(500).json({msg:'B like broken.'})
    })

})


module.exports = router
