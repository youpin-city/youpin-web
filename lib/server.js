import conf from './config';
import logger from './logger';
import app from './app';
import moment from 'moment';
import fs from 'fs';

// Start
app.listen(conf.get('port'));

// Finishing
logger.info(fs.readFileSync('./BRANDING', 'utf8'));
logger.info('------------------------------------');
logger.info('  project : youpin-web');
logger.info('      env : ' + conf.get('env'));
logger.info('      url : ' + conf.get('site.host'));
logger.info('     port : ' + conf.get('port'));
logger.info('  started : ' + moment().format('YYYY-MM-DD HH:mm Z'));
logger.info('------------------------------------');
logger.debug('    tips : press ctrl+c to stop');
