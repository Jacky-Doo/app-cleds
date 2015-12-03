'use strict';

require('./style/common.less');
/**
 * common模板
 */
require('./template/header.html');
require('./template/pdtCard.html');
/**
 * assets
 */
require('./assets/svg-symbols.less');
/**
 * components
 */
require('./components/index.js');
/**
 * controllers
 */
var allCtrl = require('./controller/all.js');
angular.module('common', [])
  .controller('AllCtrl', allCtrl)