'use strict';

module.exports = ['$scope', 'Sprite', 'modelModel', 'partTypeModel', '$stateParams', '$resource', 'Constant',
  function($scope, Sprite, modelModel, partTypeModel, $stateParams, $resource, Constant){
    /**
     * 定义对象
     */
    $scope.model; //实例对象，并不是modelModel
    $scope.partTypes = angular.merge(partTypeModel);
    //$scope.partTypes.shift();
    $scope.partTypes.forEach(function(item){
      item.active = false;
    });
    $scope.view = {
      parts: [],  //当前类型的零部件对象列表
      part: null, //需要展示详细信息的零部件对象
      switchPart: switchPart,
      showPartInfo: showPartInfo,
      selectPart: selectPart,
      modelType: '',
      isShowList: false,
      go: function(){
        console.log($scope.model);
        $scope.view.isShowList = true;
      }
    }
    /**
     * 定义函数
     */
    //切换零部件类型选择
    function switchPart(partTypeId, index, partType){
      $scope.view.isShowList = false;
      $scope.view.parts = [];
      var hasPartType = false; //标识有没有该类型零部件
      if(partType){
        hasPartType = true;
      }
      var hasSelected = false;
      var partList = $scope.model.partList;
      $scope.partTypes.forEach(function(item){
        item.active = false;
      });
      $scope.partTypes[index].active = true;
      partList.forEach(function(item){
        if(item.typeId == partTypeId){
          $scope.view.parts.push(item);
          if(item.selected){
            showPartInfo(item);
            hasSelected = true;
          }
          hasPartType = true;
        }
      });
      if(!hasPartType){
        alert('该定制实例不需要此类型的零部件！');
      }
      if(!hasSelected){
        selectPart(0);
      }
    }
    //选择指定的零部件
    function selectPart(index){
      if($scope.view.parts && (index < $scope.view.parts.length)){
        $scope.view.parts.forEach(function(item){
          item.selected = false;
        });
        $scope.view.parts[index].selected = true;
        showPartInfo($scope.view.parts[index]);
      }
    }
    //显示零部件详细信息
    function showPartInfo(part){
      $scope.view.part = part;
    }
    /**
     * 初始化
     */
    modelModel.getModel($stateParams.modelId).then(function(model){
      $scope.model = model;
      $scope.view.modelSrc = model.modelSrc;
      $scope.partTypes.forEach(function(partType){
        switchPart(partType.id, 0, true);
      })
    });
  }
]
