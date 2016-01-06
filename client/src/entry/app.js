'use strict';

//var lazyLoadModule = require('../util/lazyLoad.js').lazyLoadModule;
require('../modules/common/common.js');
//var mod = require('../modules/home/home.js');

angular.module('app', ['ui.router', 'oc.lazyLoad', 'ngMaterial', 'gb.component', 'common']);
angular.module('app')
  .config(['$rootScopeProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider','$mdThemingProvider',
    function($rootScopeProvider, $stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
      $stateProvider
        //.state('home', {
        //  url: '/home',
        //  template: '<div>template</div>'
        //})
        .state('home', {
          url: '/home',
          template: require('../modules/home/template/home.html'),
          controller: 'HomeCtrl',
          resolve: {
            foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
              var deferred = $q.defer();
              require.ensure(['../modules/home/home.js'], function (require) {
                var mod = require('../modules/home/home.js');
                $ocLazyLoad.load({
                  name: 'home',
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
            foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
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
        .state('knowledge', {
          url: '/knowledge',
          template: require('../modules/knowledge/template/knowledge.html'),
          resolve: {
            foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
              var deferred = $q.defer();
              require.ensure([], function (require) {
                var mod = require('../modules/knowledge/knowledge.js');
                $ocLazyLoad.load({
                  name: mod.name,
                });
                deferred.resolve();
              });
              return deferred.promise;
            }]
          }
        })

      $urlRouterProvider.otherwise('home');
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



