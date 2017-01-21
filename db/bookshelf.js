let knex = require('./knex')
let bookshelf = require('bookshelf')(knex);
bookshelf.plugin('visibility');

module.exports = bookshelf;
