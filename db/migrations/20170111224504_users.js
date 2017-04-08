exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.string('email').notNullable()
    })
  ])
}
exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.dropColumn('email')
    })
  ])
}
