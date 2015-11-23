'use strict';

var webpack = require('webpack');
var path = require('path');
var HtmlPlugin = require('html-webpack-plugin');
var NgMinPlugin = require("ngmin-webpack-plugin");

var srcPath = path.join(__dirname, './client/src');
var distPath = path.join(__dirname, './client/dist');

module.exports = {

  entry: {
    app: path.join(srcPath, 'entry/app.js'),
    vendor1: path.join(srcPath, 'entry/vendor1'),
    vendor2:  path.join(srcPath, 'entry/vendor2'),
  },

  output: {
    path: distPath,
    filename: '[name].js'
  },

  resolve: {
    modulesDirectories: [
      'node_modules'
    ]
  },

  module: {
    loaders: [
      {test: /\.html$/, loader: 'html'},
      {test: /\.scss$/, loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'},
      {test: /\.png$/, loader: 'url-loader?limit=100000&mimetype=image/png'},
      {test: /\.jpg$/, loader: 'file-loader'}
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'angular'
    }),
    new HtmlPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html',
      inject: 'body',
      chunks: ['app', 'vendor1', 'vendor2']
    }),
    //new NgMinPlugin()
  ]
}