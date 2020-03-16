exports.up = knex => knex.schema.table('orders', (table) => {
  table.boolean('paid');
  table.string('payment_method');
});

exports.down = knex => knex.schema.table('orders', (table) => {
  table.dropColumn('paid');
  table.dropColumn('payment_method');
});
