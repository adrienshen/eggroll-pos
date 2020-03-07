
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('line_items').del()
    .then(function () {
      // Inserts seed entries
      return knex('line_items').insert([
        {id: 1, menu_item_id: 4, order_id: 1, comments: '', quantity: 2},
        {id: 2, menu_item_id: 5, order_id: 1, comments: 'Spicy!', quantity: 1},
      ]);
    });
};
