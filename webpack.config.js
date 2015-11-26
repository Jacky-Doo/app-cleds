'use strict';

var webpack = require('webpack');
var path = require('path');
var HtmlPlugin = require('html-webpack-plugin');
var NgMinPlugin = require('ngmin-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    ],
    alias: {

    },
  },

  module: {
    loaders: [
      //{test: /\.html$/, loader: 'html'},
      {test: /\.html$/, loader: 'ng-cache'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},  //默认require的css文件通常为库样式，比较大单独引入
      {test: /\.scss$/, loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'}, //less scss的样式文件比较小，以style标签形式引入
      {test: /\.less/, loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'}, //less scss的样式文件比较小，以style标签形式引入
      {test: /\.png$/, loader: 'url-loader?limit=100000&mimetype=image/png'},
      {test: /\.jpg$/, loader: 'file-loader'},
      {test: /\.(eot|woff|ttf|svg|woff2)$/, loader: "file-loader"}
    ],
    noParse: [],
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
    new ExtractTextPlugin( 'style.css' ),
    //new NgMinPlugin()
  ]
}