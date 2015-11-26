'use strict';


//var lazyLoadModule = require('../util/lazyLoad.js').lazyLoadModule;
require('../modules/common/template/header.html');
require('../modules/home/template/home.html');

angular.module('app', ['ui.router', 'oc.lazyLoad', 'ngMaterial']);
angular.module('app')
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$mdThemingProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'homeTpl',
          controller: 'HomeController',
          resolve: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
            var deferred = $q.defer();
            require.ensure([], function (require) {
              var mod = require('../modules/home/home.js');
              $ocLazyLoad.load({
                name: mod.name,
              });
              deferred.resolve();
            });
            return deferred.promise;
          }]
        })
        //.state('biz1', {
        //  url: '/biz1',
        //  template: require('../modules/biz1/template/biz1.html'),
        //  resolve: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad){
        //    var deferred = $q.defer();
        //    require.ensure([], function (require) {
        //      var mod = require('../modules/biz1/biz1.js');
        //      $ocLazyLoad.load({
        //        name: mod.name,
        //      });
        //      deferred.resolve();
        //    });
        //    return deferred.promise;
        //  }]
        //})

      $urlRouterProvider.otherwise('home');
      $locationProvider.html5Mode(false);
      $locationProvider.hashPrefix('!');

      $mdThemingProvider.theme('default')
        //.primaryPalette('pink')
        //.accentPalette('orange');
    }
  ]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app'], {

  });
});



