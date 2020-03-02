const _ = require('lodash');
const db = require('./db');

const Table = () => db('merchants');

class Merchants {
  constructor(merchants) { this.merchants = merchants }

  static async list() {
    // @todo: list all merchants for admin
    return Table.select();
  }

  static async create(params) {
    // @todo: add merchant
    return Table.
      insert({
        ...params,
      }).returning('id');
  }

}

module.exports = Merchants;