'use strict';

module.exports = ['$scope', 'Sprite', 'modelModel',
  function($scope, Sprite, modelModel){
    /**
     * 定义对象
     */
    $scope.model = modelModel;
    $scope.deals;
    var Constant = {
      pageSize: 2,
    }
    /**
     * 定义函数
     */
    function getModels(pageId){
      $scope.model.getModelDeals('any', pageId, Constant.pageSize).then(function(res){
        if(res.code != 200) {
          alert('没有相关文档');
          return;
        } else{
          $scope.deals = res.data.modelDeals;
        }
      });
    }
    /**
     * 初始化
     */
    getModels(1);
  }
]
