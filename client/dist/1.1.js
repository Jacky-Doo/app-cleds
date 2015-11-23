webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./biz1/biz1": 3,
		"./biz1/biz1.js": 3,
		"./biz1/controller/biz1.controller": 4,
		"./biz1/controller/biz1.controller.js": 4,
		"./biz1/template/biz1.html": 5,
		"./home/home": 6,
		"./home/home.js": 6,
		"./home/template/home.html": 7
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 2;


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';


	angular.module('biz1', []);

	angular.module('biz1')
	  .config(function($stateProvider){
	    $stateProvider
	      .state('biz1.main', {
	        url: '/main',
	        template: '<p>bizq.main</p>'
	      })
	  })

	module.exports = angular.module('biz1');

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';



/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	'use strict';


/***/ }
]);