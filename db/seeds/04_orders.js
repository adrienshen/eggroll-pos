
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('orders').del()
    .then(function () {
      // Inserts seed entries
      return knex('orders').insert([
        {id: 1, merchant_id: 3, customer_id: 1, pickup_in: 15, status: 'started'},
        {id: 2, merchant_id: 3, customer_id: 2, pickup_in: 30, status: 'started'},
      ]);
    });
};
