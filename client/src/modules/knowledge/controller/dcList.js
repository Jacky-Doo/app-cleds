'use strict';

var dcList = ['$scope', 'dcModel', 'kTypeModel', '$stateParams', '$mdDialog', 'Sprite',
  function($scope, dcModel, kTypeModel, $stateParams, $mdDialog, Sprite){
    /**
     * 定义对象
     */
    var wordImg = require('../img/word.png');
    var pptImg = require('../img/ppt.png');
    var excelImg = require('../img/excel.png');
    var pdfImg = require('../img/pdf.png');
    var Constant = {
      pageSize: 2,
    }
    $scope.dc = dcModel;
    $scope.type = kTypeModel;
    $scope.pagination = {
      total: '',
      currentPage: 1,
      step: 5,
      gotoPage: function(){ //注意是gotoPage()，而不是gotoPage,会在第一次加载时就执行一次
        getDcs(this.currentPage);
      }
    }
    /**
     * 定义函数
     */
    function parseImg(mimeType){
      switch (mimeType){
        case 'word':
          return wordImg;
        case 'ppt':
          return pptImg;
        case 'excel':
          return excelImg;
        case 'pdf':
          return pdfImg;
        default :
          return wordImg
      }
    }
    function getDcs(pageId){
      $scope.dc.getDcs($stateParams.typeId, pageId, Constant.pageSize).then(function(res){
        if(res.code != 200) {
          alert('没有相关文档');
          return;
        }
        $scope.dc.collection.forEach(function(item){
          item.isShowDesc = false;
          item.imgUrl = parseImg(item.mimeType);
        });
        if(res.data.count){
          $scope.pagination.total = Math.ceil(res.data.count/Constant.pageSize);
        }
      });
    }
    $scope.switchDesc = function(index){
      $scope.dc.collection[index].isShowDesc = !$scope.dc.collection[index].isShowDesc;
    }
    $scope.getDcFile = function(path){
      $scope.dc.getDcFile(path);
    }
    /**
     * 逻辑初始化
     */
    //设置Knowledge.html的$scope.type.selectedName数据，原因是ui-sref和ng-click冲突，ng-click不执行
    $scope.type.selectedName = $scope.type.findTypeById($stateParams.typeId).name;
  }
];

module.exports = dcList;
