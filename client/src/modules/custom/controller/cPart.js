'use strict';

module.exports = ['$scope', 'Sprite', 'modelModel', 'partTypeModel', '$stateParams', '$resource', 'Constant',
  function($scope, Sprite, modelModel, partTypeModel, $stateParams, $resource, Constant){
    /**
     * 定义对象
     */
    $scope.model; //实例对象，并不是modelModel
    $scope.partTypes = angular.merge(partTypeModel);
    $scope.partTypes.forEach(function(item){
      item.active = false;
    });
    $scope.view = {
      parts: [],  //当前类型的零部件对象列表
      part: null, //需要展示详细信息的零部件对象
      switchPart: switchPart,
      showPartInfo: showPartInfo,
      selectPart: selectPart,
      gg: function(){
        alert('发送成功');
      }
    }
    $scope.getFileSrc = function(id){
      console.log(id);
      var fileRsc = $resource(Constant.baseUrl + '/fiel/src/');
      fileRsc.get({id: id}, function(res){
        if(res.data && res.data.code == 200){
          return res.data.fileSrc;
        }
      }), function(err){
        console.log(err);
      }
    }
    /**
     * 定义函数
     */
    //切换零部件类型选择
    function switchPart(partTypeId, index){
      $scope.view.parts = [];
      var flag = false; //标识有没有该类型零部件
      var partList = $scope.model.partList;
      $scope.partTypes.forEach(function(item){
        item.active = false;
      });
      $scope.partTypes[index].active = true;
      partList.forEach(function(item){
        if(item.typeId == partTypeId){
          $scope.view.parts.push(item);
          flag = true;
        }
      });
      if(!flag){
        alert('该定制实例不需要此类型的零部件！');
      } else {
        showPartInfo($scope.view.parts[0]);
      }
    }
    //选择指定的零部件
    function selectPart(index){
      if($scope.view.parts && (index < $scope.view.parts.length)){
        $scope.view.parts.forEach(function(item){
          item.selected = false;
        });
        $scope.view.parts[index].selected = true;
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
      console.log(model);
      $scope.view.switchPart('chip', 1);
      $scope.view.showPartInfo($scope.view.parts[0]);
    });
  }
]
