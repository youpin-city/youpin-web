const convict = require('convict');
const urllib = require('url');

// Define a schema
const conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'staging', 'development', 'local'],
    default: 'local',
    env: 'NODE_ENV'
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
    default: 7000,
    env: 'PORT'
  },
  debug: {
    doc: 'Debug mode.',
    format: Boolean,
    default: false,
    env: 'DEBUG'
  },
  debug_livereload: {
    doc: 'Enable live-reloading in debug mode.',
    format: Boolean,
    default: false,
    env: 'DEBUG_LIVERELOAD'
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
      default: 'youpin.city',
      env: 'SITE_HOSTNAME'
    },
    title: {
      doc: 'Website name',
      format: String,
      default: 'ยุพิน YouPin',
      env: 'SITE_TITLE'
    },
    description: {
      doc: 'Website description',
      format: String,
      default: 'YouPin is an open platform for community reporting',
      env: 'SITE_DESCRIPTION'
    },
    keywords: {
      doc: 'Website keywords',
      format: Array,
      default: [
        'smart city',
        'ร้องทุกข์',
        'ชุมชนยั่งยืน',
        'active citizen',
        'รายงานปัญหา',
        'แก้ไขปัญหา'
      ],
      env: 'SITE_KEYWORDS'
    }
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
      },
      app_username: {
        doc: 'YouPin API app username.',
        format: String,
        default: '',
        env: 'SERVICE_API_APP_USERNAME'
      },
      app_password: {
        doc: 'YouPin API app password.',
        format: String,
        default: '',
        env: 'SERVICE_API_APP_PASSWORD'
      }
    },

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

    bing: {
      api_key: {
        doc: 'Bing API Key.',
        format: String,
        default: '',
        env: 'SERVICE_BING_API_KEY'
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

  location: {
    default: {
      doc: 'Default location coordinates',
      format: Array,
      default: [13.7534,100.5520],
      env: 'LOCATION_DEFAULT'
    }
  }
});

// Load environment dependent configuration
const env = conf.get('env');
conf.loadFile('./config/' + env + '.json');

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

/** For YouPin API authentication */
conf.set('service.api.hash_key',
  new Buffer(`${conf.get('service.api.api_key')}:${conf.get('service.api.secret')}`)
  .toString('base64')
);

/**
 * app_root App project root directory
 * @type {String}
 */
conf.set('app_root', require('path').resolve(__dirname, '..'));

// Load app version from package.json
const package_info = require('../package.json');
conf.set('version', package_info.version);

module.exports = conf;
