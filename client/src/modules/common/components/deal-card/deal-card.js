'use strict';

/**
 *
 */

angular.module('gb.component')
  .directive('dealCard', function(){
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template:
      '<md-card flex="30" class="card deal-card">\
         <img ng-src="{{deal.imageSrc}}" class="card-image">\
         <div class="card-content" layout="column">\
          <div class="row" layout layout-align="space-around center">\
            <span class="deal-title" flex="60">名称: {{deal.name}}</span>\
            <span class="deal-price" flex="30">单价: {{deal.price}}元</span>\
          </div>\
          <md-card-actions layout="row" layout layout-align="space-around center">\
            <span class="deal-desc" flex="60">&nbsp;&nbsp;&nbsp;&nbsp;{{deal.desc}}</span>\
            <md-button class="md-raised md-warn" flex="40" ui-sref="custom.part({modoelId: deal.id})">立即定制</md-button>\
          </md-card-actions>\
         </div>\
      </md-card>',
    }
  })
