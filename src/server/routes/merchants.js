var express = require('express');
var router = express.Router();
const Actions = require('../services/actions');

/* GET orders */
router.get('/:merchantId/orders', async (req, res) => {
    const merchantId = req.params.merchantId;
    if(!merchantId || parseInt(merchantId) != merchantId) {
        res.sendStatus(400);
    }
    // parse query params
    const filter = {
        startDate: req.query['startdate'],
        endDate: req.query['enddate'],
        status: req.query['status'],
        limit: req.query['limit'],
        offset: req.query['offset']
    };
    const orders = await Actions.getMerchantOrders(merchantId, filter);
    if(orders) {
        res.json(orders);
    } else {
        res.sendStatus(500);
    }
  });

module.exports = router;
