
exports.up = knex => knex.schema.table('orders', (table) => {
  table.timestamp('confirmed_at');
});

exports.down = knex => knex.schema.table('orders', (table) => {
  table.dropColumn('confirmed_at');
});
