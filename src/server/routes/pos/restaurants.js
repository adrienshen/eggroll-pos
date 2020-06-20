const express = require('express');
const router = express.Router();
const _ = require('lodash');

const Restaurants = require('../../models/pos/restaurants');

async function get(req, res) {
  // Get with uuid
  const {uuid} = req.params;
  if (!uuid) {
    console.error('uuid not provided');
    res.send('uuid required', 400);
  }

  const result = null;
  if (uuid) {
    result = Restaurants.getWithUUID(uuid);
  } else {
    console.error('uuid not provided');
    res.status(400).send('uuid required');
  }

  res.json(result);
}

// @todo: Create middleware for param validation before the route handler
async function list(req, res) {
  // List according to filter params
  const filters = _.pick(req.query, ['name', 'delivery', 'takeout', 'is_open', 'merchant_id']);

  console.log('filters >> ', filters);
  if (!Object.keys(filters).length) {
    res.status(400)
      .send('Invalid parameters: send one or more of: name, delivery, takeout, is_open, merchant_id');
    return;
  }
  if (!filters.merchant_id && !filters.name) {
    res.status(400)
      .send('Requires either merchant_id or name as filter parameters');
  }

  const results = await Restaurants.list(filters);
  res.json(results);
}

async function create(req, res) {
  const params = _.pick(req.body, ['name', 'address', 'delivery', 'takeout', 'dine_in', 'is_open', 'extra_fields', 'merchant_id']);
  // @todo: must get `merchant_id` from authenticated user instead

  if (!params.name || !params.address || !params.merchant_id) {
    res.send('Missing parameters: send name, address, and merchant_id', 400);
  }

  const result = await Restaurants.update(params);
  res.json(result);
}

async function update(req, res) {
  const params = _.pick(req.body, ['name', 'address', 'delivery', 'takeout', 'dine_in', 'is_open'])

  if (!Object.keys(params).length || !req.body.uuid) {
    res.send('Invalid parameters: send one or more of: name, address, delivery, takeout, is_open, extra_fields, and uuid of Restaurant', 400);
  }

  const results = await Restaurants.update(req.body.uuid, params);
  res.json(results);
}

router.get('/', list);
router.get('/:uuid', get);
router.post('/', create);
router.put('/', update);

module.exports = router;
