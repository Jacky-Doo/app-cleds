'use strict';
/**
 * 样式
 */
require('./style/index.less');
/**
 * 控制器
 */
var customNavCtrl = require('./controller/customNav');
var indexCtrl = require('./controller/index.js');
var homeCtrl = require('./controller/home.js');
var cPartCtrl = require('./controller/cPart.js');
/**
 * 数据模型
 */
var kTypeModel = require('../knowledge/model/kType.js');
var dcModel = require('../knowledge/model/dc.js');
var partTypeModel = require('../knowledge/model/partType.js');
var partModel = require('../knowledge/model/part.js');
var modelModel = require('../knowledge/model/model.js');
var modelAttrModel = require('../knowledge/model/modelAttr.js');
var lightTypeModel = require('../knowledge/model/lightType.js');
var lightColorModel = require('../knowledge/model/lightColor.js');
var lightMaterialModel = require('../knowledge/model/lightMaterial.js');
/**
 * 过滤器
 */
var kTypeFilter = require('../knowledge/filter/kType.js');
var fileSizeFilter = require('../knowledge/filter/fileSize.js');
var partNameFilter = require('../knowledge/filter/partName.js');
var partFilter = require('../knowledge/filter/part.js');
var modelAttrFilter = require('../knowledge/filter/modelAttr.js');
var selectedPartFilter = require('./filter/selectedPart.js');

angular.module('custom', ['ngMaterial', 'ngResource']);

angular.module('custom')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('homeTpl', require('./template/home.html'));
    $templateCache.put('cPartTpl', require('./template/cPart.html'));
  }])
  .config(['$stateProvider',
    function($stateProvider){
      $stateProvider
        .state('custom.home', {
          url: '/home',
          templateUrl: 'homeTpl',
          controller: homeCtrl
        })
        .state('custom.part', {
          url: '/part/:modelId',
          templateUrl: 'cPartTpl',
          controller: cPartCtrl
        })
    }
  ])
  .controller('indexCustomCtrl', indexCtrl)
  .controller('homeCtrl', homeCtrl)
  .controller('cPartCtrl', cPartCtrl)
  .controller('CustomNavCtrl', customNavCtrl)
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
  .filter('selectedPartFilter', selectedPartFilter)

module.exports = angular.module('custom');