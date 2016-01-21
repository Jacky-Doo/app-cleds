'use strict';

require('../modules/common/common.js');

angular.module('app', ['ui.router', 'oc.lazyLoad', 'ngMaterial', 'gb.component', 'common']);
angular.module('app')
  .config(['$rootScopeProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider','$mdThemingProvider',
    function($rootScopeProvider, $stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
      $stateProvider
        .state('custom', {
          url: '/custom',
          template: require('../modules/custom/template/index.html'),
          resolve: {
            foo1: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var mod = require('../modules/custom/index.js');
                $ocLazyLoad.load({
                  name: 'custom',
                });
                deferred.resolve();
              });
              return deferred.promise;
            }]
          }
        })
        .state('knowledge', {
          url: '/knowledge',
          template: require('../modules/knowledge/template/index.html'),
          resolve: {
            foo2: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var mod = require('../modules/knowledge/index.js');
                $ocLazyLoad.load({
                  name: mod.name,
                });
                deferred.resolve();
              });
              return deferred.promise;
            }]
          }
        })
        .state('3dprint', {
          url: '/3dprint',
          template: require('../modules/3dprint/template/3dprint.html'),
          resolve: {
            foo3: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var mod = require('../modules/3dprint/index.js');
                $ocLazyLoad.load({
                  name: mod.name,
                });
                deferred.resolve();
              });
              return deferred.promise;
            }]
          }
        })
        .state('screen', {
          url: '/screen',
          template: require('../modules/screen/template/screen.html'),
          resolve: {
            foo4: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var mod = require('../modules/screen/screen.js');
                $ocLazyLoad.load({
                  name: mod.name,
                });
                deferred.resolve();
              });
              return deferred.promise;
            }]
          }
        })

      $urlRouterProvider.otherwise('custom');
      $locationProvider.html5Mode(false);
      $locationProvider.hashPrefix('!');
      $rootScopeProvider.digestTtl(15);

      $mdThemingProvider.theme('default')
        //.primaryPalette('pink')
        //.accentPalette('orange');
    }
  ])
  .factory('Sprite', function(){
    return require('../modules/common/service/sprite.js');
  })
  .factory('Constant', function(){
    return require('../modules/common/service/constant.js');
  })

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app'], {

  });
});



