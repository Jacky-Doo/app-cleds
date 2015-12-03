'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multiparty = require('connect-multiparty');
var session = require('express-session');
var compression = require('compression');
var methodOverride = require('method-override');
var mongoStore = require('connect-mongo')(session);
var helmet = require('helmet');
var glob = require('glob');

module.exports = function(db){
  var app = express();

  app.set('views', path.join(root, env.viewsDir));
  app.set('view engine', env.templateEngine);

  app.use(require("morgan")(env.logFormat, { stream: logger.stream })); //morgan负责将所有请求输出到logger.stream，logger为winston
  app.use(bodyParser.json()); //body-parser解析post请求体（不包括文件），生成req.body对象；express自动处理查询字符串，可在req.query对象中读取
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(multiparty());  //connect-multiparty解析post请求体的文件内容，生成req.files对象
  app.use(cookieParser());  //cookie-parser解析cookie，生成req.cookies对象,只能读取cookie不能通过赋值设置cookie
  app.use(session({
    secret: env.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: parseInt(env.maxAge) },
    store: new mongoStore({
      mongooseConnection: db.connection,
      collection: env.sessionCollection
    })
  })); //生成req.session，可读写session；该模块以不再依赖cookie-parser
  app.use(methodOverride());
  app.use(compression()); //文件传输压缩功能
  app.use(helmet.xframe()); //helmet 可以安全设置HTTP headers，防止一些安全攻击
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.disable('x-powered-by');
  app.use(express.static(path.join(root, env.publicDir)));  //提供静态文件访问功能

  //加载所有model文件，mongoose.model()函数会执行模型注册，所以除了service需要require,其它都无需require model文件
  //模型会在路由文件加载后被调用所以必须要同步加载，且在路由文件之前
  var files = glob.sync(path.join(root, env.modelsPath));
  files.forEach(function(file){
    require(file);
  });

  //加载所有route文件，并执行
  glob(path.join(root, env.routesPath), function(err, files){
    files.forEach(function(file){
      require(file)(app);
    });
  });

  //初始化用户登陆模块
  passport.init(app);

  return app;
}


