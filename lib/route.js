const path = require('path');
const urllib = require('url');

// Modify resp.redirect
const resp = require('express').response;
const originalRedirect = resp.redirect;
resp.redirect = function redirect(url) {
  const urlInfo = urllib.parse(url);
  if (!urlInfo.host) url = path.join(this.req.baseUrl, url);
  originalRedirect.call(this, url);
};

const default_router = require('./route/default');
module.exports = function (app) {
  app.use(default_router);
  return function (req, res, next) { next(); };
};
