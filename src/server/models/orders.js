const _ = require('lodash');
const db = require('./db');

const Table = () => db('orders');

class Order {
  constructor(post) { this.post = post }

  static async getOne(id) {
    // @todo: Merchant: get given orderId
    
  }

  static async list(merchantId, filter) {
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
  
  static async getWithID(id) {
    return await Table()
      .select()
      .where('id', id)
      .first();
  }
  
  static async lineItems(id){
    return await Table()
      .select('menu_items.*')
      .join('line_items', {'orders.id': 'line_items.order_id'})
      .join('menu_items', {'line_items.menu_item_id': 'menu_items.id'})
      .where('orders.id', id);
  }
  
  static async calculateSubtotal({id,taxRate}){
    const lineItems = await(this.lineItems(id));
    const subtotalCents = lineItems.reduce((a,c) => a+ parseInt(c.price_cents), 0);
    const taxCents = Math.ceil(subtotalCents * taxRate);
    const totalCents = subtotalCents + taxCents;
    const params = {
      subtotalCents: subtotalCents,
      taxCents: taxCents,
      totalCents: totalCents
    };
    return params;
  }
}

module.exports = Order;
