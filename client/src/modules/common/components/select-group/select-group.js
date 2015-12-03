'use strict';
/**
 *
 */

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
        this.switch = function(item){
          $scope.selectedValue = item.value;
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
        value: '@'
      },
      template: '<div ng-transclude></div>',
      link: function(scope, element, attr, groupCtrl){
        element.bind('click', function(){
          groupCtrl.switch(scope);
        });
      }
    }
  })
