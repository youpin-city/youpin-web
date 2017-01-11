var pm2 = require('pm2');
var Promise = require('bluebird');
var _ = require('lodash');
var config_file = 'ecosystem.json';
// var config_file = 'ecosystem-standalone.json';
var config = require('../' + config_file);
var app_names = (config && config.apps || []).map(function(app) {
  return app.name;
});

pm2.connect(function(err) {
  if (err) {
    console.error('Stop server failed:', err);
    process.exit(2);
  }

  Promise.mapSeries(app_names, function(app_name) {
    return new Promise(function(resolve, reject) {
      pm2.stop(app_name, function(err, apps) {
        if (err) return reject(err);
        resolve(apps && apps[0]);
      });
    });
  })
  .then(function(apps) {
    apps = _.compact(apps);
    if (apps && apps.length > 0) {
      apps.forEach(function(app) {
        console.log('[' + app.name + '] status:', app.status);
      });
    }
  })
  .catch(function(err) {
    if (err.message !== 'process name not found') {
      console.error('Server failed:', err);
    }
  })
  .then(function() {
    pm2.disconnect();
  });
});
