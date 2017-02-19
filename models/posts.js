'use strict'
const bookshelf = require('../db/bookshelf')
const User      = require('./user')
const validator = require('validator')
const _         = require('lodash')
const Promise   = require('bluebird')

const fields = ['user_id', 'title', 'content']
// TODO: make validation rules throw appropriate errors
const validationRules = {
    title: val => validator.isByteLength(val, {min: 3, max: 255}),
    content: val => true,
    user_id: val => _.isNumber(val)
}

const validate = require('../services/utils').validate(fields, validationRules)

let Posts = bookshelf.Model.extend({
  tableName: 'posts',

  user () {
    return this.belongsTo(User)
  },

  initialize () {
    this.on('saving', this.onSaving)
  },

  onSaving: Promise.method(function (model, attrs, options) {
    return validate(attrs)
      .then(() => model)
      .catch(err => {
        throw err
      })
  }),

  patch(body) {
    return this.save(body, {patch: true})
  },

}, {

})

module.exports = Posts
