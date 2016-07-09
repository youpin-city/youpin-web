/* eslint no-new-func: 0 */

const _ = require('lodash');

const commonError = {
  401: {
    name: 'UnauthorizedError',
    message: 'Unauthorized',
    code: 'unauthorized'
  },
  403: {
    name: 'ForbiddeError',
    message: 'Forbidden',
    code: 'forbidden'
  },
  404: {
    name: 'NotFoundError',
    message: 'Not Found',
    code: 'notfound'
  },
  500: {
    name: 'ServerError',
    message: 'Something went wrong on server',
    code: 'server.error'
  }
};

/**
 * Create custom error instance that contains domain-specific 'code'
 * Example:
 *   var error = require('./error');
 *   throw new error({ name: 'ErrorName', status: 500, code: '1510', message: 'message' });
 * @param  {Object} config      Error configuration
 * @return {Error}           New custom error instance
 */
function Errand(config) {
  config.status = +config.status || 500;
  const error = this;
  _.assignIn(error, commonError[config.status] || commonError[500], config);

  // for redirection
  if (config.redirect) {
    if ([301, 302].indexOf(error.status) === -1) error.status = 302;
    if (!error.message) error.message = 'Moved';
    error.redirect = config.redirect;
  }

  return error;
}

module.exports = Errand;

module.exports.namespace = function createErrorName(errorName) {
  return function (config) {
    config.name = errorName;
    return Errand(config);
  };
};
