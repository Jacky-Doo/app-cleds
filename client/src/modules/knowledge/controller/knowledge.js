'use strict';

module.exports = ['$scope', 'sprite',
  function($scope, sprite){
    /**
     * $scope.nav
     */
    $scope.nav = {
      selectedItem: 0,
      list: {},
    };
    $scope.nav.list = [
      {name: '技术沉淀', value: 0, num: 10, url: 'knowledge.list'},
      {name: '技术标准', value: 1, num: 10, url: 'knowledge.list'},
      {name: '相关专利', value: 2, num: 10, url: 'knowledge.list'},
      {name: '相关论文', value: 3, num: 10, url: 'knowledge.list'},
      {name: '行业动态', value: 4, num: 10, url: 'knowledge.list'},
      {name: '失效产品', value: 5, num: 10, url: 'knowledge.list'},
      {name: '优质产品', value: 6, num: 10, url: 'knowledge.list'},
      {name: '文件上传', value: 7, num: 10, url: 'knowledge.upload'},
      {name: '知识搜索', value: 8, num: 10, url: 'knowledge.list'}
    ];
    $scope.$watch('nav.selectedItem', function(newValue, oldValue, scope){
      scope.nav.list.forEach(function(li){
        li.selected = false;
      });
      scope.nav.list[newValue].selected = true;
    });
  }
]
