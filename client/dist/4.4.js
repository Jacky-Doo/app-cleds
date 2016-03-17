webpackJsonp([4],{

/***/ 104:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 样式
	 */
	__webpack_require__(105);
	/**
	 * 模板
	 */

	/**
	 * 控制器
	 */
	var screenCtrl = __webpack_require__(107);
	var screenNavCtrl = __webpack_require__(108);

	angular.module('screen', ['ngMaterial']);

	angular.module('screen')
	  .controller('screenCtrl', screenCtrl)
	  .controller('screenNavCtrl', screenNavCtrl)

	module.exports = angular.module('screen');

/***/ },

/***/ 105:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(106);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(13)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./../../../../../node_modules/less-loader/index.js!./screen.less", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./../../../../../node_modules/less-loader/index.js!./screen.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 106:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, ".screen-tpl .screen-nav {\n  margin: 50px 0 50px 30px;\n  font-size: 12px;\n  color: #858585;\n  max-width: 230px;\n}\n.screen-tpl .screen-nav .title {\n  padding-left: 8px;\n  font-size: 16px;\n  color: #333;\n}\n.screen-tpl .screen-nav .kinds md-input-container {\n  padding-bottom: 0;\n}\n.screen-tpl .screen-nav .kinds md-input-container md-select-value {\n  font-size: 24px;\n  text-align: center;\n  color: #333;\n}\n.screen-tpl .screen-nav .colors button {\n  margin: 4px 6px;\n}\n.screen-tpl .screen-nav .powers button {\n  margin: 0 8px;\n}\n.screen-tpl .content .info {\n  margin: 50px 0 5px 100px;\n}\n.screen-tpl .content .info .title {\n  font-size: 26px;\n  color: #333;\n}\n.screen-tpl .content .info .title .params {\n  text-decoration: underline;\n  color: green;\n}\n.slected {\n  background: yellow !important;\n  border: yellow !important;\n}\n", ""]);

	// exports


/***/ },

/***/ 107:
/***/ function(module, exports) {

	'use strict';

	module.exports = ['$scope',
	  function($scope){

	  }
	]


/***/ },

/***/ 108:
/***/ function(module, exports) {

	'use strict';

	var screenNavCtrl = ['$scope', 'Sprite',
	  function($scope, Sprite){
	    $scope.v = 'nihao';
	    $scope.screen = {};
	    var screen = $scope.screen;

	    screen.site = {
	      value: 0,
	      name: ''
	    };
	    screen.sites = [
	      {'name': '室内', 'value': 0},
	      {'name': '室外', 'value': 1}
	    ];
	    $scope.$watch('screen.site.value', function(newValue, oldValue, scope){
	      screen.sites.forEach(function(item){
	        if(item.value == screen.site.value){
	          screen.site.name = item.name;
	        }
	      })
	    });
	    /**
	     * $scope.screen.kind && $scope.screen.kinds
	     */
	    screen.kind = {
	      value: 0,
	      name: '',
	      isCollapse: false,
	      svg: Sprite.remove
	    }
	    screen.kinds = [
	      {'name': '筒灯', 'value': 0},
	      {'name': '球泡灯', 'value': 1},
	      {'name': '栅格灯', 'value': 2},
	    ]
	    $scope.$watch('screen.kind.isCollapse', function(newValue, oldValue, scope){
	      if(newValue){
	        scope.screen.kind.svg = Sprite.add;
	      } else {
	        scope.screen.kind.svg = Sprite.remove;
	      }
	    });
	    $scope.$watch('screen.kind.value', function(newValue, oldValue, scope){
	      screen.kinds.forEach(function(item){
	        if(item.value == screen.kind.value){
	          screen.kind.name = item.name;
	        }
	      })
	    });
	    /**
	     * $scope.screen.color && $scope.screen.colors
	     */
	    screen.color = {
	      value: 0,
	      isCollapse: false,
	      svg: Sprite.remove
	    };
	    screen.colors = [
	      {'name': 'className1', value: 0},
	      {'name': 'className2', value: 1},
	      {'name': 'className2', value: 2},
	      {'name': 'className2', value: 3},
	      {'name': 'className2', value: 4},
	      {'name': 'className2', value: 2},
	      {'name': 'className2', value: 3},
	      {'name': 'className2', value: 4},
	    ];
	    $scope.$watch('screen.color.isCollapse', function(newValue, oldValue, scope){
	      if(newValue){
	        scope.screen.color.svg = Sprite.add;
	      } else {
	        scope.screen.color.svg = Sprite.remove;
	      }
	    });
	    $scope.$watch('screen.color.value', function(newValue, oldValue, scope){
	      screen.colors.forEach(function(item){
	        if(item.value == screen.color.value){
	          screen.color.name = item.name;
	        }
	      })
	    });
	    /**
	     * $scope.screen.power && $scope.screen.powers
	     */
	    screen.power = {
	      value: 0,
	      isCollapse: false,
	      svg: Sprite.remove
	    };
	    screen.powers =[
	      {'name': '1W~3W', value: 0},
	      {'name': '3W~5W', value: 1},
	      {'name': '5W~10W', value: 2},
	      {'name': '10W~20W', value: 3},
	      {'name': '20W~50W', value: 4},
	      {'name': '50W以上', value: 5}
	    ]
	    $scope.$watch('screen.power.isCollapse', function(newValue, oldValue, scope){
	      if(newValue){
	        scope.screen.power.svg = Sprite.add;
	      } else {
	        scope.screen.power.svg = Sprite.remove;
	      }
	    });
	    $scope.$watch('screen.power.value', function(newValue, oldValue, scope){
	      screen.powers.forEach(function(item){
	        if(item.value == screen.power.value){
	          screen.power.name = item.name;
	        }
	      })
	    });
	    /**
	     * $scope.screen.price && $scope.screen.prices
	     */
	    screen.price = {
	      value: 0,
	      isCollapse: false,
	      svg: Sprite.remove
	    };
	    screen.prices =[
	      {'name': '50元以下', value: 0},
	      {'name': '50~100元', value: 1},
	      {'name': '100～200元', value: 2},
	      {'name': '200元以上', value: 3}
	    ]
	    $scope.$watch('screen.price.isCollapse', function(newValue, oldValue, scope){
	      if(newValue){
	        scope.screen.price.svg = Sprite.add;
	      } else {
	        scope.screen.price.svg = Sprite.remove;
	      }
	    });
	    $scope.$watch('screen.price.value', function(newValue, oldValue, scope){
	      screen.prices.forEach(function(item){
	        if(item.value == screen.price.value){
	          screen.price.name = item.name;
	        }
	      })
	    });
	  }
	]

	module.exports = screenNavCtrl;


/***/ }

});