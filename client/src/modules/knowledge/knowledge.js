'use strict';
/**
 * 样式
 */
require('./style/knowledge.less');
/**
 * 模板
 */
require('./template/knowledgeList.html');
require('./template/knowledgeUpload.html');
/**
 * 控制器
 */
var knowledgeCtrl = require('./controller/knowledge.js');
var knowledgeListCtrl = require('./controller/knowledgeList.js');
var knowledgeUploadCtrl = require('./controller/knowledgeUpload.js');
/**
 * 数据模型
 */
var knowledgeTypes = require('./model/knowledgeTypes.js');
var knowledgeDc = require('./model/knowledgeDc.js');

angular.module('knowledge', ['ngMaterial']);

angular.module('knowledge')
  .config(['$stateProvider',
    function($stateProvider){
      $stateProvider
        .state('knowledge.list', {
          url: '/list',
          template: require('./template/knowledgeList.html'),
          controller: knowledgeListCtrl
        })
        .state('knowledge.upload', {
          url: '/upload',
          template: require('./template/knowledgeUpload.html'),
          controller: knowledgeUploadCtrl
        })
    }
  ])
  .controller('KnowledgeCtrl', knowledgeCtrl)
  .controller('KnowledgeListCtrl', knowledgeListCtrl)
  .factory('knowledgeTypes', knowledgeTypes)
  .factory('knowledgeDc', knowledgeDc)

module.exports = angular.module('knowledge');