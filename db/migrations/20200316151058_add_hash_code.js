exports.up = knex => knex.schema.table('merchants', (table) => {
  table.string('mhash');
});

exports.down = knex => knex.schema.table('merchants', (table) => {
  table.dropColumn('mhash');
});
