/* eslint no-console: off */
import dotenv from 'dotenv';
import convict from 'convict';
import urllib from 'url';
import pathlib from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import _ from 'lodash';
import Promise from 'bluebird';
// HACK: enable cancellation to avoid this bug https://github.com/KyleAMathews/superagent-bluebird-promise/issues/50
Promise.config({ cancellation: true });

// Load .env into environtment variables
dotenv.config();

// Define a schema
const conf = convict({
  app_name: {
    doc: 'The application name',
    format: String,
    default: 'youpin-web-admin',
    env: 'APP_NAME'
  },
  version: {
    doc: 'The application version',
    format: String,
    default: '0.0.0',
    env: 'PACKAGE_VERSION'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT'
  },
  debug: {
    doc: 'Debug mode.',
    format: Boolean,
    default: false,
    env: 'DEBUG_MODE'
  },
  debug_livereload: {
    doc: 'Enable live-reloading in debug mode.',
    format: Boolean,
    default: false,
    env: 'DEBUG_LIVERELOAD'
  },
  logger: {
    doc: 'Logger options.',
    format: Object,
    default: {},
    env: 'LOGGER'
  },
  site: {
    host: {
      doc: 'Domain name',
      format: String,
      default: '',
      env: 'SITE_HOST'
    },
    protocol: {
      doc: 'Protocol for website. Default to HTTPS',
      format: String,
      default: 'https',
      env: 'SITE_PROTOCOL'
    },
    hostname: {
      doc: 'Public hostname for website. Default to IP address if blank',
      format: String,
      default: '',
      env: 'SITE_HOSTNAME'
    },
    title: {
      doc: 'Website name',
      format: String,
      default: 'Mafueng Web Admin',
      env: 'SITE_TITLE'
    },
    subtitle: {
      doc: 'Website subtitle name',
      format: String,
      default: 'Social reporting platform',
      env: 'SITE_SUBTITLE'
    },
    description: {
      doc: 'Website description',
      format: String,
      default: '',
      env: 'SITE_DESCRIPTION'
    },
    keywords: {
      doc: 'Website keywords',
      format: Array,
      default: [
        'admin'
      ],
      env: 'SITE_KEYWORDS'
    }
  },

  feature: {
    doc: 'Server feature configuration',
    format: Object,
    default: {},
    env: 'FEATURE'
  },

  service: {
    api: {
      url: {
        doc: 'YouPin API endpoint URL.',
        format: String,
        default: '',
        env: 'SERVICE_API_URL'
      },
      api_key: {
        doc: 'YouPin API key.',
        format: String,
        default: '',
        env: 'SERVICE_API_KEY'
      },
      secret: {
        doc: 'YouPin API secret.',
        format: String,
        default: '',
        env: 'SERVICE_API_SECRET'
      }
    },

    here: {
      app_id: {
        doc: 'HERE App ID.',
        format: String,
        default: '',
        env: 'SERVICE_HERE_APP_ID'
      },
      app_code: {
        doc: 'HERE App Code.',
        format: String,
        default: '',
        env: 'SERVICE_HERE_APP_CODE'
      }
    },

    // facebook: {
    //   app_id: {
    //     doc: 'API Key',
    //     format: String,
    //     default: '',
    //     env: 'SERVICE_FACEBOOK_APP_ID'
    //   }
    // },

    // ga: {
    //   tracking_id: {
    //     doc: 'Google Analytics tracking ID.',
    //     format: String,
    //     default: '',
    //     env: 'SERVICE_GA_TRACKING_ID'
    //   }
    // },

    google: {
      api_key: {
        doc: 'Google API Key.',
        format: String,
        default: '',
        env: 'SERVICE_GOOGLE_API_KEY'
      }
    },

    aws: {
      region: {
        doc: 'AWS region code',
        format: String,
        default: 'ap-southeast-1',
        env: 'SERVICE_AWS_REGION'
      },
      access_key: {
        doc: 'AWS Access key ID',
        format: String,
        default: '',
        env: 'SERVICE_AWS_ACCESS_KEY'
      },
      secret: {
        doc: 'AWS Secret access key',
        format: String,
        default: '',
        env: 'SERVICE_AWS_SECRET'
      },
      s3_asset_bucket: {
        doc: 'AWS S3 bucket name for asset storage',
        format: String,
        default: '',
        env: 'SERVICE_AWS_S3_ASSET_BUCKET'
      }
    }
  },

});

/**
 * app_root App project root directory
 * @type {String}
 */
conf.set('app_root', pathlib.resolve(__dirname, '..'));

// Load default configuration from config/default/*
const yaml_dir = pathlib.join(conf.get('app_root'), 'config/default');
console.log('load config:', pathlib.join(yaml_dir, '*.yaml'));
const yaml_config = _.chain(fs.readdirSync(yaml_dir))
.filter(filename => filename.indexOf('.yaml') >= 0 && filename[0] !== '.')
.map(filename => yaml.safeLoad(fs.readFileSync(pathlib.join(yaml_dir, filename), 'utf8')))
.map(config => {
  conf.load(config);
  return config;
})
.value();


// Load current configuration
// @path {app_root}/config/current/config.yaml
const env = process.env.NODE_ENV || 'current';
// Load current configuration from config/current/*
const env_yaml_dir = pathlib.join(conf.get('app_root'), 'config', env);
console.log('load config:', pathlib.join(env_yaml_dir, '*.yaml'));
try {
  const env_yaml_config = _.chain(fs.readdirSync(env_yaml_dir))
  .filter(filename => filename.indexOf('.yaml') >= 0 && filename[0] !== '.')
  .map(filename => yaml.safeLoad(fs.readFileSync(pathlib.join(env_yaml_dir, filename), 'utf8')))
  .map(config => {
    conf.load(config);
    return config;
  })
  .value();
} catch (err) {
  if (err.code !== 'ENOENT') {
    console.error('Load environment config failed:', err);
    process.exit(2);
  } else {
    console.error('You need to create config/current configuration folder. '
      + 'Copy from predefined config/* directories or create your own and try again.'
    );
    process.exit(2);
  }
}

// // Perform validation
// conf.validate({ strict: true });

// Calculated value
/**
 * site.host Derived fully qualified host string [protocol]://[hostname|ip](:[port])
 * @type {String}
 */
if (!conf.get('site.host')) {
  conf.set('site.host', urllib.format({
    protocol: conf.get('site.protocol'),
    host: conf.get('site.hostname') || conf.get('ip')
  }));
}

// Load app version from package.json
const package_info = require('../package.json');
conf.set('version', package_info.version);

// Success
console.log('load config ok');

module.exports = conf;
