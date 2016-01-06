'use strict';
/**
 * 样式
 */
require('./style/knowledge.less');
/**
 * 控制器
 */
var knowledgeCtrl = require('./controller/knowledge.js');
var knowledgeListCtrl = require('./controller/knowledgeList.js');
var knowledgeUploadCtrl = require('./controller/knowledgeUpload.js');
var knowledgeUpdateCtrl = require('./controller/knowledgeUpdate.js');
/**
 * 数据模型
 */
var knowledgeType = require('./model/knowledgeType.js');
var knowledgeDc = require('./model/knowledgeDc.js');

angular.module('knowledge', ['ngMaterial', 'angularFileUpload', 'ngResource']);

angular.module('knowledge')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('knowledgeUploadTpl', require('./template/knowledgeUpload.html'));
    $templateCache.put('knowledgeListTpl', require('./template/knowledgeList.html'));
    $templateCache.put('knowledgeUpdateTpl', require('./template/knowledgeUpdate.html'));
  }])
  .config(['$stateProvider',
    function($stateProvider){
      $stateProvider
        .state('knowledge.list', {
          url: '/list/:typeId',
          templateUrl: 'knowledgeListTpl',
          controller: knowledgeListCtrl
        })
        .state('knowledge.upload', {
          url: '/upload',
          templateUrl: 'knowledgeUploadTpl',
          controller: knowledgeUploadCtrl
        })
    }
  ])
  .controller('KnowledgeCtrl', knowledgeCtrl)
  .controller('KnowledgeListCtrl', knowledgeListCtrl)
  .controller('knowledgeUploadCtrl', knowledgeUploadCtrl)
  .controller('KnowledgeUpdateCtrl', knowledgeUpdateCtrl)
  .factory('KnowledgeType', knowledgeType)
  .factory('KnowledgeDc', knowledgeDc)

module.exports = angular.module('knowledge');