'use strict';

var CustomNavCtrl = ['$scope', 'Sprite', '$interval',
  function($scope, Sprite, $interval){
    /**
     * $scope.header
     */
    $scope.header = {
      svg: Sprite.remove,
      isCollapse: false
    }
    $scope.$watch('header.isCollapse', function(newValue, oldValue, scope){
      if(newValue){
        scope.header.svg = Sprite.add;
      } else {
        scope.header.svg = Sprite.remove;
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
          item.svg = Sprite.add;
        } else {
          item.svg = Sprite.remove;
        }
      })
    }, true);
    $scope.whatSvg = Sprite.right;
    /**
     * pdtCard
     */
    var imgSrc = require('../img/banner1.jpg');
    $scope.pdtCard = {
      imgSrc : imgSrc,
      title: '雷克照明MR16射灯',
      desc: '雷克照明MR16射灯雷克照明MR16射灯雷克照明MR16射灯',
      icon: {
        favoriteUrl: Sprite.favorite,
        shareUrl : Sprite.share
      }
    }
  }
]

module.exports = CustomNavCtrl;
