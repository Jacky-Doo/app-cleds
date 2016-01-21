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
var dcManageCtrl = require('./controller/dcManage.js');
var modelManageCtrl = require('./controller/modelManage.js');
var partManageCtrl = require('./controller/partManage.js');
var modelListCtrl = require('./controller/modelList.js');
var partListCtrl = require('./controller/partList.js');
/**
 * 数据模型
 */
var kTypeModel = require('./model/kType.js');
var dcModel = require('./model/dc.js');
var partTypeModel = require('./model/partType.js');
var partModel = require('./model/part.js');
var modelModel = require('./model/model.js');
var modelAttrModel = require('./model/modelAttr.js');
var lightTypeModel = require('./model/lightType.js');
var lightColorModel = require('./model/lightColor.js');
var lightMaterialModel = require('./model/lightMaterial.js');
/**
 * 过滤器
 */
var kTypeFilter = require('./filter/kType.js');
var fileSizeFilter = require('./filter/fileSize.js');
var partNameFilter = require('./filter/partName.js');
var partFilter = require('./filter/part.js');
var modelAttrFilter = require('./filter/modelAttr.js');

angular.module('knowledge', ['ngMaterial', 'angularFileUpload', 'ngResource']);

angular.module('knowledge')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('dcListTpl', require('./template/dcList.html'));
    $templateCache.put('dcManageTpl', require('./template/dcManage.html'));
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
        .state('knowledge.dcManage', {
          url: '/dcManage',
          templateUrl: 'dcManageTpl',
          controller: dcManageCtrl
        })
        .state('knowledge.modelManage', {
          url: '/modelManage',
          templateUrl: 'modelManageTpl',
          controller: modelManageCtrl,
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
          controller: partListCtrl,
        })
    }
  ])
  //缓存contrlller，这样可以直接在模板中使用，而不用在路由中定义
  .controller('indexKnowledgeCtrl', indexCtrl)
  .controller('dcListCtrl', dcListCtrl)
  .controller('dcManageCtrl', dcManageCtrl)
  .controller('modelManageCtrl', modelManageCtrl)
  .controller('partManageCtrl', partManageCtrl)
  .controller('modelListCtrl', modelListCtrl)
  .controller('partListCtrl', partListCtrl)
  .factory('kTypeModel', kTypeModel)
  .factory('dcModel', dcModel)
  .factory('partTypeModel', partTypeModel)
  .factory('partModel', partModel)
  .factory('modelModel', modelModel)
  .factory('lightTypeModel', lightTypeModel)
  .factory('lightColorModel', lightColorModel)
  .factory('lightMaterialModel', lightMaterialModel)
  .factory('modelAttrModel', modelAttrModel)
  .filter('kTypeFilter', kTypeFilter)
  .filter('fileSizeFilter', fileSizeFilter)
  .filter('partNameFilter', partNameFilter)
  .filter('partFilter', partFilter)
  .filter('modelAttrFilter', modelAttrFilter)

module.exports = angular.module('knowledge');