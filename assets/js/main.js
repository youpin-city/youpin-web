let root;
if (typeof global !== 'undefined') root = global;
else if (typeof window !== 'undefined') root = window;
else root = {};

(function (window) {
  'use strict';

  // required libraries
  window.util = require('./lib/util');
  window.parser = require('../../lib/parser');

  // main application
  window.App = require('./lib/app');
}(root));
