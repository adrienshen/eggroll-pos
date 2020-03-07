
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('receipts').del()
    .then(function () {
      // Inserts seed entries
      return knex('receipts').insert([
        {id: 1, order_id: 1, payment_method: 'store', subtotal_cents: 760, tax_cents: 53},
      ]);
    });
};
