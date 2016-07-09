const conf = require('./config');
const logger = require('./logger');
const _ = require('lodash');

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const best = req.accepts(['json', 'html', 'text']);
  if (err.redirect) {
    res.set('Location', err.redirect);
  }
  if (conf.get('debug')) {
    // log only error status
    if (status >= 400 && status < 600) {
      logger.error(err);
    }
  }
  res.status(status);
  switch (best) {
    case 'html':
      switch (status) {
        case 404: res.render('error/404_notfound'); break;
        default:
          res.send(`<h1>${status} ${err.message}</h1>`
            + (conf.get('debug') ? `<h3>${err.code ? 'code: ' + err.code : ''}</h3>` : '')
            + (conf.get('debug') ? `<pre>${_.escape(err.stack)}</pre>` : ''));
          break;
      }
      break;
    case 'json':
      res.json({ ok: false, status: status, code: err.code, message: err.message });
      break;
    default:
      res.send(`${status}: ${err.message}`
        + (conf.get('debug') ? `${err.code ? ' (code: ' + err.code + ')' : ''}` : '')
        + (conf.get('debug') ? err.stack : ''));
  }
};
