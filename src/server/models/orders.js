const _ = require('lodash');
const db = require('./_db');

const Orders = () => db('orders');

class Order {
  constructor(post) { this.post = post }

  static async list() {
    // @todo: Merchant: get list of order given some params
    
  }

  static async create({merchantId, customerId}) {
    // Customer: creates new order
    const res = Orders.insert({
      merchant_id: merchantId,
      customer_id: customerId,
    }).returning('id');

    console.log('Order.create res >> ', res);
  }

  static async update(id, params) {
    // @todo: Customer/Merchant: updates Order given payload
    const res = Orders
      .update({...params})
      .where('id', id);
  }

}

module.exports = Order;
