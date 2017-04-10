exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', table =>{
    table.increments().primary()
    table.string('title').notNullable()
    table.integer('user_id').nullable().references('id').inTable('users').onDelete("SET NULL")
    table.text('content').nullable()
    table.timestamps()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts')
};
