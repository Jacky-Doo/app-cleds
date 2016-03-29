'use strict';

var all = {
  app: {
    title: 'your title',
    description: 'write the description',
  },
  port: process.env.PORT || 8011,
  templateEngine: 'hbs',
  viewsDir: 'views',
  publicDir: '../client/dist',
  f2eDir: '../f2e',
  fileDir: '../file/',
  routesPath: 'routes/*.js',
  modelsPath: 'models/*.js',
  db: 'mongodb://localhost/app-cleds',
  secret: 'my secret',
  sessionCollection: 'sessions',
  maxAge: 60000,
}
var production = {
  logFormat: 'dev', //morgan日志格式
}
var development = {
  logFormat: 'dev',
}
var env = process.env.NODE_ENV == 'production' ? production : development;

module.exports = _.assign(all, env);




