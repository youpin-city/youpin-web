const os = require('os');
const crypto = require('crypto');
const multer = require('multer');
const multer_s3 = require('multer-s3')
const mime = require('mime-types');
const _ = require('lodash');
const logger = require('../logger');
const util = require('../util');
const conf = require('../config');
const aws = require('../aws');

// setup
const router = require('express').Router(); // eslint-disable-line
module.exports = router;


function bufferToHash(buffer) {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

const uploader = multer({
  storage: multer_s3({
    s3: aws.s3,
    bucket: conf.get('service.aws.s3_asset_bucket'),
    acl: 'public-read',
    contentType: multer_s3.AUTO_CONTENT_TYPE,
    // contentDisposition: `inline; filename=file`,
    cacheControl: 'max-age=36000',
    metadata: function (req, file, cb) {
      // each will be prefix with 'x-amz-meta-'
      cb(null, {
        'original-name': file.originalname,
      });
    },
    key: function (req, file, cb) {
      cb(null, `${bufferToHash(file.fieldname + Date.now())}.${mime.extension(file.mimetype)}`);
    }
  }),
  // dest: os.tmpdir(),
  fileFilter: (req, file, cb) => {
    if ([
      'image/jpeg',
      'image/png',
      'image/gif',
      // 'application/pdf'
    ].indexOf(file.mimetype) >= 0) {
      return cb(null, true);
    }
    cb(new Errand({ code: 'UNSUPPORT_FORMAT' }), false);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// router.get('/api/image', (req, res) => {
//   res.status(200)
//     .send('<form method="POST" enctype="multipart/form-data">'
//       + '1. <input type="file" name="file"/><br>'
//       + '2. <input type="file" name="file"/><br>'
//       + '<input type="submit"/>'
//       + '</form>')
//     .end();
// });

// Simple upload image
router.post('/api/image', uploader.any(), (req, res, next) => {
  res.json(req.files.map(file => ({
    url: file.location,
    mimetype: file.mimetype,
    size: file.size
  })));
});

// Test: design page
router.get('/design', (req, res, next) => {
  res.locals.page = util.page_info('design', '');
  res.render('design');
});

// Test: map page
router.get('/map', (req, res, next) => {
  res.locals.page = util.page_info('map', '');
  res.render('map');
});


const ALL_STATUS = ['pending', 'approved', 'fixed', 'wontfix'];
const ALL_AUTHOR = ['rapee', 'thiti', 'klaikong', 'bact', 'theerapol', 'kyo', 'pek', 'nakwan', 'fon', ];
const ALL_TAG = ['สายไฟ', 'ทางเดินเท้า', 'เกะกะ', 'BTS', 'แผงลอย', 'เดินไม่ได้', 'ขยะเหม็นมาก', 'มืดมากกก', 'หลุม' ,'ตู่โทรศัพท์', 'เสียงดัง' ];
const ALL_ISSUE = ['สายไฟห้อยลงมาเกี่ยวกับลิฟท์', 'ท่อน้ำฝาเปิดออกมา แล้วคนก็เอาขยะมาทิ้งเกลื่อน นี่สินะทำไม น้ำรอระบายนาน!', 'ต้นไม้แถวนี้โดนตัดมาทำทางจักรยานงอๆ ที่ใช้จริงไม่ได้ คือคิดก่อนทำป่ะ?', 'ร้านข้าวหมูกรอบวันแรกก็ตั้ง 2 โต๊ะนะ ตอนนี้กินทางเดินไปจนหมดละ คนเดินไม่ได้เลย T_T'];
// Homepage
router.get('/', (req, res, next) => {
  res.locals.feeds = _.times(15, i => ({
    id: '00000' + (i + 1),
    status: ALL_STATUS[_.random(0, ALL_STATUS.length - 1)],
    name: ALL_ISSUE[_.random(0, ALL_ISSUE.length - 1)],
    author: ALL_AUTHOR[_.random(0, ALL_AUTHOR.length - 1)],
    photo: [],
    location: [],
    category: [],
    tag: ALL_TAG.slice(_.random(0, ALL_TAG.length - 1)),
    created_at: '2016-06-26 13:25:00',
    view_count: _.random(10, 200),
    comment_count: _.random(0, 20),
    like_count: _.random(3, 60),
    follower_count: _.random(3, 60)
  }));

  res.locals.page = util.page_info('home', '');
  res.render('home');
});
