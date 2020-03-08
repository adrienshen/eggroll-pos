
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('merchants').del()
    .then(function () {
      // Inserts seed entries
      return knex('merchants').insert([
        {id: 1, business_name: 'Facebook SG', postal_code: '018937', address: '9 Straits View Marina One, Singapore', type: 'tech'},
        {id: 2, business_name: 'SQC Lounge', postal_code: '15228', address: '723 Washington Rd, Pittsburgh, PA', type: 'cafe'},
        {id: 3, business_name: 'Eastern Express', postal_code: '21532', address: '109 E Main St, Frostburg, MD', type: 'cafe'},
      ]);
    });
};
