const os = require('os');
const crypto = require('crypto');
const multer = require('multer');
const multer_s3 = require('multer-s3')
const mime = require('mime-types');
const _ = require('lodash');
const moment = require('moment');
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
const ALL_AUTHOR = ['rapee', 'thiti', 'klaikong', 'bact', 'theerapol', 'kyo', 'pek', 'nakwan', 'fon', 'tavirot', 'yanyong', 'shin'];
const ALL_TAG = ['สายไฟ', 'ทางเดินเท้า', 'เกะกะ', 'BTS', 'แผงลอย', 'เดินไม่ได้', 'ขยะเหม็นมาก', 'มืดมากกก', 'หลุม' ,'ตู่โทรศัพท์', 'เสียงดัง' ];
const ALL_ISSUE = ['สายไฟห้อยลงมาเกี่ยวกับลิฟท์', 'ท่อน้ำฝาเปิดออกมา แล้วคนก็เอาขยะมาทิ้งเกลื่อน นี่สินะทำไม น้ำรอระบายนาน!', 'ต้นไม้แถวนี้โดนตัดมาทำทางจักรยานงอๆ ที่ใช้จริงไม่ได้ คือคิดก่อนทำป่ะ?', 'ร้านข้าวหมูกรอบวันแรกก็ตั้ง 2 โต๊ะนะ ตอนนี้กินทางเดินไปจนหมดละ คนเดินไม่ได้เลย T_T'];
const ALL_PHOTO = [
  'http://youpin-asset-test.s3.amazonaws.com/a35ecd5df6a17056c5bf39bd0aa7eb12be520b85f9308c7cd70dd4d343d120b6.jpeg',
  'https://scontent.fbkk1-1.fna.fbcdn.net/t31.0-8/13613618_281619682192782_8738589152673098027_o.jpg',
  'https://scontent.fbkk1-1.fna.fbcdn.net/v/t1.0-0/p296x100/13533216_276298629391554_7772172717218465120_n.jpg?oh=918ab69fb825c0869f58e3a869439b8c&oe=57FB78C2',
  'https://scontent.fbkk1-1.fna.fbcdn.net/v/t1.0-0/q82/s526x395/13494937_275671502787600_7733967760080844518_n.jpg?oh=99e99accd5345e63b4ff302c267f1b3f&oe=58017BE6',
  'https://scontent.fbkk1-1.fna.fbcdn.net/v/t1.0-0/p296x100/13406937_268390820182335_436075173019834836_n.jpg?oh=d99cfb7ba9602aa7d70ddba9a84aa632&oe=582B8900',
  'https://scontent.fbkk1-1.fna.fbcdn.net/v/t1.0-0/s480x480/13322170_10153433182841086_7480838858373546993_n.jpg?oh=1533b9ed4ab6649461a06b0a14099fc9&oe=57F5B2FA',
  'https://scontent.fbkk1-1.fna.fbcdn.net/v/t1.0-0/p240x240/13263853_260701657617918_4152113290802958859_n.jpg?oh=61a3d64276d392e7e4b48098240fcd9f&oe=57FB719E',
  'https://scontent.fbkk1-1.fna.fbcdn.net/v/t1.0-0/p296x100/13083129_248320022189415_6337849199626050657_n.jpg?oh=f8ebb9bc113e5bd0e93fb2c136eb251d&oe=5832D23E'
];

function createMockPin(count) {
  return _.times(count || 10, i => ({
    id: '00000' + (i + 1),
    status: ALL_STATUS[_.random(0, ALL_STATUS.length - 1)],
    name: ALL_ISSUE[_.random(0, ALL_ISSUE.length - 1)],
    author: ALL_AUTHOR[_.random(0, ALL_AUTHOR.length - 1)],
    photo: [ALL_PHOTO[_.random(0, ALL_PHOTO.length - 1)]],
    location: [],
    category: [],
    tag: ALL_TAG.slice(_.random(0, ALL_TAG.length - 1)),
    created_at: '2016-06-26 13:25:00',
    view_count: _.random(10, 200),
    comment_count: _.random(0, 20),
    like_count: _.random(3, 60),
    follower_count: _.random(3, 60)
  }));
}

function createMockPinHome() {
  return [
    {
      id: '000001',
      status: 'wontfix',
      status_text: 'กำลังแก้ไข',
      name: 'ฝาท่อชำรุด',
      author: ALL_AUTHOR[_.random(0, ALL_AUTHOR.length - 1)],
      photo: [util.site_url('/public/image/pin/pin01.png')],
      location: [],
      category: [],
      tag: ['ฝาท่อ', 'อันตรายมาก', 'ทางเท้า', 'ท่อระบายน้ำ'],
      created_at: '2016-07-05 13:25:00',
      view_count: _.random(4000, 1000),
      comment_count: _.random(0, 50),
      like_count: _.random(10, 2000),
      follower_count: _.random(10, 100)
    },
    {
      id: '000002',
      status: 'fixed',
      status_text: 'แก้แล้ว',
      name: 'ขยะส่งกลิ่นเหม็นตลอดวัน',
      author: ALL_AUTHOR[_.random(0, ALL_AUTHOR.length - 1)],
      photo: [util.site_url('/public/image/pin/pin02.png')],
      location: [],
      category: [],
      tag: ['ขยะ', 'เหม็น', 'ถังขยะ', 'ขยะและสิ่งปฏิกูล'],
      created_at: '2016-07-06 13:25:00',
      view_count: _.random(4000, 1000),
      comment_count: _.random(0, 30),
      like_count: _.random(10, 200),
      follower_count: _.random(10, 100)
    },
    {
      id: '000003',
      status: 'pending',
      status_text: 'รอความคืบหน้า',
      name: 'ปลูกต้นไม้แต่เดินไม่ได้ ต้องกระโดดข้าม',
      author: ALL_AUTHOR[_.random(0, ALL_AUTHOR.length - 1)],
      photo: [util.site_url('/public/image/pin/pin03.png')],
      location: [],
      category: [],
      tag: ['กระถางต้นไม้', 'ทางเท้า', 'ต้นไม้และสวนสาธารณะ'],
      created_at: moment().subtract(_.random(60, 180), 'minutes').format('YYYY-MM-DD HH:mm:ss'),
      view_count: _.random(4000, 1000),
      comment_count: _.random(0, 50),
      like_count: _.random(10, 100),
      follower_count: _.random(10, 100)
    },
    {
      id: '000004',
      status: 'accepted',
      status_text: 'ชื่นชม',
      name: 'มรแผนที่ตรงนี้ก็สะดวกดีนะ',
      author: ALL_AUTHOR[_.random(0, ALL_AUTHOR.length - 1)],
      photo: [util.site_url('/public/image/pin/pin04.png')],
      location: [],
      category: [],
      tag: ['cityhack', 'แผนที่', 'ประชาชนทำเอง'],
      created_at: moment().subtract(_.random(1, 45), 'minutes').format('YYYY-MM-DD HH:mm:ss'),
      view_count: _.random(4000, 1000),
      comment_count: _.random(0, 10),
      like_count: _.random(10, 100),
      follower_count: _.random(10, 100)
    }
  ];
}

// App
router.get('/th', (req, res, next) => {
  res.locals.feeds = createMockPin(20);

  res.locals.page = util.page_info('app', '');
  res.render('app');
});


// Homepage
router.get('/', (req, res, next) => {
  res.locals.trending_pins = createMockPinHome();

  res.locals.page = util.page_info('home', '');
  res.render('home');
});
