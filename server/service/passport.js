'use strict';

/**
 * 因为权限验证每个路由基本上都需要验证，所以做成service方便使用
 */

var passport = require('passport');
var flash = require('flash');

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user'); //service在执行加载所有model之前，所以必须require

/**
 * 本地验证策略
 * @type {*|Strategy}
 * @params username:是req.body.username
 * @params password:是req.body.password
 */
var localStrategy = new LocalStrategy(function(username, password, done){
  User.findOne({username: username}, function(err, user){
    if(err) return next(err);
    if(!user){
      return done(null, false, {message: '用户不存在'});
    }
    if(password !== user.password){
      return done(null, false, {message: '用户密码错误'});
    }
    return done(null, user);
  });
});

passport.init = function(app){
  app.use(passport.initialize()); //passport.initialize()会返回一个可以被connect注册的passport中间件
  app.use(passport.session());  //session持久化登陆
  app.use(flash());
  passport.use('local', localStrategy); //添加本地登陆策略
  passport.serializeUser(function(user, done){  //序列化user，即为该用户新建一个session以持久化登陆
    done(null, user);
  });
  passport.deserializeUser(function(user, done){  //反序列化user，即根据connect.sid查询session中有无该用户以验证登陆
    done(null, user);
  });
}

//用户页面访问用户登陆验证，没登陆自动跳转到主页
passport.authRed = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

//api等用户登陆验证，返回是否登陆信息
passport.authRes = function(req, res, next){
  if(req.isAuthenticated()){
    res.send({isLogin: false});
  } else {
    res.send({isLogin: true});
  }
}

module.exports = passport;