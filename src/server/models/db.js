const knex = require('knex');
const dbConfig = require('../../../db/knexfile');

const env = process.env.NODE_ENV;
const config = dbConfig[env] || dbConfig.development;
const db = knex(config);

module.exports = db;
