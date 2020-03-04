
exports.up = knex => knex.schema.table('merchants', (table) => {
  table.integer('zomato_id').unsigned().index();
});

exports.down = knex => knex.schema.table('merchants', (table) => {
  table.dropColumn('postal_code');
  table.dropColumn('address');
});
