
exports.up = function(knex) {
  return knex.schema.table('customers', (table) => {
    table.string('mobile_phone');
  });
};

exports.down = function(knex) {
  return knex.schema.table('customers', (table) => {
    table.dropColumn('mobile_phone');
  });
};
