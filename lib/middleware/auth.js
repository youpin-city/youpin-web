import util from '../util';
import conf from '../config';
import log from '../logger';
import _ from 'lodash';
import createError from 'http-errors';
import api from '../api';

const cookie_auth_name = 'feathers-jwt';
const cookie_user_info = 'user';
// const allowed_roles = [
//   'super_admin',
//   'organization_admin',
//   'department_head'
// ];
// const superuser_roles = [
//   'super_admin',
//   'organization_admin'
// ];

function parse_jwt(token = '') {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url && base64Url.replace('-', '+').replace('_', '/');
    return base64 && JSON.parse(new Buffer(base64, 'base64').toString());
  } catch (err) {
    log.error(err);
    return undefined;
  }
}

function reset_user(req, res) {
  res.clearCookie(cookie_auth_name);
  delete req.cookies[cookie_auth_name];
  res.clearCookie(cookie_user_info);
  delete req.cookies[cookie_user_info];
}

function parse_user(user) {
  // user.is_superuser = superuser_roles.indexOf(user.role) >= 0;
  return user;
}

export {
  cookie_auth_name,
  cookie_user_info,
  // allowed_roles,
  reset_user
};

export default function auth(check_auth = true) {
  return (req, res, next) => {
    const jwt = req.cookies[cookie_auth_name];
    const jwt_data = parse_jwt(jwt);
    const user_id = jwt_data && jwt_data._id;
    if (jwt) {
      const options = {
        headers: {
          Authorization: 'Bearer ' + jwt
        }
      };
      req.api = api.APIFetch(conf.get('service.api.url'), options, _.identity);
    }

    let get_user;
    if (jwt && user_id) {
      get_user = req.api('/users/' + user_id);
    } else {
      get_user = Promise.resolve(null);
    }

    return get_user
    .then(data => {
      if (data) {
        const user = data;
        user.token = jwt;
        // assign to user
        req.user = res.locals.user = parse_user(user);
        req.cookies[cookie_user_info] = user;
        res.cookie(cookie_user_info, user, conf.get('service.cookie'));
      }
    })
    .catch(err => {
      log.error(err);
      reset_user(req, res);
    })
    .then(() => {
      // require authenticated user
      if (check_auth) {
        if (!req.user) {
          res.redirect('/login');
          return;
        }
        // if (allowed_roles.indexOf(req.user.role) === -1) {
        //   throw new createError.Unauthorized();
        // }
      }
      next();
    })
    .catch(err => {
      reset_user(req, res);
      next(err);
    });
  };
}
