
exports.up = knex => knex.schema.table('orders', (table) => {
  table.timestamp('accepted_at');
});

exports.down = knex => knex.schema.table('orders', (table) => {
  table.dropColumn('accepted_at');
});
