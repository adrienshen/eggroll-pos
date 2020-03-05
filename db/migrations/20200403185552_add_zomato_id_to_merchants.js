
exports.up = knex => knex.schema.table('merchants', (table) => {
  table.integer('zomato_id').unsigned().index();
});

exports.down = knex => knex.schema.table('merchants', (table) => {
  table.dropColumn('zomato_id');
});
