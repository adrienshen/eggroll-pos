const _ = require('lodash');
const db = require('./db');
const uuid = require('uuid');
const camelcaseKeys = require('camelcase-keys');

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
          , orders.uuid as uuid
          , orders.merchant_id
          , orders.customer_id
          , orders.confirmed_at
          , orders.created_at
          , orders.confirmed_at + (orders.pickup_in * interval '1 minute') as pickup_eta
          , orders.pickup_in
          , orders.status
          , line_items.id as line_item_id
          , line_items.comments
          , line_items.quantity
          , menu_items.id as menu_item_id
          , menu_items.name as menu_item_name
          , menu_items.description as menu_item_description
          , menu_items.price_cents
          , customers.name as customer_name
          , customers.mobile_phone
        from orders
        INNER JOIN line_items ON orders.id = line_items.order_id
        LEFT JOIN menu_items on line_items.menu_item_id = menu_items.id
        LEFT JOIN customers on orders.customer_id = customers.id
      `))
      .select()
      .from('t1')
      .where('merchant_id', merchantId);

    if (filter.startDate) {
      query = query.andWhere('created_at', '>=', filter.startDate);
    }
    if (filter.endDate) {
      query = query.andWhere('created_at', '<=', filter.endDate);
    }

    // @todo: should never include the status=`started` orders
    query = query.andWhereNot("status", 'started')
    if (filter.status) {
      query = query.andWhere("status", filter.status);
    }
    const res = await query.orderBy('pickup_eta', 'customer_id');
    return this._groupMenuItemsByOrder(camelcaseKeys(res));
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
        menuItemId: ord.menuItemId,
        name: ord.menuItemName,
        description: ord.menuItemDescription,
        priceCents: parseInt(ord.priceCents),
      };
      if (grouped[ord.uuid]) {
        grouped[ord.uuid].lineItems.push(lineItem);
      } else {
        grouped[ord.uuid] = {
          ...ord,
          lineItems: [lineItem],
        };
        // @note: should refactor later when have time
        delete grouped[ord.uuid].lineItemId;
        delete grouped[ord.uuid].comments;
        delete grouped[ord.uuid].quantity;
        delete grouped[ord.uuid].menuItemName;
        delete grouped[ord.uuid].menuItemDescription;
        delete grouped[ord.uuid].priceCents;
        delete grouped[ord.uuid].menuItemId;
      }
    });
    return grouped;
  }
}

module.exports = Order;
