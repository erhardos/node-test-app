
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', table =>{
    table.increments();
    table.string('title').notNullable();
    table.integer('user_id').unsigned().references('users.id').nullable();
    table.text('content').nullable();
    table.timestamps();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};
