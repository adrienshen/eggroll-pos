const _ = require('lodash');
const db = require('./_db');

const Table = () => db('customers');

class Customers {
  constructor(customer) { this.customer = customer }

  static async create({psid, name}) {
    Table
      .insert({
        psid,
        name,
      })
  }

  static async get({psid}) {
    return Table.where({psid});
  }
}

module.exports = Customers;