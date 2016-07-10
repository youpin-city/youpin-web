const logger = require('../logger');
const conf = require('../config');
const util = require('../util');
const moment = require('moment');
const _ = require('lodash');
const pathlib = require('path');
const urllib = require('url');


module.exports = function (req, res, next) {
  // helper module
  res.locals.settings = conf.get();
  res.locals.util = util;
  res.locals.moment = moment;
  res.locals._ = _;

  // helper functions
  res.locals.site_url = util.site_url;
  res.locals.asset_url = util.asset_url;

  // default info
  res.locals.page = util.page_info('default', '');
  res.locals.app_config = {
    env: conf.get('env'),
    version: conf.get('version'),
    baseurl: conf.get('site.host'),
    service: {
      api: _.pick(conf.get('service.api'), ['url', 'hash_key']),
      here: conf.get('service.here'),
      bing: conf.get('service.bing')
    }
  };

  next();
};
