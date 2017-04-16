exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.string('email').notNullable()
      table.boolean('active').default('true').notNullable()
    })
  ])
}
exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.dropColumn('email')
      table.dropColumn('active')
    })
  ])
}
