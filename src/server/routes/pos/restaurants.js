const express = require('express');
const router = express.Router();
const _ = require('lodash');

const Restaurants = require('../../models/pos/restaurants');

function get(req, res) {
  // Get with uuid
  const {uuid} = req.params;
  if (!uuid) {
    console.error('uuid not provided');
    res.sendStatus(400);
  }

  const result = null;
  if (uuid) {
    result = Restaurants.getWithUUID(uuid);
  } else {
    console.error('id or uuid not provided');
    res.sendStatus(400);
  }

  if (!restaurants) {
    res.sendStatus(500);
    return;
  }
  res.json(result);
}

// @todo: Create middleware for param validation before the route handler
function list(req, res) {
  // List according to filter params
  const filters = _.pick(req.query, ['name', 'address', 'delivery', 'takeout', 'is_open', 'merchant_id']);

  if (!Object.keys(filters).length || !filters.merchant_id || !filters.name) {
    res.sendStatus('500').send('Invalid parameters: send one or more of: name, address, delivery, takeout, is_open, merchant_id');
  }

  const results = Restaurants.list(query);
  res.json(results);
}

function create(req, res) {
  const params = _.pick(req.body, ['name', 'address', 'delivery', 'takeout', 'dine_in', 'is_open', 'extra_fields', 'merchant_id']);
  // @todo: must get `merchant_id` from authenticated user instead

  if (!params.name || !params.address || !params.merchant_id) {
    res.sendStatus(500)
      .send('Missing parameters: send name, address, and merchant_id');
  }

  const result = await Restaurants.update(params);
  res.json(result);
}

function update(req, res) {
  const params = _.pick(req.body, ['name', 'address', 'delivery', 'takeout', 'dine_in', 'is_open'])

  if (!Object.keys(params).length || !req.body.uuid) {
    res.sendStatus('500')
      .send('Invalid parameters: send one or more of: name, address, delivery, takeout, is_open, extra_fields, and uuid of Restaurant');
  }

  const results = await Restaurants.update(req.body.uuid, params);
  res.json(results);
}

router.get('/', list);
router.get('/:uuid', get);
router.post('/', create);
router.put('/', update);

module.exports = router;
