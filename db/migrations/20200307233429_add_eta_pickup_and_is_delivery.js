
exports.up = function(knex) {
  return knex.schema.table('orders', (table) => {
    table.timestamp('eta_pickup');
    table.boolean('is_delivery').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('orders', (table) => {
    table.dropColumn('eta_pickup');
    table.dropColumn('is_delivery');
  });
};
