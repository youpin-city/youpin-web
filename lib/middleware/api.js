import _ from 'lodash';
import log from '../logger';
import conf from '../config';
import api from '../api';

export default (req, res, next) => {
  req.api = api.APIFetch(conf.get('service.api.url'), {}, _.identity);
  next();
};
