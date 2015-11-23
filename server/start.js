'use strict';

//设置全局对象
global.root = __dirname;
require('./config/global')();

//连接数据库
var db = mongoose.connect(env.db, function(err) {
  if (err) {
    logger.error('Could not connect to MongoDB!\n' + err);
  }
});

//启动服务器
var app = require('./config/express')(db);
app.listen(env.port, function(){
  logger.info('Congratulation! The server is listenning on ' + env.port);
});