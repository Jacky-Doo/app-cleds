'use strict';

var lazyLoadModule = require('../util/lazyLoad.js').lazyLoadModule;

angular.module('app', ['ui.router', 'oc.lazyLoad']);
angular.module('app')
  .config(function($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider
      .state('home', {
        url: '/home',
        template: require('../modules/home/template/home.html'),
        resolve: lazyLoadModule('home/home.js')
      })
      .state('biz1', {
        url: '/biz1',
        template: require('../modules/biz1/template/biz1.html'),
        resolve: lazyLoadModule('biz1/biz1.js')
      })

    $urlRouterProvider.otherwise('home');
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
  })

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app'], {

  });
});



