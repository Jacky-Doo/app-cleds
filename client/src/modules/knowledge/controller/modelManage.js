'use strict';

var modelManage = ['$scope', 'lightTypeModel', 'modelModel', 'FileUploader', 'Constant', 'lightColorModel', 'lightMaterialModel', 'partTypeModel', 'modelAttrModel', 'partModel',
  function($scope, lightTypeModel, modelModel, FileUploader, Constant, lightColorModel, lightMaterialModel, partTypeModel, modelAttrModel, partModel){
    /**
     * 对象声明
     */
    $scope.lightTypes = lightTypeModel; //LED产品类型
    $scope.lightColors = lightColorModel; //LED颜色类型
    $scope.lightMaterials = lightMaterialModel; //LED材料类型
    $scope.partTypes = partTypeModel; //LED零部件类型
    $scope.model = modelModel;  //实例对象
    $scope.part = partModel;  //零部件对象
    $scope.pagination = { //分页组件对象
      total: '',
      currentPage: 1,
      step: 5,
      gotoPage: function(){ //注意是gotoPage()，而不是gotoPage,会在第一次加载时就执行一次
        if($scope.view.partType){
          getParts(this.currentPage);
        }
      }
    }
    $scope.view = { //视图对象
      partCollapse: true,
      partType: null,
      modelType: null,
      selectPartType: function(partType){
        this.partType = partType;
        getParts(1);
      },
      showPartInfo: function(index){
        $scope.part.collection[index].isShowInfo = !$scope.part.collection[index].isShowInfo;
      },
      showModelPartInfo: function(index){
        $scope.model.item.partList[index].isShowInfo = !$scope.model.item.partList[index].isShowInfo;
      },
      //向model.item.partList添加part
      addPart: function(index){
        var item = angular.merge({}, $scope.part.collection[index]);
        $scope.model.addPart(item);
        setPartsState();
      },
      //从model.item.partList删除part
      removePart: function(index){
        $scope.model.removePart(index);
        setPartsState();
      }
    };
    $scope.imageUploader = new FileUploader({url : Constant.baseUrl + '/file/single/image'});
    $scope.modelUploader = new FileUploader({url : Constant.baseUrl + '/file/single/model'});
    var uploadCount = 0;
    var Constant = {
      pageSize: 2,
    }
    /**
     * 对象方法声明
     */
    function getParts(pageId){
      $scope.part.getParts($scope.view.partType.id, pageId, Constant.pageSize).then(function(res){
        if(res.code != 200) {
          alert('没有相关文档');
          return;
        }
        $scope.part.collection.forEach(function(item){
          item.isShowInfo = false;
          setPartsState();
        });
        if(res.data.count){
          $scope.pagination.total = Math.ceil(res.data.count/Constant.pageSize);
        }
      });
    }
    function setPartsState(){
      $scope.part.collection.forEach(function(item){
        item.isDisabledAdd = false;
        if($scope.model.item.partList){
          $scope.model.item.partList.forEach(function(part){
            if(item._id == part._id){
              item.isDisabledAdd = true;
            }
          })
        }
      });
    }
    $scope.imageUploader.onErrorItem = function(item){
      alert(item.file.name + '上传失败');
    }
    $scope.modelUploader.onErrorItem = function(item){
      alert(item.file.name + '上传失败');
    }
    $scope.imageUploader.onCompleteItem = function(item, res){
      if(res.code == 200){
        uploadCount ++;
        angular.extend($scope.model.item, {
          imageId: res.data._id});
        if(uploadCount == 2){
          console.log($scope.model.item);
          $scope.model.addModel($scope.model.item);
        }
      }
    }
    $scope.modelUploader.onCompleteItem = function(item, res){
      if(res.code == 200){
        uploadCount ++;
        angular.extend($scope.model.item, {
          modelId: res.data._id});
        if(uploadCount == 2){
          console.log($scope.model.item);
          $scope.model.addModel($scope.model.item);
        }
      }
    }
    $scope.model.submit = function(){
      if($scope.imageUploader.queue.length == 1 && $scope.modelUploader.queue.length == 1){
        uploadCount = 0;
        var imageItem = $scope.imageUploader.queue[0];
        var modelItem = $scope.modelUploader.queue[0];
        imageItem.upload();
        modelItem.upload();
      } else {
        alert('确保添加了每项文件，每项有且仅一个文件');
      }
    }
    /**
     * 逻辑初始化
     */
    $scope.model.item = {};
    angular.merge($scope.model.item, {attrList: modelAttrModel});
    $scope.$watch('view.modelType', function(newValue, oldValue){
    if($scope.view.modelType){
        $scope.model.item.typeId = $scope.view.modelType.id;
        $scope.model.item.typeName = $scope.view.modelType.name;
      }
    })
  }
];

module.exports = modelManage;