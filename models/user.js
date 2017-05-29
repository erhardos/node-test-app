const bookshelf = require('../db/bookshelf')
const Promise  = require('bluebird')
const bcrypt   = Promise.promisifyAll(require('bcrypt-nodejs'))
'use strict'

let Users = bookshelf.Model.extend({
  tableName: 'users',
  hidden: ['password'],
  initialize: function () {
    this.on('saving', this.onSaving)
  },

  onSaving: (model, attrs, options) => {
    if (model.isNew() || model.hasChanged('password')) {
      const user = model,
        SALT_FACTOR = 5

      return new Promise(function(resolve, reject) {
        bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
          if (err) throw 'error while gen salt...'

          bcrypt.hash(user.get('password'), salt, null, (err, hash) => {
            if (err) throw 'error while hashing password...'
            user.set('password', hash)
            resolve(hash) // data is created only after this occurs
          });
        });
      });

    }
  },
},{
  // methods
  comparePassword: Promise.method(function(username, candidatePassword) {
    if (!username || !candidatePassword)
      throw new Error('Email and password are both required')
    return this.forge({username: username.toLowerCase().trim()}).fetch({require: true})
      .tap(user => bcrypt.compareAsync(candidatePassword, user.get('password')).then(() => true))
  })
})

module.exports = Users
