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

const LIST_FIELDS = ['name', 'delivery', 'takeout', 'is_open', 'merchant_id'];
// @todo: Create middleware for param validation before the route handler
async function list(req, res) {
  // List according to filter params
  const filters = _.pick(req.query, LIST_FIELDS);

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

  // normalize boolean filters, @todo: fix ugly code later
  if (filters.delivery === '1' || filters.delivery === 'true') {
    filters.delivery = true;
  } else {
    delete filters.delivery;
  }
  if (filters.takeout === '1' || filters.takeout === 'true') {
    filters.takeout = true;
  } else {
    delete filters.takeout;
  }
  if (filters.is_open === '1' || filters.is_open === 'true') {
    filters.is_open = true;
  } else {
    delete filters.is_open;
  }

  console.log('Filters after transform >> ', filters);
  const results = await Restaurants.list(filters);
  res.json(results);
}

const CREATE_PARAMS = ['name', 'address', 'delivery', 'takeout', 'dine_in', 'is_open', 'extra_fields', 'merchant_id'];
async function create(req, res) {
  const params = _.pick(req.body, CREATE_PARAMS);
  // @todo: must get `merchant_id` from authenticated user instead

  if (!params.name || !params.address) {
    res.status(400).send('Missing parameters: name, address');
  }

  if (!params.extra_fields) {
    params.extra_fields = {};
  }
  params.merchant_id = 2; // @todo: replace with getMerchantIdFromSession(token)
  if (!params.delivery) {
    params.delivery = false;
  }

  const result = await Restaurants.create(params);
  res.json(result);
}

const UPDATE_PARAMS = ['name', 'address', 'delivery', 'takeout', 'dine_in', 'is_open', 'extra_fields'];
async function update(req, res) {
  const params = _.pick(req.body, UPDATE_PARAMS)

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
