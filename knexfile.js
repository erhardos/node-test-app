// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'blog',
      user:     'blog_user',
      password: 'blog'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds'
    }
  },
  test: {
   client: 'postgresql',
   connection: {
     database: 'blog_test',
     user:     'blog_user',
     password: 'blog'
   },
   migrations: {
     directory: __dirname + '/db/migrations'
   },
   seeds: {
     directory: __dirname + '/db/seeds'
   }

 }
}
