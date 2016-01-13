'use strict';

var dcList = ['$scope', 'dcModel', 'dcTypeModel', '$stateParams', '$mdDialog', 'Sprite',
  function($scope, dcModel, dcTypeModel, $stateParams, $mdDialog, Sprite){
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
    $scope.type = dcTypeModel;
    $scope.pagination = {
      total: '',
      currentPage: 1,
      step: 5,
      gotoPage: function(){
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
    function parseDate(time){
      var date = new Date(time);
      var dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDay() + 1);
      return dateStr;
    }
    function parseSize(size){
      return size < 1024*1024 ? (size/1024).toFixed(1) + 'KB' : (size/1024/1024).toFixed(1) + 'MB';
    }
    function getDcs(pageId){
      $scope.dc.getDcs($stateParams.typeId, pageId, Constant.pageSize).then(function(res){
        $scope.dc.collection.forEach(function(item){
          item.isShowDesc = false;
          item.size = parseSize(item.size);
          item.updateDate = parseDate(item.updateTime);
          item.imgUrl = parseImg(item.mimeType);
        });
        //仅pageId=1时会返回总数据量count
        if(res.data.count){
          $scope.pagination.total = res.data.count/Constant.pageSize;
        }
      });
    }
    $scope.switchDesc = function(index){
      $scope.dc.collection[index].isShowDesc = !$scope.dc.collection[index].isShowDesc;
    }
    $scope.getDcFile = function(path){
      $scope.dc.getDcFile(path);
    }
    $scope.showUpdate = function(id){
      $scope.dc.item = $scope.dc.findItemById(id);
      $mdDialog.show({
        controller: 'dcUpdateCtrl',
        templateUrl: 'dcUpdateTpl',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    }
    /**
     * 逻辑初始化
     */
    getDcs(1);
    //设置Knowledge.html的$scope.type.selectedName数据，原因是ui-sref和ng-click冲突，ng-click不执行
    $scope.type.selectedName = $scope.type.findTypeById($stateParams.typeId).name;
  }
];

module.exports = dcList;
