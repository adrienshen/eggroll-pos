const _ = require('lodash');

const Orders = require('../models/orders');
const Customers = require('../models/customers');
const Merchants = require('../models/merchants');

async function createNewOrder({psid, merchantId}) {
  // Creates new order
  let customer = await Customers.getWithPSID(psid);
  console.log('customer >> ', customer);

  // @todo: check if merchant exists in database and can accept orders
  const m = await Merchants.get(merchantId);

  if (!customer || !customer.id) {
    console.log(`Creating new customer with psid ${psid}`);
    const customerId = await Customers.create({
      psid,
      // @todo: get name from profile
      name: `New Customer: ${psid}`,
    });
    const orderId = await Orders.create({merchantId, customerId});
    return orderId;
  }

  // console.log('customer{}', customer);
  const orderId = await Orders.create({merchantId, customerId: customer.id});
  return orderId;
}

async function getNearbyShops(params) {
  // @todo: given location data, get nearby shops for Customer
  return [];
}

async function getMerchantOrders({merchantId}) {
  await Merchants.customers(merchantId);
  return await Merchants.orders(merchantId);
}

async updateOrderPickupTime(params) {
  // @todo: update order pickup time
}

async addOrderLineItem(params) {
  // @todo: adds order line items

}

module.exports = {
  createNewOrder,
  getNearbyShops,
  getMerchantOrders,
  updateOrderPickupTime,
  addOrderLineItem,
};