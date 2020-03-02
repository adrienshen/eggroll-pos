const _ = require('lodash');
const db = require('./db');

const Table = () => db('customers');

class Customers {
  constructor(customer) { this.customer = customer }

  static async create({psid, name}) {
    const res = await Table()
      .insert({
        psid,
        name,
      }).returning('id');
    return res[0];
  }

  static async getWithPSID(psid) {
    return await Table()
      .select()
      .where('psid', psid)
      .first();
  }

  static async orders() {
    // @todo: implement get customer's orders
    
  }
}

module.exports = Customers;