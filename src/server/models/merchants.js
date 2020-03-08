const _ = require('lodash');
const db = require('./db');

const T = () => db('merchants');

class Merchants {
  constructor(merchants) { this.merchants = merchants }

  static async list() {
    // @todo: list all merchants for admin or nearby merchants for messenger
    return T().select();
  }

  static async get(id) {
    const res = await T()
      .select()
      .where('id', id)
      .first();
    // console.log('merchant res: ', res);
    return res;
  }

  static async getByZomatoIds(zomatoIds) {
    const res = await T()
      .select()
      .whereIn('zomato_id', zomatoIds)
    return res;
  }

  static async create(params) {
    // @todo: add merchant
    return T().
      insert({
        ...params,
      }).returning('id');
  }

  static async update(id, params) {
    console.log(`Updating merchant ${id} with `, params);
    return await T()
      .update(params)
      .where('id', id)
      .returning('id');
  }

  static async  customers(id) {
    const res = await T()
      .select('customers.*')
      .joinRaw('LEFT JOIN orders ON merchants.id = orders.merchant_id')
      .joinRaw('LEFT JOIN customers on orders.customer_id = customers.id')
      .where('merchants.id', id)
      .distinct();

    // console.log('merchant customers: ', res);
    return res;
  }

  static async orders(id, filter) {
    // @todo: implement filters {date_range, status}
    const res = await T()
      .select('orders.*')
      .joinRaw('LEFT JOIN orders ON merchants.id = orders.merchant_id')
      .where('merchants.id', id);

    // console.log('merchants orders: ', res);
    return res;
  }
}

module.exports = Merchants;