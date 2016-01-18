'use strict';

var dcUpload = ['$scope', 'kTypeModel', 'dcModel', 'FileUploader', 'Constant',
  function($scope, kTypeModel, dcModel, FileUploader, Constant){
    /**
     * 对象声明
     */
    $scope.type = kTypeModel;
    $scope.dc = dcModel;
    $scope.Uploader = new FileUploader({url : Constant.baseUrl + '/file/single/dc'});
    /**
     * 对象方法声明
     */
    $scope.Uploader.onErrorItem = function(item){
      alert(item.file.name + '上传失败');
    }
    $scope.Uploader.onCompleteItem = function(item, res){
      if(res.code == 200){
        angular.extend($scope.dc.item, {
          fileName: res.data.name,
          mimeType: res.data.mimeType,
          fileSize: res.data.size,
          fileId: res.data._id});
        var type = $scope.type.findTypeById($scope.dc.item.typeId);
        $scope.dc.item.typeName = type.name;
        $scope.dc.addDc($scope.dc.item).then(function(){
          type.num++;
        });
      }
    }
    $scope.dc.submit = function(){
      if($scope.Uploader.queue.length == 1){
        var item = $scope.Uploader.queue[0];
        item.upload();
      } else {
        alert('确保添加了文件，有且仅一个文件');
      }
    }
    /**
     * 逻辑初始化
     */
    $scope.dc.item = null;
    $scope.$watch('dc.item.keysStr', function(newValue, oldValue, scope){
      if(newValue){
        scope.dc.item.keys = newValue.split(' ');
      }
    });
  }
];

module.exports = dcUpload;