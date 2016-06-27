const winston = require('winston');
const conf = require('./config');

const logger = new (winston.Logger)({
  transports: [
    // log to console
    new (winston.transports.Console)({
      level: conf.get('debug') ? 'debug' : 'info',
      colorize: true
    }),
    // log to file
    // new (winston.transports.File)({ filename: 'somefile.log' })
  ],

  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5
  },

  colors: {
    fatal: ['red', 'bold'],
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'gray'
  }
});

module.exports = logger;
