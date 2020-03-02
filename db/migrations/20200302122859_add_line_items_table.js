
exports.up = function(knex) {
  return knex.schema.createTable('line_items', t => {
    t.increments('id')
    t.integer('menu_item_id').unsigned().notNullable().index();
    t.foreign('menu_item_id').references('id').inTable('menu_items').onUpdate('CASCADE').onDelete('RESTRICT');
    t.integer('order_id').unsigned().notNullable().index();
    t.foreign('order_id').references('id').inTable('orders').onUpdate('CASCADE').onDelete('RESTRICT');
    t.text('comments')
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at');
  });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('line_items')
};
