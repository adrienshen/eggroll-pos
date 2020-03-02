const _ = require('lodash');
const db = require('./db');

const Table = () => db('orders');

class Order {
  constructor(post) { this.post = post }

  static async list() {
    // @todo: Merchant: get list of order given some params
    
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
    const res = Table()
      .update({...params})
      .where('id', id);
  }

}

module.exports = Order;
