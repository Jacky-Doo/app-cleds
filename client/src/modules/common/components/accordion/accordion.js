'use strict';

/**
 * @问题记录：指令之间的传递，采用父指令操作子指令作用域的方式；
 * 分别由setContent()和addItem()两个方法实现将子指令作用域传递给父指令作用域；
 * 这样子指令可以调用父指令的controller中接口实现指令之间操作；
 * @使用：两种模式一种是包含<accordion>指令，此时只有一个<accordion-item>可以打开；
 * 另一种是不包含<accordion>指令，此时所有<accordion-item>之间没有关系；
 */

module.exports = angular.module('gb.component')
  .directive('accordion', function(){
    return {
      restrict: 'E',
      scope: {},
      transclude: true,
      repalce: true,
      template: '<div class="accordion" ng-transclude></div>',
      controller: ['$scope', function($scope){
        $scope.items = [];
        this.addItem = function(item){
          $scope.items.push(item);
        }
        this.resetAll = function(){
          $scope.items.forEach(function(item){
            item.content.isCollapse = true;
            item.isCollapse = true; //更新<accordion-item>指令上的isCollapse，暴露给外部控制器
          });
        }
      }]
    }
  })
  .directive('accordionItem', function(){
    return {
      require: '^?accordion',
      restrict: 'E',
      repalce: true,
      scope: {
        isCollapse: '='
      },
      transclude: true,
      template: '<div class="accordion-item" ng-transclude></div>',
      link: function(scope, element, attr, accordionCtrl){
        if(scope.isCollapse == 'false'){
          scope.isCollapse == false;
        } else {
          scope.isCollapse == true;
        }
        if(accordionCtrl){
          accordionCtrl.addItem(scope);
        }
      },
      controller: ['$scope', function($scope){
        this.setContent = function(content){
          $scope.content = content;
          $scope.content.isCollapse = $scope.isCollapse;
        }
        this.switch = function(){
          $scope.content.isCollapse = isCollapse;
          $scope.isCollapse = isCollapse; //更新<accordion-item>指令上的isCollapse，暴露给外部控制器
          $scope.$apply();
        }
        var isCollapse;
        this.setIsCollapse = function(){
          isCollapse = !$scope.content.isCollapse;
        }
      }]
    }
  })
  .directive('accordionTitle', function(){
    return {
      require: ['^accordionItem', '^?accordion'],
      restrict: 'E',
      repalce: true,
      scope: {},
      transclude: true,
      template: '<div class="accordion-title" ng-transclude></div>',
      link: function(scope, element, attr, ctrls){
        var itemCtrl = ctrls[0];
        var accordionCtrl = ctrls[1];
        element.bind('click', function(){
          itemCtrl.setIsCollapse();
          if(accordionCtrl){
            accordionCtrl.resetAll();
          }
          itemCtrl.switch();
        })
      }
    }
  })
  .directive('accordionContent', function(){
    return {
      require: '^accordionItem',
      restrict: 'E',
      repalce: true,
      scope: {},
      transclude: true,
      template: '<div class="accordion-content" ng-hide="isCollapse"><div ng-transclude></div></div>',
      link: function(scope, element, attr, itemCtrl){
        itemCtrl.setContent(scope);
      }
    }
  })

