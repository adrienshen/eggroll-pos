/*
  Where menu items are placed in sections Eg. Drinks, Main Course,
    and the position on the selection board
  By default, each section is 5x5 = 25 items per page
      [] [] [] [] []  Drinks
      [] [] [] [] []  Main
      [] [] [] [] []
      [] [] [] [] []
      [] [] [] [] []
*/

const _ = require('lodash');
const db = require('./db');

const T = () => db('sections');

class Sections {
  constructor(menuItem) { this.menuItem = menuItem }

  static async get(id) {
    const res = await T()
      .select()
      .where('id', id);
    return res;
  }

  static async list(stationId) {
    /**
     * List all stations unique to this pos `stationId`
     */
    const res = await T()
      .select()
      .where('stationId', stationId);
    return res;
  }

  static async create(params) {
    // @todo: implement
  }

  static async update(params) {
    // @todo: implement
  }

}

module.exports = Sections;