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
  // start riot tags
  riot.mount('*');
  // console.log('App started');
};

module.exports = App;
