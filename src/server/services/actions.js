const _ = require('lodash');

const Orders = require('../models/orders');
const Customers = require('../models/customers');
const Merchants = require('../models/merchants');

async function createNewOrder({psid, merchantId}) {
  // Creates new order
  const customer = await Customers.get(psid);
  await Orders.create({merchantId, customerId: customer.id});

}

async function getNearbyShops({params}) {
  // @todo: given location data, get nearby shops for Customer
  return [];
}

module.exports = {
  createNewOrder,
  getNearbyShops,
};
