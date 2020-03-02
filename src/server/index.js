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

/* entrypoint for messenger webhook */
app.post('/webhook', (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    
    // iterates over each entry
    body.entry.forEach(entry => {
      
      // handles events
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

    });

    res.status(200).send('EVENT_RECEIVED');
  } else {

    res.sendStatus(404);

  }
});

/* Adds support for GET requests to our webhook */
app.get('/webhook', (req, res) => {
  let = VERIFY_TOKEN = 'HACKATOKEN';

  // parse query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden if verify tokens do not match'
      res.sendStatus(403);
    }
  }
});

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
