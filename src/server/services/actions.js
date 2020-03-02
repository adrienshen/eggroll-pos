const _ = require('lodash');

const Order = require('../models/orders');

async function createNewOrder(params) {
  // create new order
  const merchantId = 1;
  const customerId = 2;
  await Order.create({merchantId, customerId});
}

async function getNearbyShops({params}) {
  // @todo: given location data, get nearby shops for Customer
  return [];
}

module.exports = {
  createNewOrder,
  getNearbyShops,
};
