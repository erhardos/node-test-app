'use strict'
let bookshelf = require('../db/bookshelf');
let User = require('./user')
let Posts = bookshelf.Model.extend({
  tableName: 'posts',

  user: function() {
    return this.belongsTo(User);
  }
});

module.exports = Posts;
