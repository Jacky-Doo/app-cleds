'use strict';
/**
 * 样式
 */
require('./style/home.less');
/**
 * 模板
 */

/**
 * 控制器
 */
var homeCtrl = require('./controller/home');
var customNavCtrl = require('./controller/customNav');

angular.module('home', ['ngMaterial']);

angular.module('home')
  .controller('HomeCtrl', homeCtrl)
  .controller('CustomNavCtrl', customNavCtrl)

module.exports = angular.module('home');