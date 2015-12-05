'use strict';

var screenNavCtrl = ['$scope', 'Sprite',
  function($scope, Sprite){
    $scope.v = 'nihao';
    $scope.screen = {};
    var screen = $scope.screen;

    screen.site = {
      value: 0,
      name: ''
    };
    screen.sites = [
      {'name': '室内', 'value': 0},
      {'name': '室外', 'value': 1}
    ];
    $scope.$watch('screen.site.value', function(newValue, oldValue, scope){
      screen.sites.forEach(function(item){
        if(item.value == screen.site.value){
          screen.site.name = item.name;
        }
      })
    });
    /**
     * $scope.screen.kind && $scope.screen.kinds
     */
    screen.kind = {
      value: 0,
      name: '',
      isCollapse: false,
      svg: Sprite.remove
    }
    screen.kinds = [
      {'name': '筒灯', 'value': 0},
      {'name': '球泡灯', 'value': 1},
      {'name': '栅格灯', 'value': 2},
    ]
    $scope.$watch('screen.kind.isCollapse', function(newValue, oldValue, scope){
      if(newValue){
        scope.screen.kind.svg = Sprite.add;
      } else {
        scope.screen.kind.svg = Sprite.remove;
      }
    });
    $scope.$watch('screen.kind.value', function(newValue, oldValue, scope){
      screen.kinds.forEach(function(item){
        if(item.value == screen.kind.value){
          screen.kind.name = item.name;
        }
      })
    });
    /**
     * $scope.screen.color && $scope.screen.colors
     */
    screen.color = {
      value: 0,
      isCollapse: false,
      svg: Sprite.remove
    };
    screen.colors = [
      {'name': 'className1', value: 0},
      {'name': 'className2', value: 1},
      {'name': 'className2', value: 2},
      {'name': 'className2', value: 3},
      {'name': 'className2', value: 4},
      {'name': 'className2', value: 2},
      {'name': 'className2', value: 3},
      {'name': 'className2', value: 4},
    ];
    $scope.$watch('screen.color.isCollapse', function(newValue, oldValue, scope){
      if(newValue){
        scope.screen.color.svg = Sprite.add;
      } else {
        scope.screen.color.svg = Sprite.remove;
      }
    });
    $scope.$watch('screen.color.value', function(newValue, oldValue, scope){
      screen.colors.forEach(function(item){
        if(item.value == screen.color.value){
          screen.color.name = item.name;
        }
      })
    });
    /**
     * $scope.screen.power && $scope.screen.powers
     */
    screen.power = {
      value: 0,
      isCollapse: false,
      svg: Sprite.remove
    };
    screen.powers =[
      {'name': '1W~3W', value: 0},
      {'name': '3W~5W', value: 1},
      {'name': '5W~10W', value: 2},
      {'name': '10W~20W', value: 3},
      {'name': '20W~50W', value: 4},
      {'name': '50W以上', value: 5}
    ]
    $scope.$watch('screen.power.isCollapse', function(newValue, oldValue, scope){
      if(newValue){
        scope.screen.power.svg = Sprite.add;
      } else {
        scope.screen.power.svg = Sprite.remove;
      }
    });
    $scope.$watch('screen.power.value', function(newValue, oldValue, scope){
      screen.powers.forEach(function(item){
        if(item.value == screen.power.value){
          screen.power.name = item.name;
        }
      })
    });
    /**
     * $scope.screen.price && $scope.screen.prices
     */
    screen.price = {
      value: 0,
      isCollapse: false,
      svg: Sprite.remove
    };
    screen.prices =[
      {'name': '50元以下', value: 0},
      {'name': '50~100元', value: 1},
      {'name': '100～200元', value: 2},
      {'name': '200元以上', value: 3}
    ]
    $scope.$watch('screen.price.isCollapse', function(newValue, oldValue, scope){
      if(newValue){
        scope.screen.price.svg = Sprite.add;
      } else {
        scope.screen.price.svg = Sprite.remove;
      }
    });
    $scope.$watch('screen.price.value', function(newValue, oldValue, scope){
      screen.prices.forEach(function(item){
        if(item.value == screen.price.value){
          screen.price.name = item.name;
        }
      })
    });
  }
]

module.exports = screenNavCtrl;
