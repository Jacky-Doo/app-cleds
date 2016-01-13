'use strict';
/**
 * 样式
 */
require('./style/index.less');
/**
 * 控制器
 */
var indexCtrl = require('./controller/index.js');
var dcListCtrl = require('./controller/dcList.js');
var dcUploadCtrl = require('./controller/dcUpload.js');
var dcUpdateCtrl = require('./controller/dcUpdate.js');
var modelManageCtrl = require('./controller/modelManage.js');
var partManageCtrl = require('./controller/partManage.js');
var modelListCtrl = require('./controller/modelList.js');
var partListCtrl = require('./controller/partList.js');
/**
 * 数据模型
 */
var dcTypeModel = require('./model/dcType.js');
var dcModel = require('./model/dc.js');

angular.module('knowledge', ['ngMaterial', 'angularFileUpload', 'ngResource']);

angular.module('knowledge')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('dcUploadTpl', require('./template/dcUpload.html'));
    $templateCache.put('dcListTpl', require('./template/dcList.html'));
    $templateCache.put('dcUpdateTpl', require('./template/dcUpdate.html'));
    $templateCache.put('modelManageTpl', require('./template/modelManage.html'));
    $templateCache.put('partManageTpl', require('./template/partManage.html'));
    $templateCache.put('modelListTpl', require('./template/modelList.html'));
    $templateCache.put('partListTpl', require('./template/partList.html'));
  }])
  .config(['$stateProvider',
    function($stateProvider){
      $stateProvider
        .state('knowledge.dcList', {
          url: '/dcList/:typeId',
          templateUrl: 'dcListTpl',
          controller: dcListCtrl
        })
        .state('knowledge.dcUpload', {
          url: '/dcUpload',
          templateUrl: 'dcUploadTpl',
          controller: dcUploadCtrl
        })
        .state('knowledge.modelManage', {
          url: '/modelManage',
          templateUrl: 'modelManageTpl',
          controller: modelManageCtrl
        })
        .state('knowledge.partManage', {
          url: '/partManage',
          templateUrl: 'partManageTpl',
          controller: partManageCtrl
        })
        .state('knowledge.modelList', {
          url: '/modelList',
          templateUrl: 'modelListTpl',
          controller: modelListCtrl,
        })
        .state('knowledge.partList', {
          url: '/partList',
          templateUrl: 'partListTpl',
          contrller: partListCtrl,
        })
    }
  ])
  //缓存contrlller，这样可以直接在模板中使用，而不用在路由中定义
  .controller('indexCtrl', indexCtrl)
  .controller('dcListCtrl', dcListCtrl)
  .controller('dcUploadCtrl', dcUploadCtrl)
  .controller('dcUpdateCtrl', dcUpdateCtrl)
  .controller('modelManageCtrl', modelManageCtrl)
  .controller('partManageCtrl', partManageCtrl)
  .controller('modelListCtrl', modelListCtrl)
  .controller('partListCtrl', partListCtrl)
  .factory('dcTypeModel', dcTypeModel)
  .factory('dcModel', dcModel)

module.exports = angular.module('knowledge');