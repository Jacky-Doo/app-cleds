'use strict';

var dcUpdate = ['$scope', 'dcTypeModel', 'dcModel', 'FileUploader', 'Constant', 'Sprite', '$mdDialog',
  function($scope, dcTypeModel, dcModel, FileUploader, Constant, Sprite, $mdDialog){
    /**
     * 对象声明
     */
    $scope.type = dcTypeModel;
    $scope.dc = dcModel;
    $scope.Uploader = new FileUploader({url : Constant.baseUrl + '/knowledge/dc/file'});
    $scope.view = {
      svgClose: Sprite.add,
    }
    /**
     * 对象方法声明
     */
    $scope.Uploader.onErrorItem = function(item){
      alert(item.file.name + '上传失败');
    }
    $scope.Uploader.onCompleteItem = function(item){
      angular.extend($scope.dc.item, {size: item.file.size, mimeType: item.file.type, name: item.file.name});
      $scope.dc.updateDc($scope.dc.item);
    }
    $scope.dc.submit = function(){
      if($scope.Uploader.queue.length == 1){
        var item = $scope.Uploader.queue[0];
        item.upload();
      } else {
        $scope.dc.updateDc($scope.dc.item);
      }
    }
    $scope.view.closeDialog = function(){
      $mdDialog.cancel();
    }
    /**
     * 逻辑初始化
     */
    $scope.type.selectedName = '上传文档';
    $scope.dc.item.keysStr = $scope.dc.item.keys.toString();
    $scope.$watch('dc.item.keysStr', function(newValue, oldValue, scope){
      if(newValue){
        scope.dc.item.keys = newValue.split(' ');
      }
    });
  }
];

module.exports = dcUpdate;