'use strict'
const bookshelf = require('../db/bookshelf')
const User      = require('./user')
const validator = require('validator')

let Posts = bookshelf.Model.extend({
  tableName: 'posts',

  user: function () {
    return this.belongsTo(User)
  },
}, {
  createNewPost (newPost) {
    if (!validator.isByteLength(newPost.title, {min: 3, max: 255})) {
      return Promise.reject({msg: 'Wrong length of title, should be min 3 chars and max 255 chars.'})
    }

    return this.forge(newPost).save()
  }
})

module.exports = Posts
