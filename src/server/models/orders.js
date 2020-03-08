const _ = require('lodash');
const db = require('./db');
const uuid = require('uuid');

const Table = () => db('orders');

class Order {
  constructor(post) { this.post = post }

  static async getOne(id) {
    // @todo: Merchant: get given orderId
    
  }

  static async list(merchantId, filter) {
    let query = db
      .with('t1', db.raw(`
          select orders.id as order_id
          , orders.uuid as order_uuid
          , orders.merchant_id
          , orders.customer_id
          , orders.confirmed_at
          , orders.created_at
          , orders.status
          , line_items.id as line_item_id
          , line_items.comments
          , line_items.quantity
          , menu_items.id as menu_item_id
          , menu_items.name as menu_item_name
          , menu_items.description as menu_item_description
          , menu_items.price_cents
        from orders
        INNER JOIN line_items ON orders.id = line_items.order_id
        LEFT JOIN menu_items on line_items.menu_item_id = menu_items.id
      `))
      .select()
      .from('t1')
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
    const res = await query.orderBy('created_at', 'customer_id');
    console.log('GOT HERE >> ', await query);
    return this._groupMenuItemsByOrder(res);
  }

  static async create({merchantId, customerId}) {
    console.log('customerID >> ', customerId);
    // Customer: creates new order
    const res = await Table().insert({
      merchant_id: merchantId,
      customer_id: customerId,
      status: 'started',
      uuid: uuid.v4(),
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
  
  static async lineItems(id) {
    return await Table()
      .select('menu_items.*')
      .join('line_items', {'orders.id': 'line_items.order_id'})
      .join('menu_items', {'line_items.menu_item_id': 'menu_items.id'})
      .where('orders.id', id);
  }
  
  static async calculateSubtotal({id,taxRate}) {
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

  static async _groupMenuItemsByOrder(order) {
    const grouped = {}

    order.forEach(ord => {
      const lineItem = {
        id: ord.line_item_id,
        comments: ord.comments,
        quantity: ord.quantity,
        menuItemId: ord.menu_item_id,
        name: ord.menu_item_name,
        description: ord.menu_item_description,
        priceCents: parseInt(ord.price_cents),
      };
      if (grouped[ord.order_uuid]) {
        grouped[ord.order_uuid].lineItems.push(lineItem);
      } else {
        grouped[ord.order_uuid] = {
          ...ord,
          lineItems: [lineItem],
        };
        // @note: should refactor later when have time
        delete grouped[ord.order_uuid].line_item_id;
        delete grouped[ord.order_uuid].comments;
        delete grouped[ord.order_uuid].quantity;
        delete grouped[ord.order_uuid].menu_item_name;
        delete grouped[ord.order_uuid].menu_item_description;
        delete grouped[ord.order_uuid].price_cents;
        delete grouped[ord.order_uuid].menu_item_id;
      }
    });
    return grouped;
  }
}

module.exports = Order;
