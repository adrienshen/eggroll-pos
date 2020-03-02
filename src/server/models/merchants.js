const _ = require('lodash');
const db = require('./_db');

const Table = () => db('merchants');

class Merchants {
  constructor(merchants) { this.merchants = merchants }

  static async list() {
    return Table.select();
  }

  static async create(params) {
    return Table.
      insert({
        ...params,
      }).returning('id');
  }

}

module.exports = Merchants;