const _ = require('lodash');
const db = require('../db');

const T = () => db('restaurants');

class Restaurants {
  constructor(obj) { this.restaurant = obj }

  static async get(id) {
    const res = await T()
      .select()
      .where('id', id);
    return res;
  }

  static async getWithUUID(uuid) {
    const res = await T()
      .select()
      .where('uuid', uuid);
    return res;
  }

  static async list(filters) {
    // filters: merchant_id?, name?, is_open?, delivery?
    console.log('filters >> ', filters);
    const res = await T().select()
      .where(qb => {
        if (filters.merchant_id) {
          qb.where('merchant_id', parseInt(filters.merchant_id));
        }
        if (filters.name) {
          qb.where('name', 'like', `%${filters.name}%`);
        }
        if (filters.is_open) {
          qb.where('is_open', filters.is_open);
        }
        if (filters.delivery) {
          qb.where('delivery', filters.delivery);
        }
      });
    console.log('res >> ', res);
    return res;
  }

  static async create({
    name,
    address,
    delivery,
    takeout,
    dine_in,
    is_open,
    extra_fields,
    merchant_id,
  }) {
    // params: name, address, delivery, takeout, dine_in, is_open
    const res = await T()
      .insert({
        number: 2,
        name,
        address,
        delivery,
        takeout,
        dine_in,
        is_open,
        extra_fields,
        merchant_id,
      })
      .returning('id');
    console.log('created res: ', res);
    // return res[0];
  }

  static async update(uuid, params) {
    // params: name, address, delivery, takeout, dine_in, is_open, extra_fields
    const res = await T()
      .update({...params, updated_at: db.fn.now()})
      .where('uuid', uuid)
      .returning('id');
    // console.log('update res: ', res);
    return res[0];
  }

}

module.exports = Restaurants;
