require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer')
const upload = multer();
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const ReactRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const leadsRouter = require('./routes/leads');
const merchantsRouter = require('./routes/merchants');
const ordersRouter = require('./routes/orders');

const Actions = require('./services/actions');
const Dialog = require('./services/dialog');
const {PaymentMethods} = require('../shared/payments');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/dist', express.static(path.join(__dirname, '../../dist')));

app.use('/api/users', usersRouter);
app.use('/api/contact', leadsRouter);
app.use('/api/merchants', merchantsRouter);
app.use('/api/orders', ordersRouter);

/* entrypoint for messenger webhook */
app.post('/webhook', async (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    
    // iterates over each entry
    body.entry.forEach(async entry => {

      // console.log('ENTRY >> ', entry);
      
      // handles events
      let webhook_event = entry.messaging[0];
      // console.log(webhook_event);

      // get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // NLP entities:
      console.log('NLP entities >> ', webhook_event.message.nlp.entities);
      // console.log('NLP datetime values >> ', entities.datetime[0].values);

      if (webhook_event.message) {
        await handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        await handlePostback(sender_psid, webhook_event.postback);
      }

    });

    res.status(200).send('EVENT_RECEIVED');
  } else {

    res.sendStatus(404);

  }
});

async function handleMessage(psid, message) {
  if (message.text) {
    if (isZipCode(message.text)) {
      return Actions.getNearbyShops(psid, message.text);
    }
    if (isPickupMinutes(message)) {
      console.log('Confident is a pickup time message >> ', message);
      if (!message.quick_reply) return;
      return Actions.updateOrderPickupTime({psid, time: message.quick_reply.payload});
    }
    if (isCustomerProvidedMobileNumber(message)) {
      console.log('Confident is mobile number >> ', message);
      return Actions.storePhoneNumber(psid, message.quick_reply.payload);
    }
    if (isPaymentMethodReply(message)) {
      console.log('Confident is payment method reponse >> ', message);
      return Actions.updatePaymentMethod(psid, {
        paymentMethod: message.payload,
      });
    }
    await Dialog.introduction(psid, {name: 'Adrien Shen'});
  }
}

function isZipCode(possibleZip) {
  const min = 10000;
  const max = 999999;
  return Number(possibleZip) >= min && Number(possibleZip) <= max;
}

function isPickupMinutes(message) {
  // console.log('MESSAGE >> ', message);
  const {text, quick_reply, nlp} = message;

  if (!quick_reply || !Number(quick_reply.payload)) {
    return false;
  }

  const minutesRegex = /(i|I)n.+(15|30|45|60).+minutes/gi;
  if (!minutesRegex.test(text)) {
    return false;
  }

  console.log('NLP entities >> ', nlp.entities.datetime);
  if (!nlp && !nlp.entities && !nlp.entities.datetime && !nlp.entities.datetime.confidence > .9) {
    return false;
  }

  return true;
}

function isCustomerProvidedMobileNumber({quick_reply, text, nlp}) {
  // console.log('NLP >> ', nlp);
  if (!text || !quick_reply || !quick_reply.payload) return false;
  if (!nlp.entities || !nlp.entities.phone_number) return false;
  return true;
}

function isPaymentMethodReply(quick_reply, text, nlp) {
  if (quick_reply && quick_reply.payload === PaymentMethods.IN_STORE || quick_reply.payload === PaymentMethods.FACEBOOK_PAY) {
    return true;
  }
  return false;
}

/* Adds support for GET requests to our webhook */
app.get('/webhook', (req, res) => {
  // parse query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden if verify tokens do not match'
      res.sendStatus(403);
    }
  }
});

app.get('/r/:receiptId', async (req, res) => {
  const receiptId = req.params.receiptId;
  const receipts = await Actions.getReceipt({receiptId});
  const orderId = receipts.order_id;
  const lineItems = await Actions.getLineItems({orderId});
  res.json({receipt: receipts, lineItems: lineItems});
});

// @note: test routes, will be deleted once integrated with chatbot

app.get('/c', async (req, res) => {
  const params = {psid: '1005'};
  const results = await Actions.startOrderingChat(params);
  res.send(`Creating customer or returning existing customer`);
});

app.get('/oc', async (req, res) => {
  const {psid, merchantId} = req.query;
  const orderId = await Actions.initiatOrderProcess({psid, merchantId});
  res.send(`Order created with ID: ${orderId}`);
});

app.get('/o', async (req, res) => {
  const params = {psid: '1005', orderId: 24, time: 30};
  const orders = await Actions.updateOrderPickupTime(params);
  res.json({orderUpdated: orders});
});

app.get('/l', async (req, res) => {
  const params = {psid: '1005', orderId: 24, menuItemId: 2, quantity: 5, comments: ''};
  const results = await Actions.addOrderLineItem(params);
  res.json({updated: results});
});

app.delete('/l', async (req, res) => {
  const params = {psid: '1005', orderId: 24, lineItemId: 3};
  const results = await Actions.removeLineItem(params);
  res.json({updated: results});
});

// @end: test routes

// curl -H "Content-Type: application/json" -X POST "localhost:3000/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'


/* This should come after all other routes */
app.use('/*', ReactRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
