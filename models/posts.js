'use strict'
const bookshelf = require('../db/bookshelf')
const User      = require('./user')
const validator = require('validator')
const _         = require('lodash')

const fields = ['user_id', 'title', 'content']
// TODO: make validation rules throw appropriate errors
const validationRules = {
    title: val => validator.isByteLength(val, {min: 3, max: 255}),
    content: val => true,
    user_id: val => _.isNumber(val)
}

const validate = require('../utils/utils').validate(fields, validationRules)

let Posts = bookshelf.Model.extend({
  tableName: 'posts',

  user () {
    return this.belongsTo(User)
  },

  patch(body) {
    return validate(body).then(body => this.save(body, {patch: true}))
  },

}, {
  createNewPost (newPost) {
    return validate(newPost).then(body => this.forge(body).save())
  },

})

module.exports = Posts
