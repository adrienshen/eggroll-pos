const _ = require('lodash');
const db = require('./db');

const Table = () => db('orders');

class Order {
  constructor(post) { this.post = post }

  static async list() {
    // @todo: Merchant: get list of order given some params
    
  }

  static async get(merchantId, filter) {
    let query = Table()
    .select()
    .where('merchant_id', merchantId);
    if(filter.startDate) {
      query = query.andWhere('created_at', '>=', filter.startDate);
    }
    if(filter.endDate) {
      query = query.andWhere('created_at', '<=', filter.endDate);
    }
    if(filter.status) {
      query = query.andWhere("status", filter.status);
    }
    return await query.orderBy('status', 'created_at', 'customer_id');
  }

  static async create({merchantId, customerId}) {
    console.log('customerID >> ', customerId);
    // Customer: creates new order
    const res = await Table().insert({
      merchant_id: merchantId,
      customer_id: customerId,
      status: 'started',
    }).returning('id');
    // console.log('Order.create res >> ', res);
    return res[0];
  }

  static async update(id, params) {
    // @todo: Customer/Merchant: updates Order given payload
    const res = await Table()
      .update({...params})
      .where('id', id)
      .returning('id');
    // console.log('update res: ', res);
    return res[0];
  }

}

module.exports = Order;
