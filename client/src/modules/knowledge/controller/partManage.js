'use strict';

var modelUpload = ['$scope', 'partTypeModel', 'partModel', 'FileUploader', 'Constant',
  function($scope, partTypeModel, partModel, FileUploader, Constant){
    /**
     * 对象声明
     */
    $scope.partTypes = partTypeModel;
    $scope.part = partModel;
    $scope.partType;  //标识选择的零部件类型
    $scope.imageUploader = new FileUploader({url : Constant.baseUrl + '/file/single/image'});
    $scope.modelUploader = new FileUploader({url : Constant.baseUrl + '/file/single/model'});
    var uploadCount = 0;
    /**
     * 对象方法声明
     */
    $scope.imageUploader.onErrorItem = function(item){
      alert(item.file.name + '上传失败');
    }
    $scope.modelUploader.onErrorItem = function(item){
      alert(item.file.name + '上传失败');
    }
    $scope.imageUploader.onCompleteItem = function(item, res){
      if(res.code == 200){
        uploadCount ++;
        angular.extend($scope.part.item, {
          imageId: res.data._id});
        if(uploadCount == 2){
          $scope.part.addPart($scope.part.item);
        }
      }
    }
    $scope.modelUploader.onCompleteItem = function(item, res){
      if(res.code == 200){
        uploadCount ++;
        angular.extend($scope.part.item, {
          modelId: res.data._id});
        if(uploadCount == 2){
          $scope.part.addPart($scope.part.item);
        }
      }
    }
    $scope.part.submit = function(){
      if($scope.imageUploader.queue.length == 1 && $scope.modelUploader.queue.length == 1){
        uploadCount = 0;
        var imageItem = $scope.imageUploader.queue[0];
        var modelItem = $scope.modelUploader.queue[0];
        imageItem.upload();
        modelItem.upload();
      } else {
        alert('确保添加了文件，有且仅一个文件');
      }
    }
    /**
     * 逻辑初始化
     */
    $scope.part.item = null;
    $scope.$watch('partType', function(newValue, oldValue, scope){
      if(newValue && (newValue != oldValue)){
        $scope.part.item = {};
        $scope.part.item.typeId = $scope.partType.id;
        $scope.part.item.typeName = $scope.partType.name;
        angular.extend($scope.part.item, {'attrList': $scope.partType.attrList});
      }
    });
  }
];

module.exports = modelUpload;