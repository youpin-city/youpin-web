const conf = require('./config');
const logger = require('./logger');

const _ = require('lodash');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Render engine
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('view cache', conf.get('env') === 'production');
app.set('views', path.join(__dirname, '/../assets/views'));
app.set('x-powered-by', false);
if (app.get('env') !== 'production') app.locals.pretty = true;
app.use(require('connect-flash')());

// Configure app
app
  .use(bodyParser.json({ limit: '15mb' }))
  .use(bodyParser.urlencoded({ extended: true, limit: '15mb' }))
  .use(require('serve-favicon')(path.join(__dirname, '../public/image/favicon/favicon.ico')))
  .use('/public', express.static('public'))
  .use(require('express-useragent').express())
  .use(require('./middleware/view_helper'))
  .use(require('./route')(app))
  .use(require('./error-handler'));

// global error handler
process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

module.exports = app;
