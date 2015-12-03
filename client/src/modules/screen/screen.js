'use strict';
/**
 * 样式
 */
require('./style/screen.less');
/**
 * 模板
 */

/**
 * 控制器
 */
var screenCtrl = require('./controller/screen.js');
var screenNavCtrl = require('./controller/screenNav');

angular.module('screen', ['ngMaterial']);

angular.module('screen')
  .controller('screenCtrl', screenCtrl)
  .controller('screenNavCtrl', screenNavCtrl)

module.exports = angular.module('screen');