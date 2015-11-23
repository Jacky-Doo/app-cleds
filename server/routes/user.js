'use strict';

var userController = require('../controllers/user');

module.exports = function(app){
  app.route('/login')
    .get(function(req, res, next){
      req.isAuthenticated() ? res.redirect('/') : res.render('login.hbs');
    })
    .post(userController.logIn);

  app.route('/register')
    .get(function(req, res, next){
      res.render('register.hbs');
    })
    .post(userController.register);
}
