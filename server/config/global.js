'use strict';

module.exports = function(){
  global._ = require('lodash');
  global.promise = require('promise');
  global.mongoose = require('mongoose');
  global.Schema = global.mongoose.Schema;
  global.env = require('./env');  //因为env中使用了global._,不能先加载./env.js文件
  global.logger = require('../service/logger');  //winston logger对象
  global.passport = require('../service/passport'); //passport登陆验证对象
  //捕获该错误可以解决nodeJS一处错误默认终止整个进程
  process.on('uncaughtException', function(err){
    logger.error(err);
  });
}