const _ = require('lodash');

const parser = exports;
/**
 * Parse pin info returned from API
 * @param  {Object} pin_info Key-mapped pin info
 * @param  {Object} location Leaflet LatLng compatible location
 * @param  {String} key      ID
 * @return {Object}          Normalized pin object
 */
parser.pin = function (pin_info, location, key) {
  return _.defaults(pin_info, {
    location: location
  }, {
    id: key,
    categories: [],
    tags: [],
    photos: [],
    videos: [],
    voters: [],
    comments: [],
    followers: [],
    mentions: [],
    location: [13.7538745, 100.5016276]
  });
};
