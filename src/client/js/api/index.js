import {Status} from '../../../shared/orders';

const MERCHANT_ID = 3

// Entrypoint for nodejs api

const ORDERS_URL = '/api/merchants/$id/orders';
const ORDER_MENUS_URL = '/api/orders/$uuid';
const LINE_ITEMS_URL = '/api/orders/lineitems';
const ORDER_ADD_COMPLETE_URL = '/api/orders/complete';

const defaultGetOptions = {
  method: 'GET',
  credentials: 'same-origin',
  retries: 2,
};

const defaultPostOptions = {
  method: 'POST',
  credentials: 'same-origin',
  headers: {'Content-Type': 'application/json'},
};

const defaultDeleteOptions = {
  method: 'DELETE',
  credentials: 'same-origin',
};

export function createPostBodyRequest(body) {
  return Object.assign(defaultPostOptions, {body: JSON.stringify(body)});
}

function indexByID(dataArray) {
  return dataArray.reduce((result, item) => {
    result[item.id] = item;
    return result;
  }, {});
}

function indexBySlug(dataArray) {
  return dataArray.reduce((result, item) => {
    result[item.slug] = item;
    return result;
  }, {});
}

function indexByField(dataArray, field) {
  return dataArray.reduce((result, item) => {
    result[item[field]] = item;
    return result;
  }, {});
}

const fetchResource = async (url, options = defaultGetOptions) => {
  try {
    const resp = await fetch(url, {credentials: 'same-origin', ...options});
    if (!resp.ok) {
      throw new Error('Request error:', resp.statusCode);
    }
    return await resp.json();
  } catch (err) {
    if (options && options.retries && options.retries-- > 0) {
      return fetchResource(url, options);
    }
    throw err;
  }
};

// @note: merchantId should probably some from session cookie or similar
export const getOrders = async (merchantId, params) => {
  const response = await fetchResource(ORDERS_URL.replace('$id', MERCHANT_ID));
  return response;
}

export const updateOrderStatus = async (params, merchantId) => {
  console.log('params >> ', params);
  const response = await fetchResource(ORDERS_URL.replace('$id', MERCHANT_ID), createPostBodyRequest({
    ...params,
  }));
  console.log('POST update order status ', response);
  return response;
}


// Customer ordering and menus

export const getCustomerOrderMenu = async (orderUuid) => {
  const response = await fetchResource(ORDER_MENUS_URL.replace('$uuid', orderUuid));
  console.log('response >> ', response);
  return response;
}

export const createLineItem = async (params) => {
  // console.log('params >> ', params);
  const response = await fetchResource(LINE_ITEMS_URL, createPostBodyRequest({
    ...params,
  }));
  return response;
}

export const removeLineItem = async (lineItemId) => {
  // @todo: implement remove line item API

}

export const completeAddingLineItems = async (orderUuid) => {
  const response = await fetchResource(ORDER_ADD_COMPLETE_URL, createPostBodyRequest({
    orderUuid,
  }));
  return response;
}
