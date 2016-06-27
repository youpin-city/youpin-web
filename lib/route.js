const path = require('path');
const urllib = require('url');

// Modify res.redirect
const res = require('express').response;
const originalRedirect = res.redirect;
res.redirect = function redirect(url) {
  const urlInfo = urllib.parse(url);
  if (!urlInfo.host) url = path.join(this.req.baseUrl, url);
  originalRedirect.call(this, url);
};

module.exports = function (app) {
  app.use(require('./route/default'));
};
