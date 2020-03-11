const _ = require('lodash');
const request = require("request");

const Orders = require('../models/orders');
const Customers = require('../models/customers');
const Merchants = require('../models/merchants');
const LineItems = require('../models/lineItems');
const MenuItems = require('../models/menu_items');
const Receipts = require('../models/receipts');

const GraphAPI = require('../services/graph-apis');
const Dialog = require('../services/dialog');

// Helpers
const {getTimeUntilPickup} = require('../../shared/orders');

async function startOrderingChat({psid}) {
  const profile = await GraphAPI.getUserProfile(psid);
  let name = '';
  if (profile && profile.first_name) {
    name = `${profile.first_name} ${profile.last_name}`;
  }

  const customer = await Customers.getWithPSID(psid);
  if (!customer || !customer.id) {
    const customerId = await Customers.create({
      psid,
      name,
    });
    return Dialog.introduction(psid, profile);
  }

  Dialog.introduction(psid, customer);
}

async function initiatOrderProcess({psid, merchantId}) {
  if (!psid || !merchantId) return;
  // Creates new order
  let customer = await Customers.getWithPSID(psid);
  console.log('customer >> ', customer);

  // @todo: check if merchant exists in database and can accept orders
  const merchant = await Merchants.get(merchantId);
  if (!merchant || !merchant.id) {
    throw Error(`Merchant with id ${m.id} not founded!`);
  }

  const orderId = await Orders.create({merchantId, customerId: customer.id});
  return orderId;
}

async function getNearbyShops(lat, lon) {
  try {
    const resp = await requestNearbyShops(lat, lon);

    let shops = resp.nearby_restaurants.map(res => res.restaurant);
    const zomatoIds = shops.map(shop => shop.id);
    const validMerchants = await Merchants.getByZomatoIds(zomatoIds);

    // mapping of zomatoIds to merchantId
    const merchantIdMap = new Map(validMerchants.map(i => [i.zomato_id, i.id]));
    // filter to display shops that are working with us
    shops = shops.filter(shop => merchantIdMap.has(parseInt(shop.id)));
    // append merchantId as part of result
    shops.forEach(shop => shop.merchantId = merchantIdMap.get(parseInt(shop.id)));

    return shops;
  } catch (err) {
    console.log("getNearbyShops failed:", err);
  }
}

function requestNearbyShops(lat, lon) {
  return new Promise(function (resolve, reject) {
    request({
      headers: {
        'user-key': '118f64801e68a449194b12893964eba7'
      },
      uri: `https://developers.zomato.com/api/v2.1/geocode`,
      qs: {
        lat: lat,
        lon: lon,
      },
      method: "GET"
    }, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
}

async function getMerchantMenu(merchantId) {
  const menu = await MenuItems.getByMerchantId(merchantId);
  if (!menu) {
    throw Error(`No menu with this merchant id #${merchantId} found`);
  }
  console.log(menu)
  return menu;
}

async function getMerchantOrders(merchantId, filter) {
  // Don't paginate for now since data is now indexed object, need to rethink how
  // const pageOffset = filter.offset && filter.offset >= 0 ? filter.offset : 0;
  // const pageLimit = filter.limit && filter.limit > 0 ? filter.limit : 20;

  try {
    // const startIndex = Math.min(pageOffset * pageLimit, orders.length)
    // const endIndex = Math.min(startIndex + pageLimit, orders.length);
    let orders = await Orders.list(merchantId, filter);
    // return orders.slice(startIndex, endIndex);
    return orders;
  } catch(err) {
    console.log("failed to get orders: ", err);
    return null;
  }
}

async function getCustomersOrders({psid}) {
  // @todo: given psid, get all of customers previous and current orders
}

async function updateOrderPickupTime({psid, orderId, time}) {
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

  const params = {
    pickup_in: time,
  };
  const order = await Orders.update(orderId, params);
  console.log('updated order: ', order);
  return order;
}

async function addOrderLineItem({orderId, menuItemId, comments, quantity}) {
  // @todo: adds order line items
  if (!orderId || !menuItemId || !quantity) {
    return null;
  }

  const results = await LineItems.create({
    orderId,
    menuItemId,
    quantity,
    comments: comments || '',
  });

  return results;
}

async function removeLineItem({lineItemId, orderId}) {
  if (!orderId || !lineItemId) {
    return null;
  }

  return await LineItems.remove({lineItemId, orderId});
}

async function updateLineItemQuantity({lineItemId, quantity}) {
  if (!lineItemId || !quantity) {
    return null;
  }

  const results = await LineItems.update(lineItemId, {
    quantity,
  });

  console.log('results >> ', results);
  return results;
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

  const orderCostParams = {
    id: orderId,
    taxRate: 0.07
  };

  const params = await Orders.orderCost(orderCostParams);

  // Creates new receipt
  const receiptId = await Receipts.create({orderId, paymentMethod, params});
  return receiptId;

}

async function getReceipt({receiptId}) {
  const receipt =  await Receipts.getWithId(receiptId);
  if (!receipt || !receipt.id) {
    throw Error(`No receipt with receipt id #${receiptId} found`);
  }
  return receipt;
}

async function getLineItems({orderId}) {
  const lineItems = await Orders.lineItems(orderId);
  return lineItems;
}
module.exports = {
  startOrderingChat,
  initiatOrderProcess,
  getNearbyShops,
  getMerchantOrders,
  getMerchantMenu,
  updateOrderPickupTime,
  // Menu actions
  addOrderLineItem,
  updateLineItemQuantity,
  removeLineItem,
  // sendCustomerTextMessageFromMerchant,
  getReceipt,
  getLineItems,
  createReceipt
};
