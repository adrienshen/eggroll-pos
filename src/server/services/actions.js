const _ = require('lodash');

const Orders = require('../models/orders');
const Customers = require('../models/customers');
const Merchants = require('../models/merchants');
const Receipts = require('../models/receipts');

async function startOrderingChat(params) {
  // @todo: implement start chat flow

}

async function initiatOrderProcess({psid, merchantId}) {
  // Creates new order
  let customer = await Customers.getWithPSID(psid);
  console.log('customer >> ', customer);

  // @todo: check if merchant exists in database and can accept orders
  const m = await Merchants.get(merchantId);
  if (!m || m.id) {
    throw Error(`Merchant with id ${m.id} not founded!`);
  }

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

async function getCustomersOrders({psid}) {
  // @todo: given psid, get all of customers previous and current orders
}

async function updateOrderPickupTime({psid, orderId, time}) {
  // @todo: update order pickup time
  // time: Integer = 15, 30, 45, 60

  if (!psid || !orderId || !time) {
    throw Error('Params missing');
  }

  // Quick validation
  if ([15, 30, 45, 60].indexOf(parseInt(time)) === -1) {
    throw Error('Time format is wrong or missing');
  }

  // Make sure customer with psid exists
  const customer = await Customers.getWithPSID(psid);
  if (!customer || !customer.id) {
    throw Error(`No customer with ${psid} found`);
  }

  const params = {pickup_in: time};
  const order = await Orders.update(orderId, params);
  console.log('updated order: ', order);
  return order;
}

async function addOrderLineItem(params) {
  // @todo: adds order line items

}

/**
 * Used to send direct messages from Merchant to Customer
 * @param {*} params 
 */
async function sendCustomerDirectMessageFromMerchant(params) {
  console.into('@todo');
}

/**
 * Used to send direct messages from Customer to Merchant
 * @param {*} params 
 */
async function sendMerchantDirectMessageFromCustomer(params) {
  console.log('@todo');
}

async function createReceipt({orderId, paymentMethod}) {
  // Checks if the order exist
  const order = await Orders.getWithID(orderId);
  if (!order || !order.id) {
    throw Error(`No order with order id #${orderId} found`);
  }
  
  const params = {
    subtotalCents : 123, // Where should the cost be generated?
    taxCents : 123,
    totalCents : 123
  }
  
  // Creates new receipt
  const receiptId = await Orders.create({orderId, paymentMethod, params});
  return receiptId;
  
}

async function getReceipt({receiptId}) {
  const receipt =  await Receipts.getWithId(receiptId);
  if (!receipt || !receipt.id) {
    throw Error(`No receipt with receipt id #${receiptId} found`);
  }
  return receipt;
}

module.exports = {
  initiatOrderProcess,
  getNearbyShops,
  getMerchantOrders,
  updateOrderPickupTime,
  getReceipt,
  // addOrderLineItem,
  // sendCustomerTextMessageFromMerchant,
};
