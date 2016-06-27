const conf = require('./config');
const Promise = require('bluebird');
// Amazon AWS
const AWS = require('aws-sdk');
const awsConfig = {};
awsConfig.region = conf.get('service.aws.region');
awsConfig.accessKeyId = conf.get('service.aws.access_key');
awsConfig.secretAccessKey = conf.get('service.aws.secret');
AWS.config.update(awsConfig);

// S3 (http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/frames.html#!http%3A//docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3_20060301.html)
exports.s3 = Promise.promisifyAll(new AWS.S3({

  params: { Bucket: conf.get('service.aws.s3_asset_bucket') }

}));
