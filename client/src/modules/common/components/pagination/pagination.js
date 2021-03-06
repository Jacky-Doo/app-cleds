'use strict';

angular.module('gb.component')
  .directive('pagination', function (){
    return {
      restrict: 'EA',
      scope: {
        total: '=',
        position: '@',
        gotoPage: '&',
        step: '=',
        currentPage: '='
      },
      controller: ['$scope', Controller],
      controllerAs: 'vm',
      template: [
        '<div layout="row" class="wan-material-paging" layout-align="{{ position }}">',
        '<md-button class="md-raised md-primary wmp-button" ng-click="vm.gotoFirst()">{{ vm.first }}</md-button>',
        '<md-button class="md-raised wmp-button" ng-click="vm.getoPre()" ng-show="vm.index - 1 >= 0">...</md-button>',
        '<md-button class="md-raised wmp-button" ng-repeat="i in vm.stepInfo"',
        ' ng-click="vm.goto(vm.index + i)" ng-show="vm.page[vm.index + i]" ',
        ' ng-class="{true: \'md-primary\', false: \'\'}[vm.page[vm.index + i] === currentPage]">',
        ' {{ vm.page[vm.index + i] }}',
        '</md-button>',
        '<md-button class="md-raised wmp-button" ng-click="vm.getoNext()" ng-show="vm.index + vm.step < total">...</md-button>',
        '<md-button class="md-raised md-primary wmp-button" ng-click="vm.gotoLast()">{{ vm.last }}</md-button>',
        '</div>'
      ].join('')
    };
  });

/**
 * @ngInject
 */
function Controller($scope) {
  var vm = this;

  vm.first = '<<';
  vm.last = '>>';
  vm.index = 0;
  vm.step = $scope.step;

  vm.goto = function(index) {
    $scope.currentPage = vm.page[index];
  };

  vm.getoPre = function(){
    $scope.currentPage = vm.index;
    vm.index -= vm.step;
  };

  vm.getoNext = function(){
    vm.index += vm.step;
    $scope.currentPage = vm.index + 1;
  };

  vm.gotoFirst = function(){
    vm.index = 0;
    $scope.currentPage = 1;
  };

  vm.gotoLast = function(){
    vm.index = parseInt($scope.total / vm.step) * vm.step;
    vm.index === $scope.total ? vm.index = vm.index - vm.step : '';
    $scope.currentPage = $scope.total;
  };

  $scope.$watch('currentPage', function() {
    $scope.gotoPage();
  });

  $scope.$watch('total', function() {
    vm.init();
  });

  vm.init = function() {
    vm.stepInfo = (function() {
      var i, result = [];
      for (i = 0; i < vm.step; i++) {
        result.push(i)
      }
      return result;
    })();

    vm.page = (function() {
      var i, result = [];
      for (i = 1; i <= $scope.total; i++) {
        result.push(i);
      }
      return result;
    })();

  };
}
