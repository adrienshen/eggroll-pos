const _ = require('lodash');
const request = require("request");

const Orders = require('../models/orders');
const Customers = require('../models/customers');
const Merchants = require('../models/merchants');
const LineItems = require('../models/lineItems');
const MenuItems = require('../models/menu_items');

const GraphAPI = require('../services/graph-apis');
const Dialog = require('../services/dialog');

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
    return Dialog.introduction(psid, customer);
  }

  Dialog.introduction(psid, customer);
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

  // console.log('customer{}', customer);
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
  return await MenuItems.getByMerchantId(merchantId);
}

async function getMerchantOrders({merchantId}) {
  await Merchants.customers(merchantId);
  return await Merchants.orders(merchantId);
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

  const params = {pickup_in: time};
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
};
