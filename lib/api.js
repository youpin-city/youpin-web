import Promise from 'bluebird';
global.Promise = Promise;
import fetch from 'isomorphic-fetch';
import qs from 'qs';
import urllib from 'url';
import createError from 'http-errors';
import _ from 'lodash';
import conf from './config';
import log from './logger';

function APIFetch(api_baseurl, _options = {}, parser = _.identity, method = 'json') {
  return function (...args) {
    // use API URL as base URL
    const urlobj = urllib.parse(
      /^(f|ht)tps?:\/\//i.test(args[0])
      ? args[0]
      : api_baseurl.replace(/\/$/, '') + '/' + args[0].replace(/^\//, '')
    );
    // parse options
    const options = _.assignIn(_options, args[1] || {});
    // handle modifying 'query', overriding query string in baseurl
    const query = typeof options.query === 'string' ? qs.parse(options.query) : options.query;
    const mod_query = 'query' in options ? query : {};
    delete options.query;
    urlobj.search = '?' + qs.stringify(_.defaults(mod_query, qs.parse(urlobj.query)));
    // assign normalized url
    args[0] = urllib.format(urlobj);
    args[1] = options;

    log.debug('Fetch ' + args[0]);

    return fetch.apply(this, args)
    .then(response => response[method]().then(data => {
      if (response.ok) return parser(data);
      // error
      if (data.fields) {
        throw createError(response.status, _.map(data.fields, f => f.msg).join('\n'),
          { fields: data.fields });
      }
      throw createError(response.status, data.message);
    }));
  };
}

function APIParser(data) {
  if (data && data.data && _.isArray(data.data)) {
    data.data = _.map(data.data, doc => doc);
  }
  return data;
}

export default {
  server: APIFetch(conf.get('site.host'), {}, _.identity, 'text'),
  api: APIFetch(conf.get('service.api.url'), {}, APIParser),
  APIFetch: APIFetch
};
