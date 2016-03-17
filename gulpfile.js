'use strict';
var gulp = require('gulp');
var path =require('path');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");
var nodemon = require('nodemon');
var nodeDebug = require('gulp-node-debug');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var svgSymbols = require('gulp-svg-symbols');

var webpackConfig = Object.create(require('./webpack.config.js'));
var webpackDevPort = 8080;
var srcPath = './client/src';

/**
 * @description: 常用独立gulp task
 */
gulp.task('clean', function(){
  return gulp.src(['client/dist'], {read: true})
    .pipe(clean());
});

gulp.task('svg-sprite', function () {
  return gulp.src('client/src/modules/common/assets/svg/*.svg')
    .pipe(svgSymbols())
    .pipe(gulp.dest('client/src/modules/common/assets/'));
});

/**
 * @description: dev 配置
 * @build:dev: 启动webpack-dev-server,并进行前端相关task
 * @dev: 启动webpack-dev-server和node development服务器
 * @tips: webpack-dev-server只在内存中重新构建文件，所以node服务器不会实时更新，
 *   需要用webpack-dev-server查看页面，node-server:dev只是提供API；
 */

gulp.task("webpack-dev-server", function(callback) {
  webpackConfig.devtool = "eval";
  webpackConfig.debug = true;
  new WebpackDevServer(webpack(webpackConfig), {
    stats: {
      colors: true
    }
  }).listen(webpackDevPort, "localhost", function(err) {
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
      gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});

gulp.task('build:dev', function() {
  runSequence('webpack-dev-server');
});

gulp.task('node-server:dev', function () {
  nodemon({
    script: './server/start.js',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('node-server:debug', function(){
  gulp.src('./server/start.js')
    .pipe(nodeDebug({
      webPort: 3000,
      debugBrk: false,
    }));
});

gulp.task('dev', function(){
  runSequence('build:dev', 'node-server:dev');
});

/**
 * @description: pdt 配置
 */

gulp.task('webpack-build', function(callback) {
  webpackConfig.plugins = webpackConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    })
    //new webpack.optimize.DedupePlugin(),
    //new webpack.optimize.UglifyJsPlugin()
  );
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack-build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('build', function(){
  runSequence('webpack-build');
})

gulp.task('node-server', function () {
  nodemon({
    script: './server/start.js',
    env: { 'NODE_ENV': 'production' }
  });
});


gulp.task('pdt', function(){
  runSequence('webpack-build', 'node-server');
});

gulp.task('default', ['build:dev'], function(){

});
