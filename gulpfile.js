'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var nodemon = require('nodemon');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');


gulp.task('clean', function(){
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

gulp.task('webpack', ['clean'], function(callback){
  var webpackConfig = Object.create(require('./webpack.config.js'));
  webpack(webpackConfig, function(err, stats){
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task('watch', function(){
  gulp.watch('./client/src/**/*.*', ['webpack']);
});

gulp.task('start', function () {
  nodemon({
    script: './server/start.js',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('default', function(){
  runSequence('clean', 'webpack', 'start', 'watch', function() {
    //done();
  });
});
