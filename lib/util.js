const conf = require('./config');
const pathlib = require('path');
const urllib = require('url');
const _ = require('lodash');

const utility = exports;

/**
 *
 * Normalize for flat query string
 * @example
 *   b: 100                   => b=100
 *   a: [1,2,3]               => a[0]=1&a[1]=2&a[2]=3
 *   c: [{d:1,e:2},{d:3,e:4}] => c[0][d]=1&c[0][e]=2&c[1][d]=3&c[1][e]=4
 * @param {Object} query Simple input object
 * @return {Object} Flatten object
 */
utility.make_querystring = function (query) {
  const qs = {};
  _.forEach(query, (value, key) => {
    if (Array.isArray(value)) {
      if (typeof value[0] === 'object') {
        _.forEach(value, (v, k) => {
          _.forEach(v, (a, b) => {
            qs[`${key}[${k}][${b}]`] = a;
          });
        });
      } else {
        _.forEach(value, (v, k) => {
          qs[`${key}[${k}]`] = v;
        });
      }
    } else {
      qs[key] = value;
    }
  });
  return qs;
};

/**
 * Stringigy querystring object
 * @param  {Object} query Querystring parameters
 * @return {String}       Querystring as string
 */
utility.format_querystring = function (query) {
  const qs = [];
  Object.keys(query).forEach((k) => {
    if (hasOwnProperty.call(query, k)) {
      qs.push(k + '=' + query[k]);
    }
  });
  return qs.join('&');
};

/**
 * Generate website URL if pathname were given.
 * Return original url if it is absolute URL.
 * @param  {String} pathname Path or absolute URL
 * @param  {String} basepath Initial path
 * @param  {Object} query Additional query string to append (or override)
 * @param  {String} hash  String hash name with or without leading #
 * @return {String}     Fully-qualified URL
 */
utility.site_url = function (pathname, basepath, query, hash) {
  pathname = pathname || '/';
  if (typeof basepath === 'object') {
    hash = query;
    query = basepath;
    basepath = null;
  }
  query = utility.make_querystring(query || {});
  const url = urllib.parse(pathname, true);
  basepath = basepath || conf.get('site.host');
  if (url.protocol) {
    url.query = _.assign(url.query, query);
    return urllib.format(url);
  }
  return basepath.replace(/\/$/, '') + '/' + urllib.format({
    pathname: url.pathname.replace(/^\//, ''),
    query: _.assign(url.query, query),
    hash: hash
  });
};

utility.asset_url = function (url, options, basepath) {
  if (typeof options === 'string') {
    basepath = options;
    options = {};
  }
  options = options || {};
  if (!url) return '';
  const no_min_js = options['no-min'];
  const no_version = options['no-version'];
  if (!/^https?:\/\//.test(url)) {
    // for all internal assets
    const ext = pathlib.extname(url);
    switch (ext) {
      case '.js':
        if (!no_min_js && !conf.get('debug')
        && pathlib.extname(pathlib.basename(url, '.js')) !== '.min') {
          url = url.slice(0, -3) + '.min.js';
        }
        break;
      default:
        // no-op
        break;
    }
    if (!no_version) {
      url = url + '?v=' + conf.get('version');
    }
  }
  return utility.site_url(url, basepath);
};

/**
 * Generate page info to render in view
 * @param  {String} path  Logical path e.g. 'shop/about' 'product/view'
 * @param  {String} title Page title
 * @param  {String} options Options
 * @return {void}
 */
utility.page_info = function (path, title, options) {
  options = options || {};
  const paths = _.compact(path.split('/'));
  if (paths.length === 0) paths.push('default');
  if (paths.length === 1) paths.push('index');
  const images = _.map((typeof options.images === 'string' ? [options.images] : options.images)
    || [conf.get('site.host') + '/public/img/favicon/favicon_1024.png'],
    (image) => (typeof image === 'string' ? { src: image } : image)
  );

  return _.assign({
    route: paths[0],
    path: paths[1],
    site_name: conf.get('site.title')
  }, options, {
    title: title,
    images: images,
    description: options.description || conf.get('site.description'),
    keywords: options.keywords || conf.get('site.keywords')
  });
};
