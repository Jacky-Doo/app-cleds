'use strict';

var modelUpload = ['$scope', 'partTypeModel', 'partModel',
  function($scope, partTypeModel, partModel){
    /**
     * 对象声明
     */
    $scope.partTypes = partTypeModel;
    $scope.part = partModel;
    $scope.partType;  //标识选择的零部件类型
    $scope.pagination = {
      total: '',
      currentPage: 1,
      step: 5,
      gotoPage: function(){ //注意是gotoPage()，而不是gotoPage,会在第一次加载时就执行一次
        if($scope.partType){
          getParts(this.currentPage);

        }
      }
    }
    var Constant = {
      pageSize: 2,
    }
    /**
     * 对象方法声明
     */
    function getParts(pageId){
      $scope.part.getParts($scope.partType.id, pageId, Constant.pageSize).then(function(res){
        if(res.code != 200) {
          alert('没有相关文档');
          return;
        }
        $scope.part.collection.forEach(function(item){
          item.isShowInfo = false;
        });
        if(res.data.count){
          $scope.pagination.total = Math.ceil(res.data.count/Constant.pageSize);
        }
      });
    }
    $scope.showInfo = function(index){
      $scope.part.collection[index].isShowInfo = !$scope.part.collection[index].isShowInfo;
    }
    /**
     * 逻辑初始化
     */
    $scope.part.collection = null;
    $scope.$watch('partType', function(newValue, oldValue, scope){
      if(newValue && (newValue != oldValue)){
        getParts(1);
      }
    });

  }
];

module.exports = modelUpload;