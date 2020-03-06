
exports.up = function(knex) {
  return knex.schema.table('line_items', (table) => {
    table.integer('quantity');
  });
};

exports.down = function(knex) {
  return knex.schema.table('line_items', (table) => {
    table.dropColumn('quantity');
  });
};
