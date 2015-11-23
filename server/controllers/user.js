'use strict';

var User = mongoose.model('User');

/**
 * 用户登陆表单验证，用户是否已登陆api:authRes和用户访问页面权限authRed在service/passport.js中定义
 * @param req
 * @param res
 * @param next
 * @return {isLogin: true, username: user.username}
 */
exports.logIn = function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if(err) return next(err);
    if(!user) return res.send({code: 400, isLogin: false, message: '用户名错误'});
    req.logIn(user, function(err) {
      if(err) return next(err);
      res.send({code: 200, isLogin: true, username: user.username, message: '登陆成功'});
    });
  })(req, res, next);
}

/**
 * 用户注册，注册成功后自动登陆
 * @post: {username: string, password: string}
 * @returns {code: int, isLogin: boolean, message: string}
 */
exports.register = function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  if(!username) return res.send({code: 400, isLogin: false, message: '用户名错误' });
  if(!password) return res.send({code: 400, isLogin: false, message: '密码错误' });
  var user = new User({
    username: username,
    password: password
  });
  user.save(function(err, user){
    if(err) return next(err);
    passport.authenticate('local', function(err, user, info){
      req.logIn(user, function(err){
        if(err) return next(err);
        return res.send({code: 200, isLogin: true, message: '注册成功'});
      })
    })(req, res, next);
  });
}


