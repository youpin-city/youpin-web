var pm2 = require('pm2');
var _ = require('lodash');
var config_file = 'ecosystem.json';
// var config_file = 'ecosystem-standalone.json';

pm2.connect(function(err) {
  if (err) {
    console.error('Start server failed:', err);
    process.exit(2);
  }

  pm2.start(config_file, function(err, apps) {
    pm2.disconnect();
    if (err) {
      console.error('Server failed:', err);
    } else {
      apps = _.compact(apps);
      if (apps && apps.length > 0) {
        apps.forEach(function(app) {
          console.log('[' + app.name + '] status:', app.status);
        });
      }
    }
  });
});