/* global $ _: true */

const DEFAULT_CONFIG = {};

const App = function (config) {
  const self = this;
  this._config = _.assignIn({}, DEFAULT_CONFIG);
  this.config(config || {});
  // // make observerable
  // riot.observable(self);
};

App.prototype.config = function (options) {
  const self = this;
  if (!options) return this;
  _.forEach(options, (value, key) => {
    self.set(key, value);
  });
  return this;
};
App.prototype.get = function (key, default_value) {
  return _.get(this._config, key, default_value);
};
App.prototype.set = function (key, value) {
  _.set(this._config, key, value);
  if (key === 'csrf') {
    // setup csrf
    $(document).ajaxSend((event, jqxhr, settings) => {
      jqxhr.setRequestHeader('x-csrf-token', value || null);
    });
  }
  // this.trigger(`data:${key}`, value);
  return this;
};
App.prototype.start = function (should_start_route) {
  const self = this;
  // init riot router
  self.startRiotRouter();
};


App.prototype.startRiotRouter = function () {
  const self = this;
  // Parse path with query string
  // e.g. !/user/activation?token=xyz#hash
  riot.route.parser((path) => {
    const hp = path.split('#') || [''];
    const hash = hp[1] || '';
    const raw = hp[0].split('?');
    const uri = raw[0].split('/');
    const qs = raw[1];
    const params = {};

    if (qs) {
      qs.split('&').forEach((v) => {
        const c = v.split('=');
        params[c[0]] = c[1];
      });
    }

    uri.push(params);
    uri.push(hash);
    return uri;
  });

  // Handle route
  riot.route(function handlerRoute(collection, id, action, qs, hash) {
    if (typeof id === 'object') {
      hash = action;
      qs = id;
      id = null;
      action = null;
    } else if (typeof action === 'object') {
      hash = qs;
      qs = action;
      action = null;
    }
    const fn = self.route((self.get('route_prefix') || '') + (collection || 'index'));
    // check auth
    // let fn;
    // if (self.get('isAuth')) {
    //   fn = self.routes[collection ? ('admin-' + collection) : 'admin-order'];
    // } else {
    //   fn = self.routes['admin-login'];
    // }
    if (fn) {
      self.set('previous_href', location.href);
      fn(id, action, qs, hash);
    } else {
      if (self.get('previous_href') !== location.href) {
        location.href = location.href;
      }
    }
  });

  // save start href
  self.set('previous_href', location.href);

  // set routing base
  riot.route.base(self.get('route_base') || '#');

  // start and execute riot routes
  riot.route.start(true);
};

/**
 * Open tag as a page in place
 * @param  {String} tag        Tag name
 * @param  {String} container  Container element selector
 * @param  {Object} options    Options passed to riot mount
 * @return {void}
 */
App.prototype.open = (() => {
  let current_tag = null;
  return function (tag, container, options) {
    const self = this;
    if (typeof container === 'object' && !options) {
      options = container;
      container = null;
    }
    // page route tag
    if (current_tag) current_tag.unmount(true);
    if (container) {
      current_tag = riot.mount(container, tag, options)[0];
    } else {
      current_tag = riot.mount(tag, options)[0];
    }
    // page data route and path
    let normalized_tag = tag;
    if (self.get('route_prefix')) {
      normalized_tag = normalized_tag.replace(new RegExp('^' + self.get('route_prefix')), '');
    }
    normalized_tag = normalized_tag.split('-');
    const data_route = normalized_tag[0] || 'default';
    const data_path = normalized_tag[1] || 'index';
    $('body')
    .attr('data-route', data_route)
    .attr('data-path', data_path);
  };
})();

App.prototype.goto = (path, is_replace) => {
  riot.route(path, null, is_replace);
};

/**
 * Register a new route or get an existing route
 * @param  {String}   name     Named path
 * @param  {Function} callback Action taken
 * @return {Function}          Assigned callback
 */
App.prototype.route = (() => {
  const routes = {};
  return (name, callback) => {
    if (!callback) return routes[name];
    routes[name] = callback;
    return routes[name];
  };
})();

module.exports = App;
