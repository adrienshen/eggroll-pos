// Entrypoint for nodejs api

const ORDERS_URL = '/api/merchants/$id/orders';

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
  const response = await fetchResource(ORDERS_URL.replace('$id', merchantId));
  return response;
}

export const updateOrderStatus = (merchantId = 3, statusToUpdate) => {
  const response = await fetchResource(ORDERS_URL.replace('$id', merchantId), defaultPostOptions);
  console.log('POST update order status ', response);
  return response;
}

export const acceptOrder = async (merchantId) => {

}