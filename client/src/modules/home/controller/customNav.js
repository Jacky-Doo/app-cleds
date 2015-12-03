'use strict';

var CustomNavCtrl = ['$scope', 'sprite', '$interval',
  function($scope, sprite, $interval){
    /**
     * $scope.header
     */
    $scope.header = {
      svg: sprite.remove,
      isCollapse: false
    }
    $scope.$watch('header.isCollapse', function(newValue, oldValue, scope){
      if(newValue){
        scope.header.svg = sprite.add;
      } else {
        scope.header.svg = sprite.remove;
      }
    });
    /**
     * $scope.content
     */
    $scope.content = {};
    $scope.content.items = [
      {
        title: '室内灯具',
        options: ['筒灯', '球泡灯', '栅格灯'],
        isCollapse: false
      },
      {
        title: '室外灯具',
        options: ['路灯', '太阳能路灯'],
        isCollapse: true
      }
    ];
    $scope.$watch('content.items', function(newValue, oldValue, scope){
      scope.content.items.forEach(function(item){
        if(item.isCollapse){
          item.svg = sprite.add;
        } else {
          item.svg = sprite.remove;
        }
      })
    }, true);
    $scope.whatSvg = sprite.right;
    /**
     * pdtCard
     */
    var imgSrc = require('../img/banner1.jpg');
    $scope.pdtCard = {
      imgSrc : imgSrc,
      title: '雷克照明MR16射灯',
      desc: '雷克照明MR16射灯雷克照明MR16射灯雷克照明MR16射灯',
      icon: {
        favoriteUrl: sprite.favorite,
        shareUrl : sprite.share
      }
    }
  }
]

module.exports = CustomNavCtrl;
