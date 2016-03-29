webpackJsonp([1],Array(54).concat([
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 样式
	 */
	__webpack_require__(55);
	/**
	 * 控制器
	 */
	var customNavCtrl = __webpack_require__(59);
	var indexCtrl = __webpack_require__(61);
	var homeCtrl = __webpack_require__(62);
	var cPartCtrl = __webpack_require__(63);
	/**
	 * 数据模型
	 */
	var kTypeModel = __webpack_require__(64);
	var dcModel = __webpack_require__(65);
	var partTypeModel = __webpack_require__(66);
	var partModel = __webpack_require__(67);
	var modelModel = __webpack_require__(68);
	var modelAttrModel = __webpack_require__(69);
	var lightTypeModel = __webpack_require__(70);
	var lightColorModel = __webpack_require__(71);
	var lightMaterialModel = __webpack_require__(72);
	/**
	 * 过滤器
	 */
	var kTypeFilter = __webpack_require__(73);
	var fileSizeFilter = __webpack_require__(74);
	var partNameFilter = __webpack_require__(75);
	var partFilter = __webpack_require__(76);
	var modelAttrFilter = __webpack_require__(77);
	var selectedPartFilter = __webpack_require__(78);

	angular.module('custom', ['ngMaterial', 'ngResource']);

	angular.module('custom')
	  .run(['$templateCache', function($templateCache) {
	    $templateCache.put('homeTpl', __webpack_require__(79));
	    $templateCache.put('cPartTpl', __webpack_require__(80));
	  }])
	  .config(['$stateProvider',
	    function($stateProvider){
	      $stateProvider
	        .state('custom.home', {
	          url: '/home',
	          templateUrl: 'homeTpl',
	          controller: homeCtrl
	        })
	        .state('custom.part', {
	          url: '/part/:modelId',
	          templateUrl: 'cPartTpl',
	          controller: cPartCtrl
	        })
	    }
	  ])
	  .controller('indexCustomCtrl', indexCtrl)
	  .controller('homeCtrl', homeCtrl)
	  .controller('cPartCtrl', cPartCtrl)
	  .controller('CustomNavCtrl', customNavCtrl)
	  .factory('kTypeModel', kTypeModel)
	  .factory('dcModel', dcModel)
	  .factory('partTypeModel', partTypeModel)
	  .factory('partModel', partModel)
	  .factory('modelModel', modelModel)
	  .factory('lightTypeModel', lightTypeModel)
	  .factory('lightColorModel', lightColorModel)
	  .factory('lightMaterialModel', lightMaterialModel)
	  .factory('modelAttrModel', modelAttrModel)
	  .filter('kTypeFilter', kTypeFilter)
	  .filter('fileSizeFilter', fileSizeFilter)
	  .filter('partNameFilter', partNameFilter)
	  .filter('partFilter', partFilter)
	  .filter('modelAttrFilter', modelAttrFilter)
	  .filter('selectedPartFilter', selectedPartFilter)

	module.exports = angular.module('custom');

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(56);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(13)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./../../../../../node_modules/less-loader/index.js!./index.less", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./../../../../../node_modules/less-loader/index.js!./index.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "* {\n  padding: 0;\n  margin: 0;\n  border: 0;\n  outline: 0;\n}\nli {\n  list-style: none;\n}\nbody {\n  min-width: 1200px;\n}\n.clearfix::after {\n  content: '.';\n  display: block;\n  visibility: hidden;\n  height: 0;\n  clear: both;\n}\n.btn-reset {\n  margin: 0;\n  padding: 0;\n  border-radius: 0;\n}\n.btn-full {\n  margin: 0;\n  padding: 0;\n  border-radius: 0;\n  width: 100%;\n}\n.btn-right {\n  text-align: left;\n  padding-right: 10px;\n}\n.btn-right .btn-right-icon {\n  position: relative;\n  top: 10px;\n  float: right;\n  width: 16px;\n  height: 16px;\n}\n.card .card-content {\n  padding: 5px;\n}\n.card .card-title {\n  font-size: 17px;\n  line-height: 25px;\n}\n.card .card-desc {\n  font-size: 14px;\n  line-height: 16px;\n}\n.groupX {\n  font-size: 12px;\n  margin: 20px 0;\n  background-color: #fff;\n  text-transform: none;\n  font-weight: 400;\n  border: 1px solid #106cc8;\n}\n.groupX.md-button {\n  min-width: 65px;\n}\n.groupX.md-button.left {\n  border-radius: 10px 0 0 10px;\n  border-right: none;\n}\n.groupX.md-button.middle {\n  border-radius: 0;\n  border-left: 1px solid #106cc8;\n  border-right: 1px solid #106cc8;\n}\n.groupX.md-button.right {\n  border-left: none;\n  border-radius: 0 10px 10px 0;\n}\n.groupX.md-button:not([disabled]):hover {\n  background-color: #106cc8;\n  color: #fff;\n  font-size: 14px;\n  -webkit-transition: 0.5s;\n  transition: 0.5s;\n}\n.c-part-tpl {\n  padding: 50px 0;\n}\n.c-part-tpl .content {\n  width: 900px;\n  margin: 0 auto;\n}\n.c-part-tpl .content .title {\n  font-size: 25px;\n  padding: 25px 0 15px 100px;\n}\n.c-part-tpl .content .parts {\n  width: 100%;\n  height: 100%;\n  height: 400px;\n}\n.c-part-tpl .content .parts canvas {\n  height: 500px;\n  width: 100%;\n}\n.c-part-tpl .content > div {\n  border: 1px solid #e5e5e5;\n}\n.c-part-tpl .content > div:last-child {\n  border-left: none;\n}\n.c-part-tpl .content .model-info {\n  padding: 3px 18px;\n}\n.c-part-tpl .content .model-info span {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n}\n.c-part-tpl .content .model-parts {\n  border-bottom: 1px solid #e5e5e5;\n}\n.c-part-tpl .content .model-parts .part-select {\n  height: 42px;\n  border-width: 1px 0;\n  border-style: solid;\n  border-color: #45F563;\n}\n.c-part-tpl .content .model-parts .part-select .tag {\n  margin-left: -45px;\n  background: rgba(55, 111, 208, 0.66);\n  border-radius: 8px 0 0 8px;\n}\n.c-part-tpl .content .model-parts .part-select .btn {\n  margin: 0;\n}\n.c-part-tpl .content .model-parts .part-select.active .tag {\n  background: #45F563;\n}\n.c-part-tpl .content .op .groupX.md-button.left {\n  border-right: 1px solid #106cc8;\n}\n.c-part-tpl .content .op .groupX.md-button {\n  width: 80px;\n  margin: 8px 0 0 0;\n}\n.c-part-tpl .content .op .c-btn {\n  margin: 10px 10px;\n  border-radius: 8px;\n  height: 40px;\n}\n.c-part-tpl .part-list {\n  overflow: scroll;\n  width: 900px;\n  margin: 20px auto;\n  padding: 0 15px;\n  border-width: 0 10px;\n  border-color: #3f51b5;\n  border-style: solid;\n  border-radius: 8px;\n  background: rgba(45, 44, 44, 0.13);\n}\n.c-part-tpl .part-list .part-item {\n  margin: 0 10px;\n  font-size: 12px;\n  text-align: center;\n  background: #fff;\n}\n.c-part-tpl .part-list .part-item.selected {\n  box-shadow: 0px 0px 16px #3f51b5;\n}\n.c-part-tpl .part-list .part-item .img {\n  display: block;\n  height: 100px;\n}\n.c-part-tpl .part-list .part-item .name {\n  height: 30px;\n  line-height: 30px;\n  color: #333;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n}\n.c-part-tpl .part-list .part-item .detail.md-button {\n  min-height: 20px;\n  line-height: 20px;\n  font-size: 12px;\n  margin: 0;\n  padding: 0;\n  color: #e5e5e5;\n}\n.c-part-tpl .part-info {\n  width: 900px;\n  margin: 0 auto;\n}\n.c-part-tpl .part-info .section-title {\n  width: 100%;\n  height: 40px;\n  background-color: rgba(38, 126, 213, 0.95);\n  border: 1px solid #267ED5;\n  border-radius: 4px 4px 0 0;\n}\n.c-part-tpl .part-info .section-title .md-button span {\n  padding-left: 20px;\n}\n.c-part-tpl .part-info .section-title .accordion-title {\n  line-height: 40px;\n  color: #fff;\n  font-size: 18px;\n}\n.c-part-tpl .part-info .section-content {\n  width: 100%;\n  border: 1px solid #267ED5;\n  border-radius: 0 0 4px 4px;\n}\n.home-tpl {\n  position: relative;\n}\n.home-tpl .banner {\n  width: 100%;\n  height: 450px;\n  background: url(" + __webpack_require__(57) + ") no-repeat;\n  background-size: 100% 100%;\n}\n.home-tpl .custom-nav {\n  position: absolute;\n  top: 60px;\n  left: 60px;\n  width: 200px;\n  border: 1px solid #e5e5e5;\n  padding: 25px 25px 0 25px;\n  background-color: #fff;\n  border-radius: 2px;\n}\n.home-tpl .custom-nav .header .custom-btn {\n  font-size: 25px;\n  margin-bottom: 13px;\n}\n.home-tpl .custom-nav .header .custom-btn .custom-btn-icon {\n  top: 10px;\n}\n.home-tpl .custom-nav .custom-nav-content {\n  padding-bottom: 10px;\n}\n.home-tpl .custom-nav .custom-nav-content .btn-full {\n  color: #333;\n  padding-left: 5px;\n  font-size: 14px;\n}\n.home-tpl .custom-nav .custom-nav-content .item-btn {\n  color: #858585;\n  text-align: left;\n  font-size: 12px;\n}\n.home-tpl .custom-nav .divider {\n  margin: 5px 0;\n}\n.home-tpl .cst-container {\n  width: 1050px;\n  margin: 20px auto;\n}\n.home-tpl .cst-container .cst-header {\n  text-align: center;\n}\n.home-tpl .cst-container .cst-header h1 {\n  font-family: OneNikeCurrency, 'TradeGothicW01-BoldCn20 675334', Helvetica, Arial;\n  font-size: 40px;\n  font-weight: normal;\n  letter-spacing: -0.72px;\n  margin-bottom: -1.9318px;\n  word-spacing: -0.8px;\n}\n.home-tpl .cst-container .cst-header p {\n  line-height: 24px;\n}\n.home-tpl .desc {\n  text-align: center;\n  background: url(" + __webpack_require__(58) + ") no-repeat;\n  background-size: 100% 100%;\n  width: 100%;\n  height: 250px;\n  color: #fff;\n}\n.home-tpl .desc > div {\n  height: 100%;\n  background: rgba(0, 0, 0, 0.7);\n}\n.home-tpl .desc h2 {\n  font-family: OneNikeCurrency, 'TradeGothicW01-BoldCn20 675334', Helvetica, Arial;\n  font-size: 50px;\n  font-weight: normal;\n  letter-spacing: -0.72px;\n  margin-bottom: -1.9318px;\n  word-spacing: -0.8px;\n}\n.home-tpl .desc h1 {\n  font-size: 60px;\n}\n.home-tpl .desc p {\n  line-height: 24px;\n}\n", ""]);

	// exports


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c22c9ed49f7ed2382c9be330fa86f660.jpg";

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "d3f9c2f4cf12fb2119bf83f46126a574.jpg";

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var CustomNavCtrl = ['$scope', 'Sprite', '$interval',
	  function($scope, Sprite, $interval){
	    /**
	     * $scope.header
	     */
	    $scope.header = {
	      svg: Sprite.remove,
	      isCollapse: false
	    }
	    $scope.$watch('header.isCollapse', function(newValue, oldValue, scope){
	      if(newValue){
	        scope.header.svg = Sprite.add;
	      } else {
	        scope.header.svg = Sprite.remove;
	      }
	    });
	    /**
	     * $scope.content
	     */
	    $scope.content = {};
	    $scope.content.items = [
	      {
	        title: '室内灯具',
	        options: ['筒灯', '球泡灯', '栅格灯'],
	        isCollapse: false
	      },
	      {
	        title: '室外灯具',
	        options: ['路灯', '太阳能路灯'],
	        isCollapse: true
	      }
	    ];
	    $scope.$watch('content.items', function(newValue, oldValue, scope){
	      scope.content.items.forEach(function(item){
	        if(item.isCollapse){
	          item.svg = Sprite.add;
	        } else {
	          item.svg = Sprite.remove;
	        }
	      })
	    }, true);
	    $scope.whatSvg = Sprite.right;
	    /**
	     * pdtCard
	     */
	    var imgSrc = __webpack_require__(60);
	    $scope.pdtCard = {
	      imgSrc : imgSrc,
	      title: '雷克照明MR16射灯',
	      desc: '雷克照明MR16射灯雷克照明MR16射灯雷克照明MR16射灯',
	      icon: {
	        favoriteUrl: Sprite.favorite,
	        shareUrl : Sprite.share
	      }
	    }
	  }
	]

	module.exports = CustomNavCtrl;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "09c880deffbcd16d57d012f8fdcca164.jpg";

/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['$scope', 'Sprite', 'modelModel', '$state', '$rootScope',
	  function($scope, Sprite, modelModel, $state, $rootScope){
	    $state.go('custom.home');
	  }
	]

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['$scope', 'Sprite', 'modelModel',
	  function($scope, Sprite, modelModel){
	    /**
	     * 定义对象
	     */
	    $scope.model = modelModel;
	    $scope.deals;
	    var Constant = {
	      pageSize: 20,
	    }
	    /**
	     * 定义函数
	     */
	    function getModels(pageId){
	      $scope.model.getModelDeals('any', pageId, Constant.pageSize).then(function(res){
	        if(res.code != 200) {
	          alert('没有相关文档');
	          return;
	        } else{
	          $scope.deals = res.data.modelDeals;
	          console.log($scope.deals);
	        }
	      });
	    }
	    /**
	     * 初始化
	     */
	    getModels(1);
	  }
	]


/***/ },
/* 63 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['$scope', 'Sprite', 'modelModel', 'partTypeModel', '$stateParams', '$resource', 'Constant',
	  function($scope, Sprite, modelModel, partTypeModel, $stateParams, $resource, Constant){
	    /**
	     * 定义对象
	     */
	    $scope.model; //实例对象，并不是modelModel
	    $scope.partTypes = angular.merge(partTypeModel);
	    //$scope.partTypes.shift();
	    $scope.partTypes.forEach(function(item){
	      item.active = false;
	    });
	    $scope.view = {
	      parts: [],  //当前类型的零部件对象列表
	      part: null, //需要展示详细信息的零部件对象
	      switchPart: switchPart,
	      showPartInfo: showPartInfo,
	      selectPart: selectPart,
	      modelType: '',
	      isShowList: false,
	      go: function(){
	        console.log($scope.model);
	        $scope.view.isShowList = true;
	      }
	    }
	    /**
	     * 定义函数
	     */
	    //切换零部件类型选择
	    function switchPart(partTypeId, index, partType){
	      $scope.view.isShowList = false;
	      $scope.view.parts = [];
	      var hasPartType = false; //标识有没有该类型零部件
	      if(partType){
	        hasPartType = true;
	      }
	      var hasSelected = false;
	      var partList = $scope.model.partList;
	      $scope.partTypes.forEach(function(item){
	        item.active = false;
	      });
	      $scope.partTypes[index].active = true;
	      partList.forEach(function(item){
	        if(item.typeId == partTypeId){
	          $scope.view.parts.push(item);
	          if(item.selected){
	            showPartInfo(item);
	            hasSelected = true;
	          }
	          hasPartType = true;
	        }
	      });
	      if(!hasPartType){
	        alert('该定制实例不需要此类型的零部件！');
	      }
	      if(!hasSelected){
	        selectPart(0);
	      }
	    }
	    //选择指定的零部件
	    function selectPart(index){
	      if($scope.view.parts && (index < $scope.view.parts.length)){
	        $scope.view.parts.forEach(function(item){
	          item.selected = false;
	        });
	        $scope.view.parts[index].selected = true;
	        showPartInfo($scope.view.parts[index]);
	      }
	    }
	    //显示零部件详细信息
	    function showPartInfo(part){
	      $scope.view.part = part;
	    }
	    /**
	     * 初始化
	     */
	    modelModel.getModel($stateParams.modelId).then(function(model){
	      $scope.model = model;
	      $scope.view.iframeSrc = '/f2e/html/three-viewer.html?modelSrc=' + model.modelSrc;
	      $scope.partTypes.forEach(function(partType){
	        switchPart(partType.id, 0, true);
	      })
	    });
	  }
	]


/***/ },
/* 64 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['$q', 'Constant', '$resource', function($q, Constant, $resource){

	  var kTypeRsc = $resource(Constant.baseUrl + '/knowledge/types');

	  var kTypeModel = {
	    item: {},
	    collection: [],
	    getTypes: function(){
	      var d = $q.defer();
	      kTypeRsc.get(function(res){
	        kTypeModel.collection = res.data.types;
	        d.resolve(res);
	      }, function(err){
	        d.reject(err);
	      });
	      return d.promise;
	    },
	    findTypeById: function(id){
	      for(var i = 0; i < this.collection.length; i++) {
	        if (id == this.collection[i].id) {
	          return this.collection[i];
	        }
	      }
	    }
	  };

	  return kTypeModel;
	}];


/***/ },
/* 65 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['$http', '$q', 'Constant', '$resource', function($http, $q, Constant, $resource){

	  var dcsRsc = $resource(
	    Constant.baseUrl + '/knowledge/dcs/:typeId',
	    {typeId: '@typeId'}
	  );
	  var dcRsc = $resource(
	    Constant.baseUrl + '/knowledge/dc/:id',
	    {typeId: '@id'}
	  );

	  var dcModel = {
	    item: {},
	    collection: [],
	    getDcs: function(typeId, pageId, pageSize){
	      var d = $q.defer();
	      dcsRsc.get({typeId: typeId, pageId: pageId, pageSize: pageSize}, function(res){
	        dcModel.collection = [];
	        if(res.code == 200 && res.data){
	          res.data.dcs.forEach(function(item){
	            dcModel.collection.push(item);
	          });
	        }
	        d.resolve(res);
	      }), function(err){
	        d.reject(err);
	      }
	      return d.promise;
	    },
	    addDc: function(item){
	      var d = $q.defer();
	      dcRsc.save({}, {dc: item}, function(res){
	        d.resolve(res);
	      }, function(err){
	        d.reject(err);
	      });
	      return d.promise;
	    },
	    getDcFile: function(path){
	      window.open(Constant.baseUrl + '/file/' + path, '_blank', '');
	    },
	    findItemById: function(id){
	      for(var i=0; i<this.collection.length; i++){
	        if(this.collection[i]._id == id) return this.collection[i];
	      }
	    }
	  }

	  return dcModel;
	}]

/***/ },
/* 66 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ["$http", '$q', 'Constant', '$resource', function($http, $q, Constant, $resource){
	  var partTypes = [
	    {
	      id: "any",
	      name: "任意",
	      attrList: []
	    },
	    {
	      id: "lens",
	      name: "透镜模块",
	      attrList: [
	        {id: "name", name: "名称", value: "", unit: ""},
	        {id: "producer", name: "生产商", value: "", unit: ""},
	        {id: "version", name: "型号", value: "", unit: ""},
	        {id: "size", name: "尺寸", value: "", unit: "mm*mm"},
	        {id: "price", name: "价格", value: "", unit: "￥"},
	        {id: "material", name: "材质", value: "", unit: ""},
	        {id: "luminousness", name: "透光率", value: "", unit: "%"},
	        {id: "lmsAngle", name: "发光角度", value: "", unit: ""},
	      ]
	    },
	    {
	      id: "chip",
	      name: "芯片",
	      attrList: [
	        {id: "name", name: "名称", value: "", unit: ""},
	        {id: "producer", name: "生产商", value: ""},
	        {id: "version", name: "型号", value: ""},
	        {id: "size", name: "尺寸", value: ""},
	        {id: "price", name: "价格", value: ""},
	        {id: "lmsFlux", name: "光通量", value: ""},
	        {id: "power", name: "功率", value: ""},
	        {id: "voltage", name: "电压", value: ""},
	        {id: "cri", name: "显色指数", value: ""},
	        {id: "lmsAngle", name: "发光角度", value: ""},
	        {id: "resistance", name: "热阻", value: ""},
	      ]
	    },
	    {
	      id: "substrate",
	      name: "基板",
	      attrList: [
	        {id: "name", name: "名称", value: "", unit: ""},
	        {id: "producer", name: "生产商", value: ""},
	        {id: "version", name: "型号", value: ""},
	        {id: "size", name: "尺寸", value: ""},
	        {id: "price", name: "价格", value: ""},
	        {id: "material", name: "材质", value: ""},
	        {id: "power", name: "功率", value: ""},
	        {id: "voltage", name: "电压", value: ""},
	      ]
	    },
	    {
	      id: "source",
	      name: "电源",
	      attrList: [
	        {id: "name", name: "名称", value: "", unit: ""},
	        {id: "producer", name: "生产商", value: ""},
	        {id: "version", name: "型号", value: ""},
	        {id: "size", name: "尺寸", value: ""},
	        {id: "price", name: "价格", value: ""},
	        {id: "type", name: "类型", value: ""},
	        {id: "power", name: "功率", value: ""},
	        {id: "inputVoltage", name: "输入电压", value: ""},
	        {id: "outputVoltage", name: "输出电压", value: ""},
	      ]
	    },
	    {
	      id: "controller",
	      name: "控制器",
	      attrList: [
	        {id: "name", name: "名称", value: "", unit: ""},
	        {id: "producer", name: "生产商", value: ""},
	        {id: "version", name: "型号", value: ""},
	        {id: "price", name: "价格", value: ""},
	        {id: "power", name: "功率", value: ""},
	        {id: "inputVoltage", name: "输入电压", value: ""},
	        {id: "outputVoltage", name: "输出电压", value: ""},
	      ]
	    },
	    {
	      id: "radiator",
	      name: "散热器",
	      attrList: [
	        {id: "name", name: "名称", value: "", unit: ""},
	        {id: "producer", name: "生产商", value: ""},
	        {id: "version", name: "型号", value: ""},
	        {id: "material", name: "材质", value: ""},
	      ]
	    },
	    {
	      id: "shell",
	      name: "外壳",
	      attrList: [
	        {id: "name", name: "名称", value: "", unit: ""},
	        {attr: "producer", name: "生产商", value: ""},
	        {attr: "version", name: "型号", value: ""},
	        {attr: "material", name: "材质", value: ""},
	      ]
	    }
	  ];

	  return partTypes;
	}]

/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['$http', '$q', 'Constant', '$resource', function($http, $q, Constant, $resource){
	  var partRsc = $resource(
	    Constant.baseUrl + '/knowledge/part/:id',
	    {id: '@id',}
	  );
	  var partsRsc = $resource(
	    Constant.baseUrl + '/knowledge/parts/:typeId',
	    {typeId: '@typeId'}
	  )

	  var partModel = {
	    item: {},
	    collection: [],

	    getParts: function(typeId, pageId, pageSize){
	      var d = $q.defer();
	      partsRsc.get({typeId: typeId, pageId: pageId, pageSize: pageSize}, function(res){
	        partModel.collection = [];
	        if(res.data){
	          res.data.parts.forEach(function(item){
	            partModel.collection.push(item);
	          });
	        }
	        d.resolve(res);
	      }), function(err){
	        d.reject(err);
	      }
	      return d.promise;
	    },

	    addPart: function(item){
	      var d = $q.defer();
	      console.log(item);
	      partRsc.save({}, {part: item}, function(res){
	        d.resolve(res);
	      }, function(err){
	        d.reject(err);
	      });
	      return d.promise;
	    },
	  }

	  return partModel;
	}]

/***/ },
/* 68 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['$http', '$q', 'Constant', '$resource', function($http, $q, Constant, $resource){
	  var modelRsc = $resource(Constant.baseUrl + '/knowledge/model/');
	  var modelsRsc = $resource(Constant.baseUrl + '/knowledge/models');
	  var modelDealsRsc = $resource(Constant.baseUrl + '/knowledge/modeldeals');

	  var modelModel = {
	    item: {},
	    collection: [],

	    getModels: function(typeId, pageId, pageSize){
	      var d = $q.defer();
	      modelsRsc.get({typeId: typeId, pageId: pageId, pageSize: pageSize}, function(res){
	        modelModel.collection = [];
	        if(res.data){
	          res.data.models.forEach(function(item){
	            modelModel.collection.push(item);
	          });
	        }
	        d.resolve(res);
	      }), function(err){
	        d.reject(err);
	      }
	      return d.promise;
	    },

	    getModel: function(modelId){
	      var d = $q.defer();
	      modelRsc.get({modelId: modelId}, function(res){
	        if(res.code == '200'){
	          d.resolve(res.data.model);
	        } else{
	          alert('没有model:' + modelId);
	          d.resolve();
	        }
	      }, function(err){
	        d.reject(err);
	      })
	      return d.promise;
	    },

	    addModel: function(item){
	      var d = $q.defer();
	      var model = angular.merge({}, item);
	      model.partList.forEach(function(item){
	        if(item.hasOwnProperty("isDisabledAdd")) delete item.isDisabledAdd;
	        if(item.hasOwnProperty("isShowInfo")) delete item.isShowInfo;
	      });
	      modelRsc.save({}, {model: model}, function(res){
	        d.resolve(res);
	      }, function(err){
	        d.reject(err);
	      });
	      return d.promise;
	    },

	    //item.partList中添加part子项
	    addPart: function(part){
	      if(!this.item.partList){
	        this.item.partList = [];
	      }
	      this.item.partList.push(part);
	    },

	    removePart: function(index){
	      if(!this.item.partList) return false;
	      this.item.partList.splice(index ,1);
	    },


	    getModelDeals: function(typeId, pageId, pageSize){
	      var d = $q.defer();
	      modelDealsRsc.get({typeId: typeId, pageId: pageId, pageSize: pageSize}, function(res){
	        d.resolve(res);
	      }), function(err){
	        d.reject(err);
	      }
	      return d.promise;
	    },
	  }

	  return modelModel;
	}]

/***/ },
/* 69 */
/***/ function(module, exports) {

	'use strict';

	module.exports = [function(){
	  var modelAttrs = [
	    {id: "name", name: "实例名称", value: "", unit: ""},
	    {id: "producer", name: "生产商", value: "", unit: ""},
	    {id: "version", name: "实例型号", value: "", unit: ""},
	    {id: "price", name: "价格", value: "", unit: "￥"},
	    {id: "desc", name: "描述", value: "", unit: ""},
	    {id: "minPower", name: "最小功率", value: "", unit: "W"},
	    {id: "maxPower", name: "最大功率", value: "", unit: "W"},
	    {id: "minVoltage", name: "最小电压", value: "", unit: "V"},
	    {id: "maxVoltage", name: "最大电压", value: "", unit: "V"},
	    {id: "minLuminous", name: "最小光通量", value: "", unit: "Lm"},
	    {id: "maxLuminous", name: "最大光通量", value: "", unit: "Lm"},
	    {id: "minColorTemperature", name: "最小色温", value: "", unit: "K"},
	    {id: "maxColorTemperature", name: "最大色温", value: "", unit: "K"},
	    {id: "size", name: "尺寸", value: "", unit: "mm*mm"},
	    {id: "material", name: "材质", value: "", unit: ""},
	    {id: "dazzle", name: "炫光等级", value: "", unit: ""},
	    {id: "color", name: "光照颜色", value: "", unit: ""},
	  ];

	  return modelAttrs;
	}]

/***/ },
/* 70 */
/***/ function(module, exports) {

	'use strict';

	module.exports = [function(){
	  //type: 0为室内；type: 1为室外
	  var lightTypes = [
	    {id: 'any', name: "任意", place: "",},  //place为空则表示全部
	    {id: "spotLight", name: "LED射灯", place: "0"},
	    {id: "tubeLight", name: "LED筒灯", place: "0"},
	    {id: "ballLight", name: "LED球泡灯", place: "0"},
	    {id: "gridLight", name: "LED栅格灯", place: "0"},
	    {id: "panelLight", name: "LED面板灯", place: "0"},
	    {id: "streetLight", name: "LED路灯", place: "1"},
	  ];
	  return lightTypes;
	}]

/***/ },
/* 71 */
/***/ function(module, exports) {

	'use strict';

	module.exports = [function(){
	  var lightTypes = [
	    {id: "0", name: "白"},
	    {id: "1", name: "暖白"},
	    {id: "2", name: "冷白"},
	    {id: "3", name: "彩色"},
	    {id: "4", name: "其它"},
	  ];
	  return lightTypes;
	}]

/***/ },
/* 72 */
/***/ function(module, exports) {

	'use strict';

	module.exports = [function(){
	  var lightMaterials = [
	    {id: "0", name: "铝"},
	    {id: "1", name: "塑料"},
	    {id: "3", name: "任意金属"},
	    {id: "4", name: "其它"}
	  ];
	  return lightMaterials;
	}]

/***/ },
/* 73 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(){
	  return function(type, idTag){
	    var output = [];
	    if(type instanceof Array){
	      type.forEach(function(item){
	        if(item.id.indexOf(idTag) != -1) {
	          output.push(item);
	        }
	      })
	      return output;
	    } else {
	      return false;
	    }
	  }
	}

/***/ },
/* 74 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(){
	  return function(size){
	    return size < 1024*1024 ? (size/1024).toFixed(1) + 'KB' : (size/1024/1024).toFixed(1) + 'MB';
	  }
	}

/***/ },
/* 75 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * 返回part.item下attrList中id="name"的零部件名称
	 * @returns {Function}
	 */
	module.exports = function(){
	  return function(item){
	    for(var i=0; i<item.attrList.length; i++){
	      if(item.attrList[i].id == 'name'){
	        return item.attrList[i].value;
	      }
	    }
	    return;
	  }
	}

