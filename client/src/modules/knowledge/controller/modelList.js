'use strict';

var modelList = ['$scope', 'lightTypeModel', 'modelModel', 'FileUploader', 'Constant',
  function($scope, lightTypeModel, modelModel, FileUploader, Constant){
    /**
     * 对象声明
     */
    $scope.lightTypes = lightTypeModel;
    $scope.model = modelModel;
    $scope.view = {
      lightType: $scope.lightTypes[0],
      showInfo: function(index){
        $scope.model.collection[index].isShowInfo = !$scope.model.collection[index].isShowInfo;
      }
    }
    $scope.pagination = {
      total: '',
      currentPage: 1,
      step: 5,
      gotoPage: function(){ //注意是gotoPage()，而不是gotoPage,会在第一次加载时就执行一次
        if($scope.view.lightType){
          getModels(this.currentPage);
        }
      }
    }
    var Constant = {
      pageSize: 2,
    }
    /**
     * 对象方法声明
     */
    function getModels(pageId){
      $scope.model.getModels($scope.view.lightType.id, pageId, Constant.pageSize).then(function(res){
        if(res.code != 200) {
          alert('没有相关文档');
          return;
        }
        $scope.model.collection.forEach(function(item){
          item.isShowInfo = false;
        });
        if(res.data.count){
          $scope.pagination.total = Math.ceil(res.data.count/Constant.pageSize);
        }
      });
    }
    /**
     * 逻辑初始化
     */
    $scope.$watch('view.lightType', function(newValue, oldValue){
      if(newValue && newValue != oldValue){
        getModels(1);
      }
    });
  }
];

module.exports = modelList;