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

  static async list(params) {
    // params: merchant_id?, name?, is_open?, delivery?
    const res = await T().select()
      .where(qb => {
        if (params.merchant_id) {
          qb.where('merchant_id', params.merchant_id);
        }
        if (params.name) {
          qb.where('name', 'like', `%${params.name}%`);
        }
        if (params.is_open) {
          qb.where('is_open', params.is__open);
        }
        if (params.delivery) {
          qb.where('delivery', params.delivery);
        }
      });
    console.log('res >> ', res);
    return res;
  }

  static async update(params) {
    // params: name, address, delivery, takeout, dine_in, is_open
    const res = await Table()
      .update({...params, updated_at: db.fn.now()})
      .where('id', id)
      .returning('id');
    // console.log('update res: ', res);
    return res[0];
  }

}

module.exports = Restaurants;
