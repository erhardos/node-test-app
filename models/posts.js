'use strict'
const bookshelf = require('../db/bookshelf')
const User      = require('./user')
const _         = require('lodash')
const Promise   = require('bluebird')


const model = {
  title: {
    type: 'string',
    require: true,
    length: {min: 3, max: 255},
  },
  content: {
    type: 'string'
  },
  user_id: {
    type: 'number',
  }
}

let validate = require('../services/validator')(model)

let Posts = bookshelf.Model.extend({
  tableName: 'posts',

  user () {
    return this.belongsTo(User)
  },

  initialize () {
    this.on('saving', this.onSaving)
  },

  onSaving: Promise.method(function (model, attrs) {
    // attrs is empty if new object is created
    const attributes = _.isEmpty(attrs) ? model.attributes : attrs
    return validate(attributes, model.isNew())
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
