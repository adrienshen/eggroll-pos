
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('menu_items').del()
    .then(function () {
      // Inserts seed entries
      return knex('menu_items').insert([
        {id: 1, merchant_id: 1, name: 'Medium Coffee', description: '24oz regular coffee, option of cream and sugar added', price_cents: 1500},
        {id: 2, merchant_id: 1, name: '2 Eggs', description:'2 regular old eggs, scrambled, easy over, sunny side up', price_cents: 3000},
        // Eastern Express seed
        {id: 3, merchant_id: 3, name: 'Roast Pork Egg Roll (1)', description:'', price_cents: 130},
        {id: 4, merchant_id: 3, name: 'Wonton Soup Sm.', description:'', price_cents: 195},
        {id: 5, merchant_id: 3, name: 'L1. General Tso\'s Chicken', description:'Lunch Special, all orders with Pork Fried Rice, Monday - Saturday 11:00 AM - 3:00 PM', price_cents: 565},
        {id: 6, merchant_id: 3, name: 'L1. General Tso\'s Chicken', description:'Dinner Combination, all orders with Pork Fried Rice & Pork Egg Roll, 7 Days a Week; 11:00 AM - 11:00 AM', price_cents: 825},
      ]);
    });
};