/***/ },
/* 76 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(){
	  return function(partList, typeId){
	    var output = [];
	    if(partList instanceof Array){
	      partList.forEach(function(part){
	        if(part.typeId == typeId) {
	          output.push(part);
	        }
	      })
	      return output;
	    } else {
	      return false;
	    }
	  }
	}

/***/ },
/* 77 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * id标识属性id,查找attrList中id="id"的零部件，返回零部件属性的attr（标识属性的id，name，value）item.attrList[i][attr]
	 * 另外需要判断如果属性值value为object则返回object的value
	 * @returns {Function}
	 */
	module.exports = function(){
	  return function(item, id, attr){
	    if(!item) return;
	    for(var i=0; i<item.attrList.length; i++){
	      if(item.attrList[i].id == id){
	        if(typeof item.attrList[i][attr] == 'object'){
	          return item.attrList[i][attr].name;
	        } else{
	          return item.attrList[i][attr];
	        }
	      }
	    }
	    return;
	  }
	}

/***/ },
/* 78 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(){
	  return function(partList){
	    var output = [];
	    if(partList instanceof Array){
	      partList.forEach(function(item){
	        if(item.selected) {
	          output.push(item);
	        }
	      })
	      return output;
	    } else {
	      return false;
	    }
	  }
	}


/***/ },
/* 79 */
/***/ function(module, exports) {

	var v1="<div class=\"home-tpl\">\n    <section class=\"banner\"></section>\n\n    <section class=\"custom-nav\" ng-controller=\"CustomNavCtrl\">\n      <accordion-item is-collapse=\"header.isCollapse\">\n        <accordion-title class=\"header\">\n          <md-button class=\"btn-full btn-right custom-btn\">\n            专属定制\n            <svg-icon svg-id=\"{{header.svg}}\" class=\"btn-right-icon custom-btn-icon\"></svg-icon>\n          </md-button>\n        </accordion-title>\n        <accordion-content class=\"custom-nav-content\">\n          <accordion>\n            <accordion-item ng-repeat=\"item in content.items\" is-collapse=\"item.isCollapse\">\n              <md-divider class=\"divider\"></md-divider>\n              <accordion-title>\n                <md-button class=\"btn-full btn-right\">\n                  {{item.title}}\n                  <svg-icon svg-id=\"{{item.svg}}\" class=\"btn-right-icon custom-btn-icon\"></svg-icon>\n                </md-button>\n              </accordion-title>\n              <accordion-content>\n                <ul>\n                  <li ng-repeat=\"option in item.options\">\n                    <!--<md-button class=\"item-btn btn-full\" ui-sref=\"screen\">-->\n                    <md-button class=\"item-btn btn-full\">\n                    {{option}}\n                    </md-button>\n                  </li>\n                </ul>\n              </accordion-content>\n            </accordion-item>\n          </accordion>\n          <div>\n            <md-divider class=\"divider\"></md-divider>\n            <md-button class=\"btn-full btn-right\">\n              什么是专属定制\n              <svg-icon svg-id=\"{{whatSvg}}\" class=\"btn-right-icon\"></svg-icon>\n            </md-button>\n          </div>\n        </accordion-content>\n      </accordion-item>\n    </section>\n\n    <section class=\"cst-container\">\n      <div class=\"cst-header\">\n        <h1>立即开始</h1>\n        <p>准备好缔造你的专属烙印了吗？Cleds专属定制畅销精品，</p>\n        <p>选择其一开始定制之旅</p>\n      </div>\n      <div layout=\"row\" layout-align=\"space-around center\" layout-wrap class=\"cst-content\">\n        <deal-card ng-repeat=\"deal in deals\"></deal-card>\n      </div>\n    </section>\n\n    <section class=\"desc\">\n      <div>\n        <h2>自由打造专属设计</h2>\n        <h1>Cleds制造</h1>\n        <p>Cleds这项服务让你能够按照心中所想,</p>\n        <p>精确定制你的专属LED照明产品。添加你的个性元素,从零设计,或优化你的</p>\n        <p>性能配置,丰富可能任你发掘。释放你的创意,</p>\n        <p>发掘Cleds卓越的个性化服务。</p>\n      </div>\n    </section>\n\n    <nav-fab></nav-fab>\n  </div>";
	window.angular.module(["ng"]).run(["$templateCache",function(c){c.put("homeTpl", v1)}]);
	module.exports=v1;

/***/ },
/* 80 */
/***/ function(module, exports) {

	var v1="<div class=\"c-part-tpl\">\n    <div class=\"content\" layout=\"row\">\n      <div flex=\"75\">\n        <!--<div class=\"title\">产品名称:{{model | modelAttrFilter:'name':'value'}}</div>-->\n        <!--<div layout=\"column\">-->\n          <!--<div class=\"parts\" flex=\"100\" ng-repeat=\"item in model.partList | selectedPartFilter\">{{item.typeName}}:{{item | partNameFilter}}</div>-->\n          <!--<model-viewer class=\"parts\" flex=\"100\" model-url=\"view.modelSrc\"></model-viewer>-->\n        <iframe  class=\"parts\" flex=\"100\" ng-src={{view.iframeSrc}}></iframe>\n        <!--</div>-->\n      </div>\n      <div flex=\"25\" layout=\"column\">\n        <div class=\"model-info\" layout=\"column\">\n          <span flex>产品名称：{{model | modelAttrFilter:'name':'value'}}</span>\n          <span flex>价格：{{model | modelAttrFilter:'price':'value'}}</span>\n          <span flex>描述：{{model | modelAttrFilter:'desc':'value'}}</span>\n        </div>\n        <div class=\"model-parts\" layout=\"column\">\n          <div layout=\"row\" ng-repeat=\"partType in partTypes track by $index\" ng-class=\"{'active': partType.active, 'part-select': true}\">\n            <span class=\"tag\" flex=\"20\"></span>\n            <md-button class=\"btn md-raised md-cornered md-primary\" flex=\"100\" ng-click=\"view.switchPart(partType.id, $index)\">{{partType.name}}</md-button>\n          </div>\n        </div>\n        <div class=\"op\" layout=\"column\">\n          <div layout=\"row\" layout-sm=\"column\" layout-align=\"center center\">\n            <md-button class=\"groupX left\" ng-click=\"\">上一步</md-button>\n            <md-button class=\"groupX right\" ng-click=\"\">下一步</md-button>\n          </div>\n          <md-button class=\"c-btn md-raised md-warn\" ng-click=\"view.go()\">生成定制</md-button>\n        </div>\n      </div>\n    </div>\n    <div class=\"part-list\" layout=\"row\" layout-align=\"space-around center\" style=\"min-height: 140px;\">\n      <div flex=\"15\" layout=\"column\" ng-repeat=\"part in view.parts\" ng-class=\"{'part-item': true, 'selected': part.selected}\" ng-click=\"view.showPartInfo(part)\">\n        <img class=\"img\" ng-click=\"view.selectPart($index)\" ng-src=\"{{part.imageSrc}}\" />\n        <p class=\"name\">名称：{{part | partNameFilter}}</p>\n      </div>\n    </div>\n    <accordion-item class=\"part-info\">\n      <accordion-title class=\"section-title\">\n        <md-button class=\"btn-full btn-right\">\n          零部件信息\n          <svg-icon svg-id=\"{{Sprite.remove}}\" class=\"btn-right-icon custom-btn-icon\"></svg-icon>\n        </md-button>\n      </accordion-title>\n      <accordion-content class=\"section-content\">\n        <div layout=\"row\" layout-wrap layout-align=\"space-around center\" layout-padding>\n          <div flex=\"35\" ng-repeat=\"item in view.part.attrList\">{{item.name}}:{{item.value}}</div>\n        </div>\n      </accordion-content>\n    </accordion-item>\n\n    <accordion-item class=\"part-info\" ng-show=\"view.isShowList\" style=\"margin-top:20px;\">\n      <accordion-title class=\"section-title\">\n        <md-button class=\"btn-full btn-right\">\n          定制列表\n          <svg-icon svg-id=\"{{Sprite.remove}}\" class=\"btn-right-icon custom-btn-icon\"></svg-icon>\n        </md-button>\n      </accordion-title>\n      <accordion-content class=\"section-content\">\n        <div layout=\"column\" ng-repeat=\"part in model.partList\" ng-show=\"part.selected\">\n          <span style=\"padding-left:20px;min-width:40px; color:blue;\">{{part.typeName}}:</span>\n          <div layout=\"row\" layout-wrap layout-align=\"space-around center\" layout-padding>\n            <div flex=\"35\" ng-repeat=\"item in part.attrList\">{{item.name}}:{{item.value}}</div>\n          </div>\n          <md-divider></md-divider>\n        </div>\n      </accordion-content>\n    </accordion-item>\n  </div>";
	window.angular.module(["ng"]).run(["$templateCache",function(c){c.put("cPartTpl", v1)}]);
	module.exports=v1;

/***/ }
]));