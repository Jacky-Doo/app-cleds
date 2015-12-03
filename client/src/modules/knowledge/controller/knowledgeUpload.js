'use strict';

var knowledgeUpload = ['$scope', 'knowledgeTypes', 'knowledgeDc',
  function($scope, knowledgeTypes, knowledgeDc){
    $scope.dc = {
      //types: [
      //  {name: 'doc', value: 0},
      //  {name: 'ppt', value: 1},
      //  {name: 'xlc', value: 2},
      //  {name: 'pdf', value: 4},
      //],
      type: '',
      title: '',
      keys: '',
      desc: '',
      file: {},
      types: ['技术沉淀', '技术标准', '相关专利', '相关论文', '行业动态', '失效产品', '优质产品'],
      submit: function(){
        //console.log($scope.dc);
        //KnowledgeDc.postDc().success(function(){
        //  alert('成功！！！');
        //})
      }
    }
    $scope.Types = new knowledgeTypes();
    //KnowledgeTypes.get().success(function(data){
    //  KnowledgeTypes.types = data;
    //  $scope.dc.desc = KnowledgeTypes.types.msg.html;
    //});
    $scope.Types.get(function(data){
      //$scope.dc.desc = $scope.Types.types;
      console.log(data);
    })
    $scope.dc.type = $scope.dc.types[0];
  }
];

module.exports = knowledgeUpload;