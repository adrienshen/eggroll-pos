
exports.up = function(knex) {
  return knex.schema.createTable('orders', t => {
    t.increments('id');
    t.integer('merchant_id').unsigned().notNullable().index();
    t.integer('customer_id').unsigned().notNullable().index();
    t.foreign('merchant_id').references('id').inTable('merchants').onUpdate('CASCADE').onDelete('RESTRICT');
    t.foreign('customer_id').references('id').inTable('customers').onUpdate('CASCADE').onDelete('RESTRICT');
    t.integer('pickup_in').unsigned();
    t.string('status').notNullable();
    t.uuid('uuid').index();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  })
  .createTable('menu_items', t => {
    t.increments('id');
    t.integer('merchant_id').unsigned().notNullable().index();
    t.foreign('merchant_id').references('id').inTable('merchants').onUpdate('CASCADE').onDelete('RESTRICT');
    t.string('name');
    t.string('description');
    t.string('price_cents');
  })
  .createTable('receipts', t => {
    t.increments('id');
    t.integer('order_id').unsigned().notNullable().index();
    t.foreign('order_id').references('id').inTable('orders').onUpdate('CASCADE').onDelete('RESTRICT');
    t.string('payment_method').defaultTo('in_store');
    t.integer('subtotal_cents');
    t.integer('tax_cents');
    t.integer('total_cents');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('menu_items')
    .dropTableIfExists('receipts')
    .dropTableIfExists('orders')
};
