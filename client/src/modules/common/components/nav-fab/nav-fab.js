'use strict';

/**
 *
 */

angular.module('gb.component')
  .directive('navFab', function(){
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template:
      '<section class="nav-fab" layout="row" layout-align="center center">\
        <md-fab-speed-dial md-open="isOpen" md-direction="up" class="md-scale">\
          <md-fab-trigger>\
            <md-button aria-label="menu" class="md-fab md-warn">\
              <svg-icon svg-id="{{Sprite.menu}}" class="menu"></svg-icon>\
            </md-button>\
          </md-fab-trigger>\
          <md-fab-actions>\
            <a aria-label="3dprint" class="md-button md-fab md-raised md-mini" ui-sref="3dprint" aria-label="a">\
              <svg-icon svg-id="{{Sprite.setting}}" class="item"></svg-icon>\
            </a>\
            <a aria-label="home" class="md-button md-fab md-raised md-mini" ng-href="//www.cleds.cn" aria-label="a">\
              <svg-icon svg-id="{{Sprite.home}}" class="item"></svg-icon>\
            </a>\
            <a aria-label="" class="md-button md-fab md-raised md-mini" ui-sref="home" aria-label="a">\
              <svg-icon svg-id="{{Sprite.shopping}}" class="item"></svg-icon>\
            </a>\
          </md-fab-actions>\
        </md-fab-speed-dial>\
      </section>',
    }
  })
