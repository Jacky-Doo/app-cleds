/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);

/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		0:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	//var lazyLoadModule = require('../util/lazyLoad.js').lazyLoadModule;
	__webpack_require__(3);
	__webpack_require__(4);

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
	            __webpack_require__.e/* nsure */(1, function (require) {
	              var mod = __webpack_require__(5);
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





/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	var v1="<nav class=\"clearfix\">\n    <div layout=\"row\" class=\"nav-left-block\">\n      <md-button flex class=\"nav-item md-btn-full\" ng-href=\"//www.baidu.com\">Cleds</md-button>\n      <md-button flex class=\"nav-item md-btn-full\" ng-href=\"//www.baidu.com\">知识库</md-button>\n      <md-button flex class=\"nav-item md-btn-full\" ng-href=\"//www.baidu.com\">3D打印</md-button>\n      <md-button flex class=\"nav-item md-btn-full\" ng-href=\"//www.baidu.com\">专属定制</md-button>\n    </div>\n    <div layout=\"row\" class=\"nav-right-block\">\n      <md-button flex class=\"nav-item md-btn-full\" ng-href=\"//www.baidu.com\">加入/登陆</md-button>\n      <md-button flex class=\"nav-item md-btn-full\" ng-href=\"//www.baidu.com\">意见反馈</md-button>\n      <md-button flex class=\"nav-item md-btn-full\" ng-href=\"//www.baidu.com\">帮助</md-button>\n    </div>\n  </nav>\n  <div layout=\"row\" class=\"nav-title\">\n    <div flex=\"25\" class=\"nav-title-left\"></div>\n    <div flex=\"50\" class=\"nav-title-center md-display-1\">LED照明产品专属定制</div>\n    <div flex=\"25\" class=\"nav-title=right\">\n      <div class=\"search-container\">\n        <input type=\"text\" class=\"search\" placeholder=\"搜索\"/>\n        <span></span>\n      </div>\n    </div>\n  </div>";
	window.angular.module(["ng"]).run(["$templateCache",function(c){c.put("header", v1)}]);
	module.exports=v1;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var v1="<div class=\"home-tpl\">\n    <section class=\"banner\"></section>\n    <section class=\"custom-nav\" ng-controller=\"CustomNavController\">\n      <header>\n        <md-button class=\"md-btn-full btn-right custom-btn\" ng-click=\"header.switch()\">\n          专属定制\n          <md-icon md-svg-src=\"{{header.svgSrc}}\" class=\"btn-right-icon custom-btn-icon\"></md-icon>\n        </md-button>\n      </header>\n      <div class=\"custom-nav-content\" ng-show=\"content.isShow\">\n        <section ng-repeat=\"item in content.items\">\n          <md-divider class=\"divider\"></md-divider>\n          <md-button class=\"md-btn-full btn-right\" ng-click=\"content.switch($index)\">\n            {{item.title}}\n            <md-icon md-svg-src=\"{{item.svgSrc}}\" class=\"btn-right-icon\"></md-icon>\n          </md-button>\n          <ul ng-show=\"item.isShow\">\n            <li ng-repeat=\"option in item.options\">\n              <md-button class=\"item-btn md-btn-full\">\n                {{option}}\n              </md-button>\n            </li>\n          </ul>\n        </section>\n        <md-divider class=\"divider\"></md-divider>\n        <div>\n          <md-button class=\"md-btn-full btn-right\">\n            什么是专属定制\n            <md-icon md-svg-src=\"{{whatSvgSrc}}\" class=\"btn-right-icon\"></md-icon>\n          </md-button>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"cst-container\">\n\n    </section>\n\n    <section class=\"desc\">\n      <div>\n        <h2>自由打造专属设计</h2>\n        <h1>Cleds制造</h1>\n        <p>Cleds这项服务让你能够按照心中所想,</p>\n        <p>精确定制你的专属LED照明产品。添加你的个性元素,从零设计,或优化你的</p>\n        <p>性能配置,丰富可能任你发掘。释放你的创意,</p>\n        <p>发掘Cleds卓越的个性化服务。</p>\n      </div>\n    </section>\n  </div>";
	window.angular.module(["ng"]).run(["$templateCache",function(c){c.put("homeTpl", v1)}]);
	module.exports=v1;

/***/ }
/******/ ]);