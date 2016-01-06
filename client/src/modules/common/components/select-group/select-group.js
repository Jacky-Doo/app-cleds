'use strict';

angular.module('gb.component')
  .directive('selectGroup', function(){
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        selectedValue: '='
      },
      template: '<div ng-transclude></div>',
      controller: ['$scope', function($scope){
        $scope.items = [];
        this.addItem = function(item){
          $scope.items.push(item);
          if(item.isSelected){
            $scope.selectedValue = item.value;
          }
        }
        var restAll = function(){
          $scope.items.forEach(function(item){
            item.isSelected = false;
          });
        }
        this.switch = function(item){
          $scope.selectedValue = item.value;
          restAll();
          item.isSelected = true;
          $scope.$apply();
        }
      }]
    }
  })
  .directive('selectItem', function(){
    return {
      require: '^selectGroup',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        value: '@',
        isSelected: '='
      },
      template: '<div ng-transclude ng-class="{selected: isSelected}"></div>',
      link: function(scope, element, attr, groupCtrl){
        if(!scope.isSelected){
          scope.isSelected = false;
        }
        groupCtrl.addItem(scope);
        element.bind('click', function(){
          groupCtrl.switch(scope);
        });
      }
    }
  })
