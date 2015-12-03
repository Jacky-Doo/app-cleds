'use strict';

/**
 * 该指令根据提供的svgId获取对应的symbol，并解析svgId设置对应的class
 */

angular.module('gb.component')
  .directive('svgIcon', function(){
    return {
      restrict: 'E',
      replace: true,
      scope: {
        svgId: '@'
      },
      template: '<svg class="{{className}}"><use xlink:href="{{svgId}}"></use></svg>',
      link: function(scope){
        scope.className = scope.svgId.slice((scope.svgId.indexOf('#') + 1));
      }
    }
  })
