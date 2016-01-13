'use strict';

var dcUpload = ['$scope', 'dcTypeModel', 'dcModel', 'FileUploader', 'Constant',
  function($scope, dcTypeModel, dcModel, FileUploader, Constant){
    /**
     * 对象声明
     */
    $scope.type = dcTypeModel;
    $scope.dc = dcModel;
    $scope.Uploader = new FileUploader({url : Constant.baseUrl + '/knowledge/dc/file'});
    /**
     * 对象方法声明
     */
    $scope.Uploader.onErrorItem = function(item){
      alert(item.file.name + '上传失败');
    }
    $scope.Uploader.onCompleteItem = function(item, res){
      console.log(item);
      console.log(res);
      angular.extend($scope.dc.item, {size: item.file.size, mimeType: item.file.type, name: item.file.name, path: res.data.path});
      $scope.dc.addDc($scope.dc.item).then(function(){
        var type = $scope.dc.item._type;
        if(typeof type == 'string'){
          type = JSON.parse(type);
        }
        $scope.type.findTypeById(type._id).num++;
      });
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
    //$scope.type.selectedName = '上传文档';
    $scope.$watch('dc.item.keysStr', function(newValue, oldValue, scope){
      if(newValue){
        scope.dc.item.keys = newValue.split(' ');
      }
    });
  }
];

module.exports = dcUpload;