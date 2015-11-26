'use strict';

var svgAdd = require('../../common/img/ic_add_black_24px.svg');
var svgRemove = require('../../common/img/ic_remove_black_24px.svg');
var svgRight = require('../../common/img/ic_chevron_right_black_24px.svg');

var customeNavController = ['$scope',
  function($scope){
    /**
     * $scope.header
     */
    $scope.header = {
      svgSrc: svgRemove,
    }
    $scope.header.switch = function(){
      if($scope.header.svgSrc == svgAdd){
        $scope.header.svgSrc = svgRemove;
        $scope.content.isShow = true;
      } else {
        $scope.header.svgSrc = svgAdd;
        $scope.content.isShow = false;
      }
    }
    /**
     * $scope.items && $scope.content
     */
    $scope.content = {
      isShow: true,
    };
    $scope.content.items = [
      {
        title: '室内灯具',
        options: ['筒灯', '球泡灯', '栅格灯']
      },
      {
        title: '室外灯具',
        options: ['路灯', '太阳能路灯']
      }
    ];
    $scope.content.items.forEach(function(item){
      item.svgSrc = svgAdd;
    });
    $scope.content.items[0].svgSrc = svgRemove;
    $scope.content.items[0].isShow = true;
    $scope.content.switch = function(i){
      var svgSrc = $scope.content.items[i].svgSrc
      $scope.content.items.forEach(function(item){
        item.svgSrc = svgAdd;
        item.isShow = false;
      });
      if(svgSrc == svgAdd){
        $scope.content.items[i].svgSrc = svgRemove;
        $scope.content.items[i].isShow = true;
      }
    }
    $scope.whatSvgSrc = svgRight;
  }
]

module.exports = customeNavController;
