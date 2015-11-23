/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

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

	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(11);
	__webpack_require__(13);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	/**
	 * State-based routing for AngularJS
	 * @version v0.2.15
	 * @link http://angular-ui.github.com/
	 * @license MIT License, http://www.opensource.org/licenses/MIT
	 */

	/* commonjs package manager support (eg componentjs) */
	if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
	  module.exports = 'ui.router';
	}

	(function (window, angular, undefined) {
	/*jshint globalstrict:true*/
	/*global angular:false*/
	'use strict';

	var isDefined = angular.isDefined,
	    isFunction = angular.isFunction,
	    isString = angular.isString,
	    isObject = angular.isObject,
	    isArray = angular.isArray,
	    forEach = angular.forEach,
	    extend = angular.extend,
	    copy = angular.copy;

	function inherit(parent, extra) {
	  return extend(new (extend(function() {}, { prototype: parent }))(), extra);
	}

	function merge(dst) {
	  forEach(arguments, function(obj) {
	    if (obj !== dst) {
	      forEach(obj, function(value, key) {
	        if (!dst.hasOwnProperty(key)) dst[key] = value;
	      });
	    }
	  });
	  return dst;
	}

	/**
	 * Finds the common ancestor path between two states.
	 *
	 * @param {Object} first The first state.
	 * @param {Object} second The second state.
	 * @return {Array} Returns an array of state names in descending order, not including the root.
	 */
	function ancestors(first, second) {
	  var path = [];

	  for (var n in first.path) {
	    if (first.path[n] !== second.path[n]) break;
	    path.push(first.path[n]);
	  }
	  return path;
	}

	/**
	 * IE8-safe wrapper for `Object.keys()`.
	 *
	 * @param {Object} object A JavaScript object.
	 * @return {Array} Returns the keys of the object as an array.
	 */
	function objectKeys(object) {
	  if (Object.keys) {
	    return Object.keys(object);
	  }
	  var result = [];

	  forEach(object, function(val, key) {
	    result.push(key);
	  });
	  return result;
	}

	/**
	 * IE8-safe wrapper for `Array.prototype.indexOf()`.
	 *
	 * @param {Array} array A JavaScript array.
	 * @param {*} value A value to search the array for.
	 * @return {Number} Returns the array index value of `value`, or `-1` if not present.
	 */
	function indexOf(array, value) {
	  if (Array.prototype.indexOf) {
	    return array.indexOf(value, Number(arguments[2]) || 0);
	  }
	  var len = array.length >>> 0, from = Number(arguments[2]) || 0;
	  from = (from < 0) ? Math.ceil(from) : Math.floor(from);

	  if (from < 0) from += len;

	  for (; from < len; from++) {
	    if (from in array && array[from] === value) return from;
	  }
	  return -1;
	}

	/**
	 * Merges a set of parameters with all parameters inherited between the common parents of the
	 * current state and a given destination state.
	 *
	 * @param {Object} currentParams The value of the current state parameters ($stateParams).
	 * @param {Object} newParams The set of parameters which will be composited with inherited params.
	 * @param {Object} $current Internal definition of object representing the current state.
	 * @param {Object} $to Internal definition of object representing state to transition to.
	 */
	function inheritParams(currentParams, newParams, $current, $to) {
	  var parents = ancestors($current, $to), parentParams, inherited = {}, inheritList = [];

	  for (var i in parents) {
	    if (!parents[i].params) continue;
	    parentParams = objectKeys(parents[i].params);
	    if (!parentParams.length) continue;

	    for (var j in parentParams) {
	      if (indexOf(inheritList, parentParams[j]) >= 0) continue;
	      inheritList.push(parentParams[j]);
	      inherited[parentParams[j]] = currentParams[parentParams[j]];
	    }
	  }
	  return extend({}, inherited, newParams);
	}

	/**
	 * Performs a non-strict comparison of the subset of two objects, defined by a list of keys.
	 *
	 * @param {Object} a The first object.
	 * @param {Object} b The second object.
	 * @param {Array} keys The list of keys within each object to compare. If the list is empty or not specified,
	 *                     it defaults to the list of keys in `a`.
	 * @return {Boolean} Returns `true` if the keys match, otherwise `false`.
	 */
	function equalForKeys(a, b, keys) {
	  if (!keys) {
	    keys = [];
	    for (var n in a) keys.push(n); // Used instead of Object.keys() for IE8 compatibility
	  }

	  for (var i=0; i<keys.length; i++) {
	    var k = keys[i];
	    if (a[k] != b[k]) return false; // Not '===', values aren't necessarily normalized
	  }
	  return true;
	}

	/**
	 * Returns the subset of an object, based on a list of keys.
	 *
	 * @param {Array} keys
	 * @param {Object} values
	 * @return {Boolean} Returns a subset of `values`.
	 */
	function filterByKeys(keys, values) {
	  var filtered = {};

	  forEach(keys, function (name) {
	    filtered[name] = values[name];
	  });
	  return filtered;
	}

	// like _.indexBy
	// when you know that your index values will be unique, or you want last-one-in to win
	function indexBy(array, propName) {
	  var result = {};
	  forEach(array, function(item) {
	    result[item[propName]] = item;
	  });
	  return result;
	}

	// extracted from underscore.js
	// Return a copy of the object only containing the whitelisted properties.
	function pick(obj) {
	  var copy = {};
	  var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
	  forEach(keys, function(key) {
	    if (key in obj) copy[key] = obj[key];
	  });
	  return copy;
	}

	// extracted from underscore.js
	// Return a copy of the object omitting the blacklisted properties.
	function omit(obj) {
	  var copy = {};
	  var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
	  for (var key in obj) {
	    if (indexOf(keys, key) == -1) copy[key] = obj[key];
	  }
	  return copy;
	}

	function pluck(collection, key) {
	  var result = isArray(collection) ? [] : {};

	  forEach(collection, function(val, i) {
	    result[i] = isFunction(key) ? key(val) : val[key];
	  });
	  return result;
	}

	function filter(collection, callback) {
	  var array = isArray(collection);
	  var result = array ? [] : {};
	  forEach(collection, function(val, i) {
	    if (callback(val, i)) {
	      result[array ? result.length : i] = val;
	    }
	  });
	  return result;
	}

	function map(collection, callback) {
	  var result = isArray(collection) ? [] : {};

	  forEach(collection, function(val, i) {
	    result[i] = callback(val, i);
	  });
	  return result;
	}

	/**
	 * @ngdoc overview
	 * @name ui.router.util
	 *
	 * @description
	 * # ui.router.util sub-module
	 *
	 * This module is a dependency of other sub-modules. Do not include this module as a dependency
	 * in your angular app (use {@link ui.router} module instead).
	 *
	 */
	angular.module('ui.router.util', ['ng']);

	/**
	 * @ngdoc overview
	 * @name ui.router.router
	 * 
	 * @requires ui.router.util
	 *
	 * @description
	 * # ui.router.router sub-module
	 *
	 * This module is a dependency of other sub-modules. Do not include this module as a dependency
	 * in your angular app (use {@link ui.router} module instead).
	 */
	angular.module('ui.router.router', ['ui.router.util']);

	/**
	 * @ngdoc overview
	 * @name ui.router.state
	 * 
	 * @requires ui.router.router
	 * @requires ui.router.util
	 *
	 * @description
	 * # ui.router.state sub-module
	 *
	 * This module is a dependency of the main ui.router module. Do not include this module as a dependency
	 * in your angular app (use {@link ui.router} module instead).
	 * 
	 */
	angular.module('ui.router.state', ['ui.router.router', 'ui.router.util']);

	/**
	 * @ngdoc overview
	 * @name ui.router
	 *
	 * @requires ui.router.state
	 *
	 * @description
	 * # ui.router
	 * 
	 * ## The main module for ui.router 
	 * There are several sub-modules included with the ui.router module, however only this module is needed
	 * as a dependency within your angular app. The other modules are for organization purposes. 
	 *
	 * The modules are:
	 * * ui.router - the main "umbrella" module
	 * * ui.router.router - 
	 * 
	 * *You'll need to include **only** this module as the dependency within your angular app.*
	 * 
	 * <pre>
	 * <!doctype html>
	 * <html ng-app="myApp">
	 * <head>
	 *   <script src="js/angular.js"></script>
	 *   <!-- Include the ui-router script -->
	 *   <script src="js/angular-ui-router.min.js"></script>
	 *   <script>
	 *     // ...and add 'ui.router' as a dependency
	 *     var myApp = angular.module('myApp', ['ui.router']);
	 *   </script>
	 * </head>
	 * <body>
	 * </body>
	 * </html>
	 * </pre>
	 */
	angular.module('ui.router', ['ui.router.state']);

	angular.module('ui.router.compat', ['ui.router']);

	/**
	 * @ngdoc object
	 * @name ui.router.util.$resolve
	 *
	 * @requires $q
	 * @requires $injector
	 *
	 * @description
	 * Manages resolution of (acyclic) graphs of promises.
	 */
	$Resolve.$inject = ['$q', '$injector'];
	function $Resolve(  $q,    $injector) {
	  
	  var VISIT_IN_PROGRESS = 1,
	      VISIT_DONE = 2,
	      NOTHING = {},
	      NO_DEPENDENCIES = [],
	      NO_LOCALS = NOTHING,
	      NO_PARENT = extend($q.when(NOTHING), { $$promises: NOTHING, $$values: NOTHING });
	  

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$resolve#study
	   * @methodOf ui.router.util.$resolve
	   *
	   * @description
	   * Studies a set of invocables that are likely to be used multiple times.
	   * <pre>
	   * $resolve.study(invocables)(locals, parent, self)
	   * </pre>
	   * is equivalent to
	   * <pre>
	   * $resolve.resolve(invocables, locals, parent, self)
	   * </pre>
	   * but the former is more efficient (in fact `resolve` just calls `study` 
	   * internally).
	   *
	   * @param {object} invocables Invocable objects
	   * @return {function} a function to pass in locals, parent and self
	   */
	  this.study = function (invocables) {
	    if (!isObject(invocables)) throw new Error("'invocables' must be an object");
	    var invocableKeys = objectKeys(invocables || {});
	    
	    // Perform a topological sort of invocables to build an ordered plan
	    var plan = [], cycle = [], visited = {};
	    function visit(value, key) {
	      if (visited[key] === VISIT_DONE) return;
	      
	      cycle.push(key);
	      if (visited[key] === VISIT_IN_PROGRESS) {
	        cycle.splice(0, indexOf(cycle, key));
	        throw new Error("Cyclic dependency: " + cycle.join(" -> "));
	      }
	      visited[key] = VISIT_IN_PROGRESS;
	      
	      if (isString(value)) {
	        plan.push(key, [ function() { return $injector.get(value); }], NO_DEPENDENCIES);
	      } else {
	        var params = $injector.annotate(value);
	        forEach(params, function (param) {
	          if (param !== key && invocables.hasOwnProperty(param)) visit(invocables[param], param);
	        });
	        plan.push(key, value, params);
	      }
	      
	      cycle.pop();
	      visited[key] = VISIT_DONE;
	    }
	    forEach(invocables, visit);
	    invocables = cycle = visited = null; // plan is all that's required
	    
	    function isResolve(value) {
	      return isObject(value) && value.then && value.$$promises;
	    }
	    
	    return function (locals, parent, self) {
	      if (isResolve(locals) && self === undefined) {
	        self = parent; parent = locals; locals = null;
	      }
	      if (!locals) locals = NO_LOCALS;
	      else if (!isObject(locals)) {
	        throw new Error("'locals' must be an object");
	      }       
	      if (!parent) parent = NO_PARENT;
	      else if (!isResolve(parent)) {
	        throw new Error("'parent' must be a promise returned by $resolve.resolve()");
	      }
	      
	      // To complete the overall resolution, we have to wait for the parent
	      // promise and for the promise for each invokable in our plan.
	      var resolution = $q.defer(),
	          result = resolution.promise,
	          promises = result.$$promises = {},
	          values = extend({}, locals),
	          wait = 1 + plan.length/3,
	          merged = false;
	          
	      function done() {
	        // Merge parent values we haven't got yet and publish our own $$values
	        if (!--wait) {
	          if (!merged) merge(values, parent.$$values); 
	          result.$$values = values;
	          result.$$promises = result.$$promises || true; // keep for isResolve()
	          delete result.$$inheritedValues;
	          resolution.resolve(values);
	        }
	      }
	      
	      function fail(reason) {
	        result.$$failure = reason;
	        resolution.reject(reason);
	      }

	      // Short-circuit if parent has already failed
	      if (isDefined(parent.$$failure)) {
	        fail(parent.$$failure);
	        return result;
	      }
	      
	      if (parent.$$inheritedValues) {
	        merge(values, omit(parent.$$inheritedValues, invocableKeys));
	      }

	      // Merge parent values if the parent has already resolved, or merge
	      // parent promises and wait if the parent resolve is still in progress.
	      extend(promises, parent.$$promises);
	      if (parent.$$values) {
	        merged = merge(values, omit(parent.$$values, invocableKeys));
	        result.$$inheritedValues = omit(parent.$$values, invocableKeys);
	        done();
	      } else {
	        if (parent.$$inheritedValues) {
	          result.$$inheritedValues = omit(parent.$$inheritedValues, invocableKeys);
	        }        
	        parent.then(done, fail);
	      }
	      
	      // Process each invocable in the plan, but ignore any where a local of the same name exists.
	      for (var i=0, ii=plan.length; i<ii; i+=3) {
	        if (locals.hasOwnProperty(plan[i])) done();
	        else invoke(plan[i], plan[i+1], plan[i+2]);
	      }
	      
	      function invoke(key, invocable, params) {
	        // Create a deferred for this invocation. Failures will propagate to the resolution as well.
	        var invocation = $q.defer(), waitParams = 0;
	        function onfailure(reason) {
	          invocation.reject(reason);
	          fail(reason);
	        }
	        // Wait for any parameter that we have a promise for (either from parent or from this
	        // resolve; in that case study() will have made sure it's ordered before us in the plan).
	        forEach(params, function (dep) {
	          if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
	            waitParams++;
	            promises[dep].then(function (result) {
	              values[dep] = result;
	              if (!(--waitParams)) proceed();
	            }, onfailure);
	          }
	        });
	        if (!waitParams) proceed();
	        function proceed() {
	          if (isDefined(result.$$failure)) return;
	          try {
	            invocation.resolve($injector.invoke(invocable, self, values));
	            invocation.promise.then(function (result) {
	              values[key] = result;
	              done();
	            }, onfailure);
	          } catch (e) {
	            onfailure(e);
	          }
	        }
	        // Publish promise synchronously; invocations further down in the plan may depend on it.
	        promises[key] = invocation.promise;
	      }
	      
	      return result;
	    };
	  };
	  
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$resolve#resolve
	   * @methodOf ui.router.util.$resolve
	   *
	   * @description
	   * Resolves a set of invocables. An invocable is a function to be invoked via 
	   * `$injector.invoke()`, and can have an arbitrary number of dependencies. 
	   * An invocable can either return a value directly,
	   * or a `$q` promise. If a promise is returned it will be resolved and the 
	   * resulting value will be used instead. Dependencies of invocables are resolved 
	   * (in this order of precedence)
	   *
	   * - from the specified `locals`
	   * - from another invocable that is part of this `$resolve` call
	   * - from an invocable that is inherited from a `parent` call to `$resolve` 
	   *   (or recursively
	   * - from any ancestor `$resolve` of that parent).
	   *
	   * The return value of `$resolve` is a promise for an object that contains 
	   * (in this order of precedence)
	   *
	   * - any `locals` (if specified)
	   * - the resolved return values of all injectables
	   * - any values inherited from a `parent` call to `$resolve` (if specified)
	   *
	   * The promise will resolve after the `parent` promise (if any) and all promises 
	   * returned by injectables have been resolved. If any invocable 
	   * (or `$injector.invoke`) throws an exception, or if a promise returned by an 
	   * invocable is rejected, the `$resolve` promise is immediately rejected with the 
	   * same error. A rejection of a `parent` promise (if specified) will likewise be 
	   * propagated immediately. Once the `$resolve` promise has been rejected, no 
	   * further invocables will be called.
	   * 
	   * Cyclic dependencies between invocables are not permitted and will caues `$resolve`
	   * to throw an error. As a special case, an injectable can depend on a parameter 
	   * with the same name as the injectable, which will be fulfilled from the `parent` 
	   * injectable of the same name. This allows inherited values to be decorated. 
	   * Note that in this case any other injectable in the same `$resolve` with the same
	   * dependency would see the decorated value, not the inherited value.
	   *
	   * Note that missing dependencies -- unlike cyclic dependencies -- will cause an 
	   * (asynchronous) rejection of the `$resolve` promise rather than a (synchronous) 
	   * exception.
	   *
	   * Invocables are invoked eagerly as soon as all dependencies are available. 
	   * This is true even for dependencies inherited from a `parent` call to `$resolve`.
	   *
	   * As a special case, an invocable can be a string, in which case it is taken to 
	   * be a service name to be passed to `$injector.get()`. This is supported primarily 
	   * for backwards-compatibility with the `resolve` property of `$routeProvider` 
	   * routes.
	   *
	   * @param {object} invocables functions to invoke or 
	   * `$injector` services to fetch.
	   * @param {object} locals  values to make available to the injectables
	   * @param {object} parent  a promise returned by another call to `$resolve`.
	   * @param {object} self  the `this` for the invoked methods
	   * @return {object} Promise for an object that contains the resolved return value
	   * of all invocables, as well as any inherited and local values.
	   */
	  this.resolve = function (invocables, locals, parent, self) {
	    return this.study(invocables)(locals, parent, self);
	  };
	}

	angular.module('ui.router.util').service('$resolve', $Resolve);


	/**
	 * @ngdoc object
	 * @name ui.router.util.$templateFactory
	 *
	 * @requires $http
	 * @requires $templateCache
	 * @requires $injector
	 *
	 * @description
	 * Service. Manages loading of templates.
	 */
	$TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];
	function $TemplateFactory(  $http,   $templateCache,   $injector) {

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$templateFactory#fromConfig
	   * @methodOf ui.router.util.$templateFactory
	   *
	   * @description
	   * Creates a template from a configuration object. 
	   *
	   * @param {object} config Configuration object for which to load a template. 
	   * The following properties are search in the specified order, and the first one 
	   * that is defined is used to create the template:
	   *
	   * @param {string|object} config.template html string template or function to 
	   * load via {@link ui.router.util.$templateFactory#fromString fromString}.
	   * @param {string|object} config.templateUrl url to load or a function returning 
	   * the url to load via {@link ui.router.util.$templateFactory#fromUrl fromUrl}.
	   * @param {Function} config.templateProvider function to invoke via 
	   * {@link ui.router.util.$templateFactory#fromProvider fromProvider}.
	   * @param {object} params  Parameters to pass to the template function.
	   * @param {object} locals Locals to pass to `invoke` if the template is loaded 
	   * via a `templateProvider`. Defaults to `{ params: params }`.
	   *
	   * @return {string|object}  The template html as a string, or a promise for 
	   * that string,or `null` if no template is configured.
	   */
	  this.fromConfig = function (config, params, locals) {
	    return (
	      isDefined(config.template) ? this.fromString(config.template, params) :
	      isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) :
	      isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) :
	      null
	    );
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$templateFactory#fromString
	   * @methodOf ui.router.util.$templateFactory
	   *
	   * @description
	   * Creates a template from a string or a function returning a string.
	   *
	   * @param {string|object} template html template as a string or function that 
	   * returns an html template as a string.
	   * @param {object} params Parameters to pass to the template function.
	   *
	   * @return {string|object} The template html as a string, or a promise for that 
	   * string.
	   */
	  this.fromString = function (template, params) {
	    return isFunction(template) ? template(params) : template;
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$templateFactory#fromUrl
	   * @methodOf ui.router.util.$templateFactory
	   * 
	   * @description
	   * Loads a template from the a URL via `$http` and `$templateCache`.
	   *
	   * @param {string|Function} url url of the template to load, or a function 
	   * that returns a url.
	   * @param {Object} params Parameters to pass to the url function.
	   * @return {string|Promise.<string>} The template html as a string, or a promise 
	   * for that string.
	   */
	  this.fromUrl = function (url, params) {
	    if (isFunction(url)) url = url(params);
	    if (url == null) return null;
	    else return $http
	        .get(url, { cache: $templateCache, headers: { Accept: 'text/html' }})
	        .then(function(response) { return response.data; });
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$templateFactory#fromProvider
	   * @methodOf ui.router.util.$templateFactory
	   *
	   * @description
	   * Creates a template by invoking an injectable provider function.
	   *
	   * @param {Function} provider Function to invoke via `$injector.invoke`
	   * @param {Object} params Parameters for the template.
	   * @param {Object} locals Locals to pass to `invoke`. Defaults to 
	   * `{ params: params }`.
	   * @return {string|Promise.<string>} The template html as a string, or a promise 
	   * for that string.
	   */
	  this.fromProvider = function (provider, params, locals) {
	    return $injector.invoke(provider, null, locals || { params: params });
	  };
	}

	angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);

	var $$UMFP; // reference to $UrlMatcherFactoryProvider

	/**
	 * @ngdoc object
	 * @name ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Matches URLs against patterns and extracts named parameters from the path or the search
	 * part of the URL. A URL pattern consists of a path pattern, optionally followed by '?' and a list
	 * of search parameters. Multiple search parameter names are separated by '&'. Search parameters
	 * do not influence whether or not a URL is matched, but their values are passed through into
	 * the matched parameters returned by {@link ui.router.util.type:UrlMatcher#methods_exec exec}.
	 *
	 * Path parameter placeholders can be specified using simple colon/catch-all syntax or curly brace
	 * syntax, which optionally allows a regular expression for the parameter to be specified:
	 *
	 * * `':'` name - colon placeholder
	 * * `'*'` name - catch-all placeholder
	 * * `'{' name '}'` - curly placeholder
	 * * `'{' name ':' regexp|type '}'` - curly placeholder with regexp or type name. Should the
	 *   regexp itself contain curly braces, they must be in matched pairs or escaped with a backslash.
	 *
	 * Parameter names may contain only word characters (latin letters, digits, and underscore) and
	 * must be unique within the pattern (across both path and search parameters). For colon
	 * placeholders or curly placeholders without an explicit regexp, a path parameter matches any
	 * number of characters other than '/'. For catch-all placeholders the path parameter matches
	 * any number of characters.
	 *
	 * Examples:
	 *
	 * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
	 *   trailing slashes, and patterns have to match the entire path, not just a prefix.
	 * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
	 *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
	 * * `'/user/{id}'` - Same as the previous example, but using curly brace syntax.
	 * * `'/user/{id:[^/]*}'` - Same as the previous example.
	 * * `'/user/{id:[0-9a-fA-F]{1,8}}'` - Similar to the previous example, but only matches if the id
	 *   parameter consists of 1 to 8 hex digits.
	 * * `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
	 *   path into the parameter 'path'.
	 * * `'/files/*path'` - ditto.
	 * * `'/calendar/{start:date}'` - Matches "/calendar/2014-11-12" (because the pattern defined
	 *   in the built-in  `date` Type matches `2014-11-12`) and provides a Date object in $stateParams.start
	 *
	 * @param {string} pattern  The pattern to compile into a matcher.
	 * @param {Object} config  A configuration object hash:
	 * @param {Object=} parentMatcher Used to concatenate the pattern/config onto
	 *   an existing UrlMatcher
	 *
	 * * `caseInsensitive` - `true` if URL matching should be case insensitive, otherwise `false`, the default value (for backward compatibility) is `false`.
	 * * `strict` - `false` if matching against a URL with a trailing slash should be treated as equivalent to a URL without a trailing slash, the default value is `true`.
	 *
	 * @property {string} prefix  A static prefix of this pattern. The matcher guarantees that any
	 *   URL matching this matcher (i.e. any string for which {@link ui.router.util.type:UrlMatcher#methods_exec exec()} returns
	 *   non-null) will start with this prefix.
	 *
	 * @property {string} source  The pattern that was passed into the constructor
	 *
	 * @property {string} sourcePath  The path portion of the source property
	 *
	 * @property {string} sourceSearch  The search portion of the source property
	 *
	 * @property {string} regex  The constructed regex that will be used to match against the url when
	 *   it is time to determine which url will match.
	 *
	 * @returns {Object}  New `UrlMatcher` object
	 */
	function UrlMatcher(pattern, config, parentMatcher) {
	  config = extend({ params: {} }, isObject(config) ? config : {});

	  // Find all placeholders and create a compiled pattern, using either classic or curly syntax:
	  //   '*' name
	  //   ':' name
	  //   '{' name '}'
	  //   '{' name ':' regexp '}'
	  // The regular expression is somewhat complicated due to the need to allow curly braces
	  // inside the regular expression. The placeholder regexp breaks down as follows:
	  //    ([:*])([\w\[\]]+)              - classic placeholder ($1 / $2) (search version has - for snake-case)
	  //    \{([\w\[\]]+)(?:\:( ... ))?\}  - curly brace placeholder ($3) with optional regexp/type ... ($4) (search version has - for snake-case
	  //    (?: ... | ... | ... )+         - the regexp consists of any number of atoms, an atom being either
	  //    [^{}\\]+                       - anything other than curly braces or backslash
	  //    \\.                            - a backslash escape
	  //    \{(?:[^{}\\]+|\\.)*\}          - a matched set of curly braces containing other atoms
	  var placeholder       = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
	      searchPlaceholder = /([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
	      compiled = '^', last = 0, m,
	      segments = this.segments = [],
	      parentParams = parentMatcher ? parentMatcher.params : {},
	      params = this.params = parentMatcher ? parentMatcher.params.$$new() : new $$UMFP.ParamSet(),
	      paramNames = [];

	  function addParameter(id, type, config, location) {
	    paramNames.push(id);
	    if (parentParams[id]) return parentParams[id];
	    if (!/^\w+(-+\w+)*(?:\[\])?$/.test(id)) throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
	    if (params[id]) throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
	    params[id] = new $$UMFP.Param(id, type, config, location);
	    return params[id];
	  }

	  function quoteRegExp(string, pattern, squash, optional) {
	    var surroundPattern = ['',''], result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
	    if (!pattern) return result;
	    switch(squash) {
	      case false: surroundPattern = ['(', ')' + (optional ? "?" : "")]; break;
	      case true:  surroundPattern = ['?(', ')?']; break;
	      default:    surroundPattern = ['(' + squash + "|", ')?']; break;
	    }
	    return result + surroundPattern[0] + pattern + surroundPattern[1];
	  }

	  this.source = pattern;

	  // Split into static segments separated by path parameter placeholders.
	  // The number of segments is always 1 more than the number of parameters.
	  function matchDetails(m, isSearch) {
	    var id, regexp, segment, type, cfg, arrayMode;
	    id          = m[2] || m[3]; // IE[78] returns '' for unmatched groups instead of null
	    cfg         = config.params[id];
	    segment     = pattern.substring(last, m.index);
	    regexp      = isSearch ? m[4] : m[4] || (m[1] == '*' ? '.*' : null);
	    type        = $$UMFP.type(regexp || "string") || inherit($$UMFP.type("string"), { pattern: new RegExp(regexp, config.caseInsensitive ? 'i' : undefined) });
	    return {
	      id: id, regexp: regexp, segment: segment, type: type, cfg: cfg
	    };
	  }

	  var p, param, segment;
	  while ((m = placeholder.exec(pattern))) {
	    p = matchDetails(m, false);
	    if (p.segment.indexOf('?') >= 0) break; // we're into the search part

	    param = addParameter(p.id, p.type, p.cfg, "path");
	    compiled += quoteRegExp(p.segment, param.type.pattern.source, param.squash, param.isOptional);
	    segments.push(p.segment);
	    last = placeholder.lastIndex;
	  }
	  segment = pattern.substring(last);

	  // Find any search parameter names and remove them from the last segment
	  var i = segment.indexOf('?');

	  if (i >= 0) {
	    var search = this.sourceSearch = segment.substring(i);
	    segment = segment.substring(0, i);
	    this.sourcePath = pattern.substring(0, last + i);

	    if (search.length > 0) {
	      last = 0;
	      while ((m = searchPlaceholder.exec(search))) {
	        p = matchDetails(m, true);
	        param = addParameter(p.id, p.type, p.cfg, "search");
	        last = placeholder.lastIndex;
	        // check if ?&
	      }
	    }
	  } else {
	    this.sourcePath = pattern;
	    this.sourceSearch = '';
	  }

	  compiled += quoteRegExp(segment) + (config.strict === false ? '\/?' : '') + '$';
	  segments.push(segment);

	  this.regexp = new RegExp(compiled, config.caseInsensitive ? 'i' : undefined);
	  this.prefix = segments[0];
	  this.$$paramNames = paramNames;
	}

	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#concat
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Returns a new matcher for a pattern constructed by appending the path part and adding the
	 * search parameters of the specified pattern to this pattern. The current pattern is not
	 * modified. This can be understood as creating a pattern for URLs that are relative to (or
	 * suffixes of) the current pattern.
	 *
	 * @example
	 * The following two matchers are equivalent:
	 * <pre>
	 * new UrlMatcher('/user/{id}?q').concat('/details?date');
	 * new UrlMatcher('/user/{id}/details?q&date');
	 * </pre>
	 *
	 * @param {string} pattern  The pattern to append.
	 * @param {Object} config  An object hash of the configuration for the matcher.
	 * @returns {UrlMatcher}  A matcher for the concatenated pattern.
	 */
	UrlMatcher.prototype.concat = function (pattern, config) {
	  // Because order of search parameters is irrelevant, we can add our own search
	  // parameters to the end of the new pattern. Parse the new pattern by itself
	  // and then join the bits together, but it's much easier to do this on a string level.
	  var defaultConfig = {
	    caseInsensitive: $$UMFP.caseInsensitive(),
	    strict: $$UMFP.strictMode(),
	    squash: $$UMFP.defaultSquashPolicy()
	  };
	  return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch, extend(defaultConfig, config), this);
	};

	UrlMatcher.prototype.toString = function () {
	  return this.source;
	};

	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#exec
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Tests the specified path against this matcher, and returns an object containing the captured
	 * parameter values, or null if the path does not match. The returned object contains the values
	 * of any search parameters that are mentioned in the pattern, but their value may be null if
	 * they are not present in `searchParams`. This means that search parameters are always treated
	 * as optional.
	 *
	 * @example
	 * <pre>
	 * new UrlMatcher('/user/{id}?q&r').exec('/user/bob', {
	 *   x: '1', q: 'hello'
	 * });
	 * // returns { id: 'bob', q: 'hello', r: null }
	 * </pre>
	 *
	 * @param {string} path  The URL path to match, e.g. `$location.path()`.
	 * @param {Object} searchParams  URL search parameters, e.g. `$location.search()`.
	 * @returns {Object}  The captured parameter values.
	 */
	UrlMatcher.prototype.exec = function (path, searchParams) {
	  var m = this.regexp.exec(path);
	  if (!m) return null;
	  searchParams = searchParams || {};

	  var paramNames = this.parameters(), nTotal = paramNames.length,
	    nPath = this.segments.length - 1,
	    values = {}, i, j, cfg, paramName;

	  if (nPath !== m.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");

	  function decodePathArray(string) {
	    function reverseString(str) { return str.split("").reverse().join(""); }
	    function unquoteDashes(str) { return str.replace(/\\-/g, "-"); }

	    var split = reverseString(string).split(/-(?!\\)/);
	    var allReversed = map(split, reverseString);
	    return map(allReversed, unquoteDashes).reverse();
	  }

	  for (i = 0; i < nPath; i++) {
	    paramName = paramNames[i];
	    var param = this.params[paramName];
	    var paramVal = m[i+1];
	    // if the param value matches a pre-replace pair, replace the value before decoding.
	    for (j = 0; j < param.replace; j++) {
	      if (param.replace[j].from === paramVal) paramVal = param.replace[j].to;
	    }
	    if (paramVal && param.array === true) paramVal = decodePathArray(paramVal);
	    values[paramName] = param.value(paramVal);
	  }
	  for (/**/; i < nTotal; i++) {
	    paramName = paramNames[i];
	    values[paramName] = this.params[paramName].value(searchParams[paramName]);
	  }

	  return values;
	};

	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#parameters
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Returns the names of all path and search parameters of this pattern in an unspecified order.
	 *
	 * @returns {Array.<string>}  An array of parameter names. Must be treated as read-only. If the
	 *    pattern has no parameters, an empty array is returned.
	 */
	UrlMatcher.prototype.parameters = function (param) {
	  if (!isDefined(param)) return this.$$paramNames;
	  return this.params[param] || null;
	};

	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#validate
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Checks an object hash of parameters to validate their correctness according to the parameter
	 * types of this `UrlMatcher`.
	 *
	 * @param {Object} params The object hash of parameters to validate.
	 * @returns {boolean} Returns `true` if `params` validates, otherwise `false`.
	 */
	UrlMatcher.prototype.validates = function (params) {
	  return this.params.$$validates(params);
	};

	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#format
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Creates a URL that matches this pattern by substituting the specified values
	 * for the path and search parameters. Null values for path parameters are
	 * treated as empty strings.
	 *
	 * @example
	 * <pre>
	 * new UrlMatcher('/user/{id}?q').format({ id:'bob', q:'yes' });
	 * // returns '/user/bob?q=yes'
	 * </pre>
	 *
	 * @param {Object} values  the values to substitute for the parameters in this pattern.
	 * @returns {string}  the formatted URL (path and optionally search part).
	 */
	UrlMatcher.prototype.format = function (values) {
	  values = values || {};
	  var segments = this.segments, params = this.parameters(), paramset = this.params;
	  if (!this.validates(values)) return null;

	  var i, search = false, nPath = segments.length - 1, nTotal = params.length, result = segments[0];

	  function encodeDashes(str) { // Replace dashes with encoded "\-"
	    return encodeURIComponent(str).replace(/-/g, function(c) { return '%5C%' + c.charCodeAt(0).toString(16).toUpperCase(); });
	  }

	  for (i = 0; i < nTotal; i++) {
	    var isPathParam = i < nPath;
	    var name = params[i], param = paramset[name], value = param.value(values[name]);
	    var isDefaultValue = param.isOptional && param.type.equals(param.value(), value);
	    var squash = isDefaultValue ? param.squash : false;
	    var encoded = param.type.encode(value);

	    if (isPathParam) {
	      var nextSegment = segments[i + 1];
	      if (squash === false) {
	        if (encoded != null) {
	          if (isArray(encoded)) {
	            result += map(encoded, encodeDashes).join("-");
	          } else {
	            result += encodeURIComponent(encoded);
	          }
	        }
	        result += nextSegment;
	      } else if (squash === true) {
	        var capture = result.match(/\/$/) ? /\/?(.*)/ : /(.*)/;
	        result += nextSegment.match(capture)[1];
	      } else if (isString(squash)) {
	        result += squash + nextSegment;
	      }
	    } else {
	      if (encoded == null || (isDefaultValue && squash !== false)) continue;
	      if (!isArray(encoded)) encoded = [ encoded ];
	      encoded = map(encoded, encodeURIComponent).join('&' + name + '=');
	      result += (search ? '&' : '?') + (name + '=' + encoded);
	      search = true;
	    }
	  }

	  return result;
	};

	/**
	 * @ngdoc object
	 * @name ui.router.util.type:Type
	 *
	 * @description
	 * Implements an interface to define custom parameter types that can be decoded from and encoded to
	 * string parameters matched in a URL. Used by {@link ui.router.util.type:UrlMatcher `UrlMatcher`}
	 * objects when matching or formatting URLs, or comparing or validating parameter values.
	 *
	 * See {@link ui.router.util.$urlMatcherFactory#methods_type `$urlMatcherFactory#type()`} for more
	 * information on registering custom types.
	 *
	 * @param {Object} config  A configuration object which contains the custom type definition.  The object's
	 *        properties will override the default methods and/or pattern in `Type`'s public interface.
	 * @example
	 * <pre>
	 * {
	 *   decode: function(val) { return parseInt(val, 10); },
	 *   encode: function(val) { return val && val.toString(); },
	 *   equals: function(a, b) { return this.is(a) && a === b; },
	 *   is: function(val) { return angular.isNumber(val) isFinite(val) && val % 1 === 0; },
	 *   pattern: /\d+/
	 * }
	 * </pre>
	 *
	 * @property {RegExp} pattern The regular expression pattern used to match values of this type when
	 *           coming from a substring of a URL.
	 *
	 * @returns {Object}  Returns a new `Type` object.
	 */
	function Type(config) {
	  extend(this, config);
	}

	/**
	 * @ngdoc function
	 * @name ui.router.util.type:Type#is
	 * @methodOf ui.router.util.type:Type
	 *
	 * @description
	 * Detects whether a value is of a particular type. Accepts a native (decoded) value
	 * and determines whether it matches the current `Type` object.
	 *
	 * @param {*} val  The value to check.
	 * @param {string} key  Optional. If the type check is happening in the context of a specific
	 *        {@link ui.router.util.type:UrlMatcher `UrlMatcher`} object, this is the name of the
	 *        parameter in which `val` is stored. Can be used for meta-programming of `Type` objects.
	 * @returns {Boolean}  Returns `true` if the value matches the type, otherwise `false`.
	 */
	Type.prototype.is = function(val, key) {
	  return true;
	};

	/**
	 * @ngdoc function
	 * @name ui.router.util.type:Type#encode
	 * @methodOf ui.router.util.type:Type
	 *
	 * @description
	 * Encodes a custom/native type value to a string that can be embedded in a URL. Note that the
	 * return value does *not* need to be URL-safe (i.e. passed through `encodeURIComponent()`), it
	 * only needs to be a representation of `val` that has been coerced to a string.
	 *
	 * @param {*} val  The value to encode.
	 * @param {string} key  The name of the parameter in which `val` is stored. Can be used for
	 *        meta-programming of `Type` objects.
	 * @returns {string}  Returns a string representation of `val` that can be encoded in a URL.
	 */
	Type.prototype.encode = function(val, key) {
	  return val;
	};

	/**
	 * @ngdoc function
	 * @name ui.router.util.type:Type#decode
	 * @methodOf ui.router.util.type:Type
	 *
	 * @description
	 * Converts a parameter value (from URL string or transition param) to a custom/native value.
	 *
	 * @param {string} val  The URL parameter value to decode.
	 * @param {string} key  The name of the parameter in which `val` is stored. Can be used for
	 *        meta-programming of `Type` objects.
	 * @returns {*}  Returns a custom representation of the URL parameter value.
	 */
	Type.prototype.decode = function(val, key) {
	  return val;
	};

	/**
	 * @ngdoc function
	 * @name ui.router.util.type:Type#equals
	 * @methodOf ui.router.util.type:Type
	 *
	 * @description
	 * Determines whether two decoded values are equivalent.
	 *
	 * @param {*} a  A value to compare against.
	 * @param {*} b  A value to compare against.
	 * @returns {Boolean}  Returns `true` if the values are equivalent/equal, otherwise `false`.
	 */
	Type.prototype.equals = function(a, b) {
	  return a == b;
	};

	Type.prototype.$subPattern = function() {
	  var sub = this.pattern.toString();
	  return sub.substr(1, sub.length - 2);
	};

	Type.prototype.pattern = /.*/;

	Type.prototype.toString = function() { return "{Type:" + this.name + "}"; };

	/** Given an encoded string, or a decoded object, returns a decoded object */
	Type.prototype.$normalize = function(val) {
	  return this.is(val) ? val : this.decode(val);
	};

	/*
	 * Wraps an existing custom Type as an array of Type, depending on 'mode'.
	 * e.g.:
	 * - urlmatcher pattern "/path?{queryParam[]:int}"
	 * - url: "/path?queryParam=1&queryParam=2
	 * - $stateParams.queryParam will be [1, 2]
	 * if `mode` is "auto", then
	 * - url: "/path?queryParam=1 will create $stateParams.queryParam: 1
	 * - url: "/path?queryParam=1&queryParam=2 will create $stateParams.queryParam: [1, 2]
	 */
	Type.prototype.$asArray = function(mode, isSearch) {
	  if (!mode) return this;
	  if (mode === "auto" && !isSearch) throw new Error("'auto' array mode is for query parameters only");

	  function ArrayType(type, mode) {
	    function bindTo(type, callbackName) {
	      return function() {
	        return type[callbackName].apply(type, arguments);
	      };
	    }

	    // Wrap non-array value as array
	    function arrayWrap(val) { return isArray(val) ? val : (isDefined(val) ? [ val ] : []); }
	    // Unwrap array value for "auto" mode. Return undefined for empty array.
	    function arrayUnwrap(val) {
	      switch(val.length) {
	        case 0: return undefined;
	        case 1: return mode === "auto" ? val[0] : val;
	        default: return val;
	      }
	    }
	    function falsey(val) { return !val; }

	    // Wraps type (.is/.encode/.decode) functions to operate on each value of an array
	    function arrayHandler(callback, allTruthyMode) {
	      return function handleArray(val) {
	        val = arrayWrap(val);
	        var result = map(val, callback);
	        if (allTruthyMode === true)
	          return filter(result, falsey).length === 0;
	        return arrayUnwrap(result);
	      };
	    }

	    // Wraps type (.equals) functions to operate on each value of an array
	    function arrayEqualsHandler(callback) {
	      return function handleArray(val1, val2) {
	        var left = arrayWrap(val1), right = arrayWrap(val2);
	        if (left.length !== right.length) return false;
	        for (var i = 0; i < left.length; i++) {
	          if (!callback(left[i], right[i])) return false;
	        }
	        return true;
	      };
	    }

	    this.encode = arrayHandler(bindTo(type, 'encode'));
	    this.decode = arrayHandler(bindTo(type, 'decode'));
	    this.is     = arrayHandler(bindTo(type, 'is'), true);
	    this.equals = arrayEqualsHandler(bindTo(type, 'equals'));
	    this.pattern = type.pattern;
	    this.$normalize = arrayHandler(bindTo(type, '$normalize'));
	    this.name = type.name;
	    this.$arrayMode = mode;
	  }

	  return new ArrayType(this, mode);
	};



	/**
	 * @ngdoc object
	 * @name ui.router.util.$urlMatcherFactory
	 *
	 * @description
	 * Factory for {@link ui.router.util.type:UrlMatcher `UrlMatcher`} instances. The factory
	 * is also available to providers under the name `$urlMatcherFactoryProvider`.
	 */
	function $UrlMatcherFactory() {
	  $$UMFP = this;

	  var isCaseInsensitive = false, isStrictMode = true, defaultSquashPolicy = false;

	  function valToString(val) { return val != null ? val.toString().replace(/\//g, "%2F") : val; }
	  function valFromString(val) { return val != null ? val.toString().replace(/%2F/g, "/") : val; }

	  var $types = {}, enqueue = true, typeQueue = [], injector, defaultTypes = {
	    string: {
	      encode: valToString,
	      decode: valFromString,
	      // TODO: in 1.0, make string .is() return false if value is undefined/null by default.
	      // In 0.2.x, string params are optional by default for backwards compat
	      is: function(val) { return val == null || !isDefined(val) || typeof val === "string"; },
	      pattern: /[^/]*/
	    },
	    int: {
	      encode: valToString,
	      decode: function(val) { return parseInt(val, 10); },
	      is: function(val) { return isDefined(val) && this.decode(val.toString()) === val; },
	      pattern: /\d+/
	    },
	    bool: {
	      encode: function(val) { return val ? 1 : 0; },
	      decode: function(val) { return parseInt(val, 10) !== 0; },
	      is: function(val) { return val === true || val === false; },
	      pattern: /0|1/
	    },
	    date: {
	      encode: function (val) {
	        if (!this.is(val))
	          return undefined;
	        return [ val.getFullYear(),
	          ('0' + (val.getMonth() + 1)).slice(-2),
	          ('0' + val.getDate()).slice(-2)
	        ].join("-");
	      },
	      decode: function (val) {
	        if (this.is(val)) return val;
	        var match = this.capture.exec(val);
	        return match ? new Date(match[1], match[2] - 1, match[3]) : undefined;
	      },
	      is: function(val) { return val instanceof Date && !isNaN(val.valueOf()); },
	      equals: function (a, b) { return this.is(a) && this.is(b) && a.toISOString() === b.toISOString(); },
	      pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
	      capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
	    },
	    json: {
	      encode: angular.toJson,
	      decode: angular.fromJson,
	      is: angular.isObject,
	      equals: angular.equals,
	      pattern: /[^/]*/
	    },
	    any: { // does not encode/decode
	      encode: angular.identity,
	      decode: angular.identity,
	      equals: angular.equals,
	      pattern: /.*/
	    }
	  };

	  function getDefaultConfig() {
	    return {
	      strict: isStrictMode,
	      caseInsensitive: isCaseInsensitive
	    };
	  }

	  function isInjectable(value) {
	    return (isFunction(value) || (isArray(value) && isFunction(value[value.length - 1])));
	  }

	  /**
	   * [Internal] Get the default value of a parameter, which may be an injectable function.
	   */
	  $UrlMatcherFactory.$$getDefaultValue = function(config) {
	    if (!isInjectable(config.value)) return config.value;
	    if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
	    return injector.invoke(config.value);
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#caseInsensitive
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Defines whether URL matching should be case sensitive (the default behavior), or not.
	   *
	   * @param {boolean} value `false` to match URL in a case sensitive manner; otherwise `true`;
	   * @returns {boolean} the current value of caseInsensitive
	   */
	  this.caseInsensitive = function(value) {
	    if (isDefined(value))
	      isCaseInsensitive = value;
	    return isCaseInsensitive;
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#strictMode
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Defines whether URLs should match trailing slashes, or not (the default behavior).
	   *
	   * @param {boolean=} value `false` to match trailing slashes in URLs, otherwise `true`.
	   * @returns {boolean} the current value of strictMode
	   */
	  this.strictMode = function(value) {
	    if (isDefined(value))
	      isStrictMode = value;
	    return isStrictMode;
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#defaultSquashPolicy
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Sets the default behavior when generating or matching URLs with default parameter values.
	   *
	   * @param {string} value A string that defines the default parameter URL squashing behavior.
	   *    `nosquash`: When generating an href with a default parameter value, do not squash the parameter value from the URL
	   *    `slash`: When generating an href with a default parameter value, squash (remove) the parameter value, and, if the
	   *             parameter is surrounded by slashes, squash (remove) one slash from the URL
	   *    any other string, e.g. "~": When generating an href with a default parameter value, squash (remove)
	   *             the parameter value from the URL and replace it with this string.
	   */
	  this.defaultSquashPolicy = function(value) {
	    if (!isDefined(value)) return defaultSquashPolicy;
	    if (value !== true && value !== false && !isString(value))
	      throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
	    defaultSquashPolicy = value;
	    return value;
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#compile
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Creates a {@link ui.router.util.type:UrlMatcher `UrlMatcher`} for the specified pattern.
	   *
	   * @param {string} pattern  The URL pattern.
	   * @param {Object} config  The config object hash.
	   * @returns {UrlMatcher}  The UrlMatcher.
	   */
	  this.compile = function (pattern, config) {
	    return new UrlMatcher(pattern, extend(getDefaultConfig(), config));
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#isMatcher
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Returns true if the specified object is a `UrlMatcher`, or false otherwise.
	   *
	   * @param {Object} object  The object to perform the type check against.
	   * @returns {Boolean}  Returns `true` if the object matches the `UrlMatcher` interface, by
	   *          implementing all the same methods.
	   */
	  this.isMatcher = function (o) {
	    if (!isObject(o)) return false;
	    var result = true;

	    forEach(UrlMatcher.prototype, function(val, name) {
	      if (isFunction(val)) {
	        result = result && (isDefined(o[name]) && isFunction(o[name]));
	      }
	    });
	    return result;
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#type
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Registers a custom {@link ui.router.util.type:Type `Type`} object that can be used to
	   * generate URLs with typed parameters.
	   *
	   * @param {string} name  The type name.
	   * @param {Object|Function} definition   The type definition. See
	   *        {@link ui.router.util.type:Type `Type`} for information on the values accepted.
	   * @param {Object|Function} definitionFn (optional) A function that is injected before the app
	   *        runtime starts.  The result of this function is merged into the existing `definition`.
	   *        See {@link ui.router.util.type:Type `Type`} for information on the values accepted.
	   *
	   * @returns {Object}  Returns `$urlMatcherFactoryProvider`.
	   *
	   * @example
	   * This is a simple example of a custom type that encodes and decodes items from an
	   * array, using the array index as the URL-encoded value:
	   *
	   * <pre>
	   * var list = ['John', 'Paul', 'George', 'Ringo'];
	   *
	   * $urlMatcherFactoryProvider.type('listItem', {
	   *   encode: function(item) {
	   *     // Represent the list item in the URL using its corresponding index
	   *     return list.indexOf(item);
	   *   },
	   *   decode: function(item) {
	   *     // Look up the list item by index
	   *     return list[parseInt(item, 10)];
	   *   },
	   *   is: function(item) {
	   *     // Ensure the item is valid by checking to see that it appears
	   *     // in the list
	   *     return list.indexOf(item) > -1;
	   *   }
	   * });
	   *
	   * $stateProvider.state('list', {
	   *   url: "/list/{item:listItem}",
	   *   controller: function($scope, $stateParams) {
	   *     console.log($stateParams.item);
	   *   }
	   * });
	   *
	   * // ...
	   *
	   * // Changes URL to '/list/3', logs "Ringo" to the console
	   * $state.go('list', { item: "Ringo" });
	   * </pre>
	   *
	   * This is a more complex example of a type that relies on dependency injection to
	   * interact with services, and uses the parameter name from the URL to infer how to
	   * handle encoding and decoding parameter values:
	   *
	   * <pre>
	   * // Defines a custom type that gets a value from a service,
	   * // where each service gets different types of values from
	   * // a backend API:
	   * $urlMatcherFactoryProvider.type('dbObject', {}, function(Users, Posts) {
	   *
	   *   // Matches up services to URL parameter names
	   *   var services = {
	   *     user: Users,
	   *     post: Posts
	   *   };
	   *
	   *   return {
	   *     encode: function(object) {
	   *       // Represent the object in the URL using its unique ID
	   *       return object.id;
	   *     },
	   *     decode: function(value, key) {
	   *       // Look up the object by ID, using the parameter
	   *       // name (key) to call the correct service
	   *       return services[key].findById(value);
	   *     },
	   *     is: function(object, key) {
	   *       // Check that object is a valid dbObject
	   *       return angular.isObject(object) && object.id && services[key];
	   *     }
	   *     equals: function(a, b) {
	   *       // Check the equality of decoded objects by comparing
	   *       // their unique IDs
	   *       return a.id === b.id;
	   *     }
	   *   };
	   * });
	   *
	   * // In a config() block, you can then attach URLs with
	   * // type-annotated parameters:
	   * $stateProvider.state('users', {
	   *   url: "/users",
	   *   // ...
	   * }).state('users.item', {
	   *   url: "/{user:dbObject}",
	   *   controller: function($scope, $stateParams) {
	   *     // $stateParams.user will now be an object returned from
	   *     // the Users service
	   *   },
	   *   // ...
	   * });
	   * </pre>
	   */
	  this.type = function (name, definition, definitionFn) {
	    if (!isDefined(definition)) return $types[name];
	    if ($types.hasOwnProperty(name)) throw new Error("A type named '" + name + "' has already been defined.");

	    $types[name] = new Type(extend({ name: name }, definition));
	    if (definitionFn) {
	      typeQueue.push({ name: name, def: definitionFn });
	      if (!enqueue) flushTypeQueue();
	    }
	    return this;
	  };

	  // `flushTypeQueue()` waits until `$urlMatcherFactory` is injected before invoking the queued `definitionFn`s
	  function flushTypeQueue() {
	    while(typeQueue.length) {
	      var type = typeQueue.shift();
	      if (type.pattern) throw new Error("You cannot override a type's .pattern at runtime.");
	      angular.extend($types[type.name], injector.invoke(type.def));
	    }
	  }

	  // Register default types. Store them in the prototype of $types.
	  forEach(defaultTypes, function(type, name) { $types[name] = new Type(extend({name: name}, type)); });
	  $types = inherit($types, {});

	  /* No need to document $get, since it returns this */
	  this.$get = ['$injector', function ($injector) {
	    injector = $injector;
	    enqueue = false;
	    flushTypeQueue();

	    forEach(defaultTypes, function(type, name) {
	      if (!$types[name]) $types[name] = new Type(type);
	    });
	    return this;
	  }];

	  this.Param = function Param(id, type, config, location) {
	    var self = this;
	    config = unwrapShorthand(config);
	    type = getType(config, type, location);
	    var arrayMode = getArrayMode();
	    type = arrayMode ? type.$asArray(arrayMode, location === "search") : type;
	    if (type.name === "string" && !arrayMode && location === "path" && config.value === undefined)
	      config.value = ""; // for 0.2.x; in 0.3.0+ do not automatically default to ""
	    var isOptional = config.value !== undefined;
	    var squash = getSquashPolicy(config, isOptional);
	    var replace = getReplace(config, arrayMode, isOptional, squash);

	    function unwrapShorthand(config) {
	      var keys = isObject(config) ? objectKeys(config) : [];
	      var isShorthand = indexOf(keys, "value") === -1 && indexOf(keys, "type") === -1 &&
	                        indexOf(keys, "squash") === -1 && indexOf(keys, "array") === -1;
	      if (isShorthand) config = { value: config };
	      config.$$fn = isInjectable(config.value) ? config.value : function () { return config.value; };
	      return config;
	    }

	    function getType(config, urlType, location) {
	      if (config.type && urlType) throw new Error("Param '"+id+"' has two type configurations.");
	      if (urlType) return urlType;
	      if (!config.type) return (location === "config" ? $types.any : $types.string);
	      return config.type instanceof Type ? config.type : new Type(config.type);
	    }

	    // array config: param name (param[]) overrides default settings.  explicit config overrides param name.
	    function getArrayMode() {
	      var arrayDefaults = { array: (location === "search" ? "auto" : false) };
	      var arrayParamNomenclature = id.match(/\[\]$/) ? { array: true } : {};
	      return extend(arrayDefaults, arrayParamNomenclature, config).array;
	    }

	    /**
	     * returns false, true, or the squash value to indicate the "default parameter url squash policy".
	     */
	    function getSquashPolicy(config, isOptional) {
	      var squash = config.squash;
	      if (!isOptional || squash === false) return false;
	      if (!isDefined(squash) || squash == null) return defaultSquashPolicy;
	      if (squash === true || isString(squash)) return squash;
	      throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string");
	    }

	    function getReplace(config, arrayMode, isOptional, squash) {
	      var replace, configuredKeys, defaultPolicy = [
	        { from: "",   to: (isOptional || arrayMode ? undefined : "") },
	        { from: null, to: (isOptional || arrayMode ? undefined : "") }
	      ];
	      replace = isArray(config.replace) ? config.replace : [];
	      if (isString(squash))
	        replace.push({ from: squash, to: undefined });
	      configuredKeys = map(replace, function(item) { return item.from; } );
	      return filter(defaultPolicy, function(item) { return indexOf(configuredKeys, item.from) === -1; }).concat(replace);
	    }

	    /**
	     * [Internal] Get the default value of a parameter, which may be an injectable function.
	     */
	    function $$getDefaultValue() {
	      if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
	      var defaultValue = injector.invoke(config.$$fn);
	      if (defaultValue !== null && defaultValue !== undefined && !self.type.is(defaultValue))
	        throw new Error("Default value (" + defaultValue + ") for parameter '" + self.id + "' is not an instance of Type (" + self.type.name + ")");
	      return defaultValue;
	    }

	    /**
	     * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
	     * default value, which may be the result of an injectable function.
	     */
	    function $value(value) {
	      function hasReplaceVal(val) { return function(obj) { return obj.from === val; }; }
	      function $replace(value) {
	        var replacement = map(filter(self.replace, hasReplaceVal(value)), function(obj) { return obj.to; });
	        return replacement.length ? replacement[0] : value;
	      }
	      value = $replace(value);
	      return !isDefined(value) ? $$getDefaultValue() : self.type.$normalize(value);
	    }

	    function toString() { return "{Param:" + id + " " + type + " squash: '" + squash + "' optional: " + isOptional + "}"; }

	    extend(this, {
	      id: id,
	      type: type,
	      location: location,
	      array: arrayMode,
	      squash: squash,
	      replace: replace,
	      isOptional: isOptional,
	      value: $value,
	      dynamic: undefined,
	      config: config,
	      toString: toString
	    });
	  };

	  function ParamSet(params) {
	    extend(this, params || {});
	  }

	  ParamSet.prototype = {
	    $$new: function() {
	      return inherit(this, extend(new ParamSet(), { $$parent: this}));
	    },
	    $$keys: function () {
	      var keys = [], chain = [], parent = this,
	        ignore = objectKeys(ParamSet.prototype);
	      while (parent) { chain.push(parent); parent = parent.$$parent; }
	      chain.reverse();
	      forEach(chain, function(paramset) {
	        forEach(objectKeys(paramset), function(key) {
	            if (indexOf(keys, key) === -1 && indexOf(ignore, key) === -1) keys.push(key);
	        });
	      });
	      return keys;
	    },
	    $$values: function(paramValues) {
	      var values = {}, self = this;
	      forEach(self.$$keys(), function(key) {
	        values[key] = self[key].value(paramValues && paramValues[key]);
	      });
	      return values;
	    },
	    $$equals: function(paramValues1, paramValues2) {
	      var equal = true, self = this;
	      forEach(self.$$keys(), function(key) {
	        var left = paramValues1 && paramValues1[key], right = paramValues2 && paramValues2[key];
	        if (!self[key].type.equals(left, right)) equal = false;
	      });
	      return equal;
	    },
	    $$validates: function $$validate(paramValues) {
	      var keys = this.$$keys(), i, param, rawVal, normalized, encoded;
	      for (i = 0; i < keys.length; i++) {
	        param = this[keys[i]];
	        rawVal = paramValues[keys[i]];
	        if ((rawVal === undefined || rawVal === null) && param.isOptional)
	          break; // There was no parameter value, but the param is optional
	        normalized = param.type.$normalize(rawVal);
	        if (!param.type.is(normalized))
	          return false; // The value was not of the correct Type, and could not be decoded to the correct Type
	        encoded = param.type.encode(normalized);
	        if (angular.isString(encoded) && !param.type.pattern.exec(encoded))
	          return false; // The value was of the correct type, but when encoded, did not match the Type's regexp
	      }
	      return true;
	    },
	    $$parent: undefined
	  };

	  this.ParamSet = ParamSet;
	}

	// Register as a provider so it's available to other providers
	angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);
	angular.module('ui.router.util').run(['$urlMatcherFactory', function($urlMatcherFactory) { }]);

	/**
	 * @ngdoc object
	 * @name ui.router.router.$urlRouterProvider
	 *
	 * @requires ui.router.util.$urlMatcherFactoryProvider
	 * @requires $locationProvider
	 *
	 * @description
	 * `$urlRouterProvider` has the responsibility of watching `$location`. 
	 * When `$location` changes it runs through a list of rules one by one until a 
	 * match is found. `$urlRouterProvider` is used behind the scenes anytime you specify 
	 * a url in a state configuration. All urls are compiled into a UrlMatcher object.
	 *
	 * There are several methods on `$urlRouterProvider` that make it useful to use directly
	 * in your module config.
	 */
	$UrlRouterProvider.$inject = ['$locationProvider', '$urlMatcherFactoryProvider'];
	function $UrlRouterProvider(   $locationProvider,   $urlMatcherFactory) {
	  var rules = [], otherwise = null, interceptDeferred = false, listener;

	  // Returns a string that is a prefix of all strings matching the RegExp
	  function regExpPrefix(re) {
	    var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
	    return (prefix != null) ? prefix[1].replace(/\\(.)/g, "$1") : '';
	  }

	  // Interpolates matched values into a String.replace()-style pattern
	  function interpolate(pattern, match) {
	    return pattern.replace(/\$(\$|\d{1,2})/, function (m, what) {
	      return match[what === '$' ? 0 : Number(what)];
	    });
	  }

	  /**
	   * @ngdoc function
	   * @name ui.router.router.$urlRouterProvider#rule
	   * @methodOf ui.router.router.$urlRouterProvider
	   *
	   * @description
	   * Defines rules that are used by `$urlRouterProvider` to find matches for
	   * specific URLs.
	   *
	   * @example
	   * <pre>
	   * var app = angular.module('app', ['ui.router.router']);
	   *
	   * app.config(function ($urlRouterProvider) {
	   *   // Here's an example of how you might allow case insensitive urls
	   *   $urlRouterProvider.rule(function ($injector, $location) {
	   *     var path = $location.path(),
	   *         normalized = path.toLowerCase();
	   *
	   *     if (path !== normalized) {
	   *       return normalized;
	   *     }
	   *   });
	   * });
	   * </pre>
	   *
	   * @param {object} rule Handler function that takes `$injector` and `$location`
	   * services as arguments. You can use them to return a valid path as a string.
	   *
	   * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
	   */
	  this.rule = function (rule) {
	    if (!isFunction(rule)) throw new Error("'rule' must be a function");
	    rules.push(rule);
	    return this;
	  };

	  /**
	   * @ngdoc object
	   * @name ui.router.router.$urlRouterProvider#otherwise
	   * @methodOf ui.router.router.$urlRouterProvider
	   *
	   * @description
	   * Defines a path that is used when an invalid route is requested.
	   *
	   * @example
	   * <pre>
	   * var app = angular.module('app', ['ui.router.router']);
	   *
	   * app.config(function ($urlRouterProvider) {
	   *   // if the path doesn't match any of the urls you configured
	   *   // otherwise will take care of routing the user to the
	   *   // specified url
	   *   $urlRouterProvider.otherwise('/index');
	   *
	   *   // Example of using function rule as param
	   *   $urlRouterProvider.otherwise(function ($injector, $location) {
	   *     return '/a/valid/url';
	   *   });
	   * });
	   * </pre>
	   *
	   * @param {string|object} rule The url path you want to redirect to or a function 
	   * rule that returns the url path. The function version is passed two params: 
	   * `$injector` and `$location` services, and must return a url string.
	   *
	   * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
	   */
	  this.otherwise = function (rule) {
	    if (isString(rule)) {
	      var redirect = rule;
	      rule = function () { return redirect; };
	    }
	    else if (!isFunction(rule)) throw new Error("'rule' must be a function");
	    otherwise = rule;
	    return this;
	  };


	  function handleIfMatch($injector, handler, match) {
	    if (!match) return false;
	    var result = $injector.invoke(handler, handler, { $match: match });
	    return isDefined(result) ? result : true;
	  }

	  /**
	   * @ngdoc function
	   * @name ui.router.router.$urlRouterProvider#when
	   * @methodOf ui.router.router.$urlRouterProvider
	   *
	   * @description
	   * Registers a handler for a given url matching. if handle is a string, it is
	   * treated as a redirect, and is interpolated according to the syntax of match
	   * (i.e. like `String.replace()` for `RegExp`, or like a `UrlMatcher` pattern otherwise).
	   *
	   * If the handler is a function, it is injectable. It gets invoked if `$location`
	   * matches. You have the option of inject the match object as `$match`.
	   *
	   * The handler can return
	   *
	   * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
	   *   will continue trying to find another one that matches.
	   * - **string** which is treated as a redirect and passed to `$location.url()`
	   * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
	   *
	   * @example
	   * <pre>
	   * var app = angular.module('app', ['ui.router.router']);
	   *
	   * app.config(function ($urlRouterProvider) {
	   *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
	   *     if ($state.$current.navigable !== state ||
	   *         !equalForKeys($match, $stateParams) {
	   *      $state.transitionTo(state, $match, false);
	   *     }
	   *   });
	   * });
	   * </pre>
	   *
	   * @param {string|object} what The incoming path that you want to redirect.
	   * @param {string|object} handler The path you want to redirect your user to.
	   */
	  this.when = function (what, handler) {
	    var redirect, handlerIsString = isString(handler);
	    if (isString(what)) what = $urlMatcherFactory.compile(what);

	    if (!handlerIsString && !isFunction(handler) && !isArray(handler))
	      throw new Error("invalid 'handler' in when()");

	    var strategies = {
	      matcher: function (what, handler) {
	        if (handlerIsString) {
	          redirect = $urlMatcherFactory.compile(handler);
	          handler = ['$match', function ($match) { return redirect.format($match); }];
	        }
	        return extend(function ($injector, $location) {
	          return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
	        }, {
	          prefix: isString(what.prefix) ? what.prefix : ''
	        });
	      },
	      regex: function (what, handler) {
	        if (what.global || what.sticky) throw new Error("when() RegExp must not be global or sticky");

	        if (handlerIsString) {
	          redirect = handler;
	          handler = ['$match', function ($match) { return interpolate(redirect, $match); }];
	        }
	        return extend(function ($injector, $location) {
	          return handleIfMatch($injector, handler, what.exec($location.path()));
	        }, {
	          prefix: regExpPrefix(what)
	        });
	      }
	    };

	    var check = { matcher: $urlMatcherFactory.isMatcher(what), regex: what instanceof RegExp };

	    for (var n in check) {
	      if (check[n]) return this.rule(strategies[n](what, handler));
	    }

	    throw new Error("invalid 'what' in when()");
	  };

	  /**
	   * @ngdoc function
	   * @name ui.router.router.$urlRouterProvider#deferIntercept
	   * @methodOf ui.router.router.$urlRouterProvider
	   *
	   * @description
	   * Disables (or enables) deferring location change interception.
	   *
	   * If you wish to customize the behavior of syncing the URL (for example, if you wish to
	   * defer a transition but maintain the current URL), call this method at configuration time.
	   * Then, at run time, call `$urlRouter.listen()` after you have configured your own
	   * `$locationChangeSuccess` event handler.
	   *
	   * @example
	   * <pre>
	   * var app = angular.module('app', ['ui.router.router']);
	   *
	   * app.config(function ($urlRouterProvider) {
	   *
	   *   // Prevent $urlRouter from automatically intercepting URL changes;
	   *   // this allows you to configure custom behavior in between
	   *   // location changes and route synchronization:
	   *   $urlRouterProvider.deferIntercept();
	   *
	   * }).run(function ($rootScope, $urlRouter, UserService) {
	   *
	   *   $rootScope.$on('$locationChangeSuccess', function(e) {
	   *     // UserService is an example service for managing user state
	   *     if (UserService.isLoggedIn()) return;
	   *
	   *     // Prevent $urlRouter's default handler from firing
	   *     e.preventDefault();
	   *
	   *     UserService.handleLogin().then(function() {
	   *       // Once the user has logged in, sync the current URL
	   *       // to the router:
	   *       $urlRouter.sync();
	   *     });
	   *   });
	   *
	   *   // Configures $urlRouter's listener *after* your custom listener
	   *   $urlRouter.listen();
	   * });
	   * </pre>
	   *
	   * @param {boolean} defer Indicates whether to defer location change interception. Passing
	            no parameter is equivalent to `true`.
	   */
	  this.deferIntercept = function (defer) {
	    if (defer === undefined) defer = true;
	    interceptDeferred = defer;
	  };

	  /**
	   * @ngdoc object
	   * @name ui.router.router.$urlRouter
	   *
	   * @requires $location
	   * @requires $rootScope
	   * @requires $injector
	   * @requires $browser
	   *
	   * @description
	   *
	   */
	  this.$get = $get;
	  $get.$inject = ['$location', '$rootScope', '$injector', '$browser'];
	  function $get(   $location,   $rootScope,   $injector,   $browser) {

	    var baseHref = $browser.baseHref(), location = $location.url(), lastPushedUrl;

	    function appendBasePath(url, isHtml5, absolute) {
	      if (baseHref === '/') return url;
	      if (isHtml5) return baseHref.slice(0, -1) + url;
	      if (absolute) return baseHref.slice(1) + url;
	      return url;
	    }

	    // TODO: Optimize groups of rules with non-empty prefix into some sort of decision tree
	    function update(evt) {
	      if (evt && evt.defaultPrevented) return;
	      var ignoreUpdate = lastPushedUrl && $location.url() === lastPushedUrl;
	      lastPushedUrl = undefined;
	      // TODO: Re-implement this in 1.0 for https://github.com/angular-ui/ui-router/issues/1573
	      //if (ignoreUpdate) return true;

	      function check(rule) {
	        var handled = rule($injector, $location);

	        if (!handled) return false;
	        if (isString(handled)) $location.replace().url(handled);
	        return true;
	      }
	      var n = rules.length, i;

	      for (i = 0; i < n; i++) {
	        if (check(rules[i])) return;
	      }
	      // always check otherwise last to allow dynamic updates to the set of rules
	      if (otherwise) check(otherwise);
	    }

	    function listen() {
	      listener = listener || $rootScope.$on('$locationChangeSuccess', update);
	      return listener;
	    }

	    if (!interceptDeferred) listen();

	    return {
	      /**
	       * @ngdoc function
	       * @name ui.router.router.$urlRouter#sync
	       * @methodOf ui.router.router.$urlRouter
	       *
	       * @description
	       * Triggers an update; the same update that happens when the address bar url changes, aka `$locationChangeSuccess`.
	       * This method is useful when you need to use `preventDefault()` on the `$locationChangeSuccess` event,
	       * perform some custom logic (route protection, auth, config, redirection, etc) and then finally proceed
	       * with the transition by calling `$urlRouter.sync()`.
	       *
	       * @example
	       * <pre>
	       * angular.module('app', ['ui.router'])
	       *   .run(function($rootScope, $urlRouter) {
	       *     $rootScope.$on('$locationChangeSuccess', function(evt) {
	       *       // Halt state change from even starting
	       *       evt.preventDefault();
	       *       // Perform custom logic
	       *       var meetsRequirement = ...
	       *       // Continue with the update and state transition if logic allows
	       *       if (meetsRequirement) $urlRouter.sync();
	       *     });
	       * });
	       * </pre>
	       */
	      sync: function() {
	        update();
	      },

	      listen: function() {
	        return listen();
	      },

	      update: function(read) {
	        if (read) {
	          location = $location.url();
	          return;
	        }
	        if ($location.url() === location) return;

	        $location.url(location);
	        $location.replace();
	      },

	      push: function(urlMatcher, params, options) {
	         var url = urlMatcher.format(params || {});

	        // Handle the special hash param, if needed
	        if (url !== null && params && params['#']) {
	            url += '#' + params['#'];
	        }

	        $location.url(url);
	        lastPushedUrl = options && options.$$avoidResync ? $location.url() : undefined;
	        if (options && options.replace) $location.replace();
	      },

	      /**
	       * @ngdoc function
	       * @name ui.router.router.$urlRouter#href
	       * @methodOf ui.router.router.$urlRouter
	       *
	       * @description
	       * A URL generation method that returns the compiled URL for a given
	       * {@link ui.router.util.type:UrlMatcher `UrlMatcher`}, populated with the provided parameters.
	       *
	       * @example
	       * <pre>
	       * $bob = $urlRouter.href(new UrlMatcher("/about/:person"), {
	       *   person: "bob"
	       * });
	       * // $bob == "/about/bob";
	       * </pre>
	       *
	       * @param {UrlMatcher} urlMatcher The `UrlMatcher` object which is used as the template of the URL to generate.
	       * @param {object=} params An object of parameter values to fill the matcher's required parameters.
	       * @param {object=} options Options object. The options are:
	       *
	       * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
	       *
	       * @returns {string} Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
	       */
	      href: function(urlMatcher, params, options) {
	        if (!urlMatcher.validates(params)) return null;

	        var isHtml5 = $locationProvider.html5Mode();
	        if (angular.isObject(isHtml5)) {
	          isHtml5 = isHtml5.enabled;
	        }
	        
	        var url = urlMatcher.format(params);
	        options = options || {};

	        if (!isHtml5 && url !== null) {
	          url = "#" + $locationProvider.hashPrefix() + url;
	        }

	        // Handle special hash param, if needed
	        if (url !== null && params && params['#']) {
	          url += '#' + params['#'];
	        }

	        url = appendBasePath(url, isHtml5, options.absolute);

	        if (!options.absolute || !url) {
	          return url;
	        }

	        var slash = (!isHtml5 && url ? '/' : ''), port = $location.port();
	        port = (port === 80 || port === 443 ? '' : ':' + port);

	        return [$location.protocol(), '://', $location.host(), port, slash, url].join('');
	      }
	    };
	  }
	}

	angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);

	/**
	 * @ngdoc object
	 * @name ui.router.state.$stateProvider
	 *
	 * @requires ui.router.router.$urlRouterProvider
	 * @requires ui.router.util.$urlMatcherFactoryProvider
	 *
	 * @description
	 * The new `$stateProvider` works similar to Angular's v1 router, but it focuses purely
	 * on state.
	 *
	 * A state corresponds to a "place" in the application in terms of the overall UI and
	 * navigation. A state describes (via the controller / template / view properties) what
	 * the UI looks like and does at that place.
	 *
	 * States often have things in common, and the primary way of factoring out these
	 * commonalities in this model is via the state hierarchy, i.e. parent/child states aka
	 * nested states.
	 *
	 * The `$stateProvider` provides interfaces to declare these states for your app.
	 */
	$StateProvider.$inject = ['$urlRouterProvider', '$urlMatcherFactoryProvider'];
	function $StateProvider(   $urlRouterProvider,   $urlMatcherFactory) {

	  var root, states = {}, $state, queue = {}, abstractKey = 'abstract';

	  // Builds state properties from definition passed to registerState()
	  var stateBuilder = {

	    // Derive parent state from a hierarchical name only if 'parent' is not explicitly defined.
	    // state.children = [];
	    // if (parent) parent.children.push(state);
	    parent: function(state) {
	      if (isDefined(state.parent) && state.parent) return findState(state.parent);
	      // regex matches any valid composite state name
	      // would match "contact.list" but not "contacts"
	      var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
	      return compositeName ? findState(compositeName[1]) : root;
	    },

	    // inherit 'data' from parent and override by own values (if any)
	    data: function(state) {
	      if (state.parent && state.parent.data) {
	        state.data = state.self.data = extend({}, state.parent.data, state.data);
	      }
	      return state.data;
	    },

	    // Build a URLMatcher if necessary, either via a relative or absolute URL
	    url: function(state) {
	      var url = state.url, config = { params: state.params || {} };

	      if (isString(url)) {
	        if (url.charAt(0) == '^') return $urlMatcherFactory.compile(url.substring(1), config);
	        return (state.parent.navigable || root).url.concat(url, config);
	      }

	      if (!url || $urlMatcherFactory.isMatcher(url)) return url;
	      throw new Error("Invalid url '" + url + "' in state '" + state + "'");
	    },

	    // Keep track of the closest ancestor state that has a URL (i.e. is navigable)
	    navigable: function(state) {
	      return state.url ? state : (state.parent ? state.parent.navigable : null);
	    },

	    // Own parameters for this state. state.url.params is already built at this point. Create and add non-url params
	    ownParams: function(state) {
	      var params = state.url && state.url.params || new $$UMFP.ParamSet();
	      forEach(state.params || {}, function(config, id) {
	        if (!params[id]) params[id] = new $$UMFP.Param(id, null, config, "config");
	      });
	      return params;
	    },

	    // Derive parameters for this state and ensure they're a super-set of parent's parameters
	    params: function(state) {
	      return state.parent && state.parent.params ? extend(state.parent.params.$$new(), state.ownParams) : new $$UMFP.ParamSet();
	    },

	    // If there is no explicit multi-view configuration, make one up so we don't have
	    // to handle both cases in the view directive later. Note that having an explicit
	    // 'views' property will mean the default unnamed view properties are ignored. This
	    // is also a good time to resolve view names to absolute names, so everything is a
	    // straight lookup at link time.
	    views: function(state) {
	      var views = {};

	      forEach(isDefined(state.views) ? state.views : { '': state }, function (view, name) {
	        if (name.indexOf('@') < 0) name += '@' + state.parent.name;
	        views[name] = view;
	      });
	      return views;
	    },

	    // Keep a full path from the root down to this state as this is needed for state activation.
	    path: function(state) {
	      return state.parent ? state.parent.path.concat(state) : []; // exclude root from path
	    },

	    // Speed up $state.contains() as it's used a lot
	    includes: function(state) {
	      var includes = state.parent ? extend({}, state.parent.includes) : {};
	      includes[state.name] = true;
	      return includes;
	    },

	    $delegates: {}
	  };

	  function isRelative(stateName) {
	    return stateName.indexOf(".") === 0 || stateName.indexOf("^") === 0;
	  }

	  function findState(stateOrName, base) {
	    if (!stateOrName) return undefined;

	    var isStr = isString(stateOrName),
	        name  = isStr ? stateOrName : stateOrName.name,
	        path  = isRelative(name);

	    if (path) {
	      if (!base) throw new Error("No reference point given for path '"  + name + "'");
	      base = findState(base);
	      
	      var rel = name.split("."), i = 0, pathLength = rel.length, current = base;

	      for (; i < pathLength; i++) {
	        if (rel[i] === "" && i === 0) {
	          current = base;
	          continue;
	        }
	        if (rel[i] === "^") {
	          if (!current.parent) throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
	          current = current.parent;
	          continue;
	        }
	        break;
	      }
	      rel = rel.slice(i).join(".");
	      name = current.name + (current.name && rel ? "." : "") + rel;
	    }
	    var state = states[name];

	    if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
	      return state;
	    }
	    return undefined;
	  }

	  function queueState(parentName, state) {
	    if (!queue[parentName]) {
	      queue[parentName] = [];
	    }
	    queue[parentName].push(state);
	  }

	  function flushQueuedChildren(parentName) {
	    var queued = queue[parentName] || [];
	    while(queued.length) {
	      registerState(queued.shift());
	    }
	  }

	  function registerState(state) {
	    // Wrap a new object around the state so we can store our private details easily.
	    state = inherit(state, {
	      self: state,
	      resolve: state.resolve || {},
	      toString: function() { return this.name; }
	    });

	    var name = state.name;
	    if (!isString(name) || name.indexOf('@') >= 0) throw new Error("State must have a valid name");
	    if (states.hasOwnProperty(name)) throw new Error("State '" + name + "'' is already defined");

	    // Get parent name
	    var parentName = (name.indexOf('.') !== -1) ? name.substring(0, name.lastIndexOf('.'))
	        : (isString(state.parent)) ? state.parent
	        : (isObject(state.parent) && isString(state.parent.name)) ? state.parent.name
	        : '';

	    // If parent is not registered yet, add state to queue and register later
	    if (parentName && !states[parentName]) {
	      return queueState(parentName, state.self);
	    }

	    for (var key in stateBuilder) {
	      if (isFunction(stateBuilder[key])) state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
	    }
	    states[name] = state;

	    // Register the state in the global state list and with $urlRouter if necessary.
	    if (!state[abstractKey] && state.url) {
	      $urlRouterProvider.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
	        if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
	          $state.transitionTo(state, $match, { inherit: true, location: false });
	        }
	      }]);
	    }

	    // Register any queued children
	    flushQueuedChildren(name);

	    return state;
	  }

	  // Checks text to see if it looks like a glob.
	  function isGlob (text) {
	    return text.indexOf('*') > -1;
	  }

	  // Returns true if glob matches current $state name.
	  function doesStateMatchGlob (glob) {
	    var globSegments = glob.split('.'),
	        segments = $state.$current.name.split('.');

	    //match single stars
	    for (var i = 0, l = globSegments.length; i < l; i++) {
	      if (globSegments[i] === '*') {
	        segments[i] = '*';
	      }
	    }

	    //match greedy starts
	    if (globSegments[0] === '**') {
	       segments = segments.slice(indexOf(segments, globSegments[1]));
	       segments.unshift('**');
	    }
	    //match greedy ends
	    if (globSegments[globSegments.length - 1] === '**') {
	       segments.splice(indexOf(segments, globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE);
	       segments.push('**');
	    }

	    if (globSegments.length != segments.length) {
	      return false;
	    }

	    return segments.join('') === globSegments.join('');
	  }


	  // Implicit root state that is always active
	  root = registerState({
	    name: '',
	    url: '^',
	    views: null,
	    'abstract': true
	  });
	  root.navigable = null;


	  /**
	   * @ngdoc function
	   * @name ui.router.state.$stateProvider#decorator
	   * @methodOf ui.router.state.$stateProvider
	   *
	   * @description
	   * Allows you to extend (carefully) or override (at your own peril) the 
	   * `stateBuilder` object used internally by `$stateProvider`. This can be used 
	   * to add custom functionality to ui-router, for example inferring templateUrl 
	   * based on the state name.
	   *
	   * When passing only a name, it returns the current (original or decorated) builder
	   * function that matches `name`.
	   *
	   * The builder functions that can be decorated are listed below. Though not all
	   * necessarily have a good use case for decoration, that is up to you to decide.
	   *
	   * In addition, users can attach custom decorators, which will generate new 
	   * properties within the state's internal definition. There is currently no clear 
	   * use-case for this beyond accessing internal states (i.e. $state.$current), 
	   * however, expect this to become increasingly relevant as we introduce additional 
	   * meta-programming features.
	   *
	   * **Warning**: Decorators should not be interdependent because the order of 
	   * execution of the builder functions in non-deterministic. Builder functions 
	   * should only be dependent on the state definition object and super function.
	   *
	   *
	   * Existing builder functions and current return values:
	   *
	   * - **parent** `{object}` - returns the parent state object.
	   * - **data** `{object}` - returns state data, including any inherited data that is not
	   *   overridden by own values (if any).
	   * - **url** `{object}` - returns a {@link ui.router.util.type:UrlMatcher UrlMatcher}
	   *   or `null`.
	   * - **navigable** `{object}` - returns closest ancestor state that has a URL (aka is 
	   *   navigable).
	   * - **params** `{object}` - returns an array of state params that are ensured to 
	   *   be a super-set of parent's params.
	   * - **views** `{object}` - returns a views object where each key is an absolute view 
	   *   name (i.e. "viewName@stateName") and each value is the config object 
	   *   (template, controller) for the view. Even when you don't use the views object 
	   *   explicitly on a state config, one is still created for you internally.
	   *   So by decorating this builder function you have access to decorating template 
	   *   and controller properties.
	   * - **ownParams** `{object}` - returns an array of params that belong to the state, 
	   *   not including any params defined by ancestor states.
	   * - **path** `{string}` - returns the full path from the root down to this state. 
	   *   Needed for state activation.
	   * - **includes** `{object}` - returns an object that includes every state that 
	   *   would pass a `$state.includes()` test.
	   *
	   * @example
	   * <pre>
	   * // Override the internal 'views' builder with a function that takes the state
	   * // definition, and a reference to the internal function being overridden:
	   * $stateProvider.decorator('views', function (state, parent) {
	   *   var result = {},
	   *       views = parent(state);
	   *
	   *   angular.forEach(views, function (config, name) {
	   *     var autoName = (state.name + '.' + name).replace('.', '/');
	   *     config.templateUrl = config.templateUrl || '/partials/' + autoName + '.html';
	   *     result[name] = config;
	   *   });
	   *   return result;
	   * });
	   *
	   * $stateProvider.state('home', {
	   *   views: {
	   *     'contact.list': { controller: 'ListController' },
	   *     'contact.item': { controller: 'ItemController' }
	   *   }
	   * });
	   *
	   * // ...
	   *
	   * $state.go('home');
	   * // Auto-populates list and item views with /partials/home/contact/list.html,
	   * // and /partials/home/contact/item.html, respectively.
	   * </pre>
	   *
	   * @param {string} name The name of the builder function to decorate. 
	   * @param {object} func A function that is responsible for decorating the original 
	   * builder function. The function receives two parameters:
	   *
	   *   - `{object}` - state - The state config object.
	   *   - `{object}` - super - The original builder function.
	   *
	   * @return {object} $stateProvider - $stateProvider instance
	   */
	  this.decorator = decorator;
	  function decorator(name, func) {
	    /*jshint validthis: true */
	    if (isString(name) && !isDefined(func)) {
	      return stateBuilder[name];
	    }
	    if (!isFunction(func) || !isString(name)) {
	      return this;
	    }
	    if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
	      stateBuilder.$delegates[name] = stateBuilder[name];
	    }
	    stateBuilder[name] = func;
	    return this;
	  }

	  /**
	   * @ngdoc function
	   * @name ui.router.state.$stateProvider#state
	   * @methodOf ui.router.state.$stateProvider
	   *
	   * @description
	   * Registers a state configuration under a given state name. The stateConfig object
	   * has the following acceptable properties.
	   *
	   * @param {string} name A unique state name, e.g. "home", "about", "contacts".
	   * To create a parent/child state use a dot, e.g. "about.sales", "home.newest".
	   * @param {object} stateConfig State configuration object.
	   * @param {string|function=} stateConfig.template
	   * <a id='template'></a>
	   *   html template as a string or a function that returns
	   *   an html template as a string which should be used by the uiView directives. This property 
	   *   takes precedence over templateUrl.
	   *   
	   *   If `template` is a function, it will be called with the following parameters:
	   *
	   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by
	   *     applying the current state
	   *
	   * <pre>template:
	   *   "<h1>inline template definition</h1>" +
	   *   "<div ui-view></div>"</pre>
	   * <pre>template: function(params) {
	   *       return "<h1>generated template</h1>"; }</pre>
	   * </div>
	   *
	   * @param {string|function=} stateConfig.templateUrl
	   * <a id='templateUrl'></a>
	   *
	   *   path or function that returns a path to an html
	   *   template that should be used by uiView.
	   *   
	   *   If `templateUrl` is a function, it will be called with the following parameters:
	   *
	   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by 
	   *     applying the current state
	   *
	   * <pre>templateUrl: "home.html"</pre>
	   * <pre>templateUrl: function(params) {
	   *     return myTemplates[params.pageId]; }</pre>
	   *
	   * @param {function=} stateConfig.templateProvider
	   * <a id='templateProvider'></a>
	   *    Provider function that returns HTML content string.
	   * <pre> templateProvider:
	   *       function(MyTemplateService, params) {
	   *         return MyTemplateService.getTemplate(params.pageId);
	   *       }</pre>
	   *
	   * @param {string|function=} stateConfig.controller
	   * <a id='controller'></a>
	   *
	   *  Controller fn that should be associated with newly
	   *   related scope or the name of a registered controller if passed as a string.
	   *   Optionally, the ControllerAs may be declared here.
	   * <pre>controller: "MyRegisteredController"</pre>
	   * <pre>controller:
	   *     "MyRegisteredController as fooCtrl"}</pre>
	   * <pre>controller: function($scope, MyService) {
	   *     $scope.data = MyService.getData(); }</pre>
	   *
	   * @param {function=} stateConfig.controllerProvider
	   * <a id='controllerProvider'></a>
	   *
	   * Injectable provider function that returns the actual controller or string.
	   * <pre>controllerProvider:
	   *   function(MyResolveData) {
	   *     if (MyResolveData.foo)
	   *       return "FooCtrl"
	   *     else if (MyResolveData.bar)
	   *       return "BarCtrl";
	   *     else return function($scope) {
	   *       $scope.baz = "Qux";
	   *     }
	   *   }</pre>
	   *
	   * @param {string=} stateConfig.controllerAs
	   * <a id='controllerAs'></a>
	   * 
	   * A controller alias name. If present the controller will be
	   *   published to scope under the controllerAs name.
	   * <pre>controllerAs: "myCtrl"</pre>
	   *
	   * @param {string|object=} stateConfig.parent
	   * <a id='parent'></a>
	   * Optionally specifies the parent state of this state.
	   *
	   * <pre>parent: 'parentState'</pre>
	   * <pre>parent: parentState // JS variable</pre>
	   *
	   * @param {object=} stateConfig.resolve
	   * <a id='resolve'></a>
	   *
	   * An optional map&lt;string, function&gt; of dependencies which
	   *   should be injected into the controller. If any of these dependencies are promises, 
	   *   the router will wait for them all to be resolved before the controller is instantiated.
	   *   If all the promises are resolved successfully, the $stateChangeSuccess event is fired
	   *   and the values of the resolved promises are injected into any controllers that reference them.
	   *   If any  of the promises are rejected the $stateChangeError event is fired.
	   *
	   *   The map object is:
	   *   
	   *   - key - {string}: name of dependency to be injected into controller
	   *   - factory - {string|function}: If string then it is alias for service. Otherwise if function, 
	   *     it is injected and return value it treated as dependency. If result is a promise, it is 
	   *     resolved before its value is injected into controller.
	   *
	   * <pre>resolve: {
	   *     myResolve1:
	   *       function($http, $stateParams) {
	   *         return $http.get("/api/foos/"+stateParams.fooID);
	   *       }
	   *     }</pre>
	   *
	   * @param {string=} stateConfig.url
	   * <a id='url'></a>
	   *
	   *   A url fragment with optional parameters. When a state is navigated or
	   *   transitioned to, the `$stateParams` service will be populated with any 
	   *   parameters that were passed.
	   *
	   *   (See {@link ui.router.util.type:UrlMatcher UrlMatcher} `UrlMatcher`} for
	   *   more details on acceptable patterns )
	   *
	   * examples:
	   * <pre>url: "/home"
	   * url: "/users/:userid"
	   * url: "/books/{bookid:[a-zA-Z_-]}"
	   * url: "/books/{categoryid:int}"
	   * url: "/books/{publishername:string}/{categoryid:int}"
	   * url: "/messages?before&after"
	   * url: "/messages?{before:date}&{after:date}"
	   * url: "/messages/:mailboxid?{before:date}&{after:date}"
	   * </pre>
	   *
	   * @param {object=} stateConfig.views
	   * <a id='views'></a>
	   * an optional map&lt;string, object&gt; which defined multiple views, or targets views
	   * manually/explicitly.
	   *
	   * Examples:
	   *
	   * Targets three named `ui-view`s in the parent state's template
	   * <pre>views: {
	   *     header: {
	   *       controller: "headerCtrl",
	   *       templateUrl: "header.html"
	   *     }, body: {
	   *       controller: "bodyCtrl",
	   *       templateUrl: "body.html"
	   *     }, footer: {
	   *       controller: "footCtrl",
	   *       templateUrl: "footer.html"
	   *     }
	   *   }</pre>
	   *
	   * Targets named `ui-view="header"` from grandparent state 'top''s template, and named `ui-view="body" from parent state's template.
	   * <pre>views: {
	   *     'header@top': {
	   *       controller: "msgHeaderCtrl",
	   *       templateUrl: "msgHeader.html"
	   *     }, 'body': {
	   *       controller: "messagesCtrl",
	   *       templateUrl: "messages.html"
	   *     }
	   *   }</pre>
	   *
	   * @param {boolean=} [stateConfig.abstract=false]
	   * <a id='abstract'></a>
	   * An abstract state will never be directly activated,
	   *   but can provide inherited properties to its common children states.
	   * <pre>abstract: true</pre>
	   *
	   * @param {function=} stateConfig.onEnter
	   * <a id='onEnter'></a>
	   *
	   * Callback function for when a state is entered. Good way
	   *   to trigger an action or dispatch an event, such as opening a dialog.
	   * If minifying your scripts, make sure to explictly annotate this function,
	   * because it won't be automatically annotated by your build tools.
	   *
	   * <pre>onEnter: function(MyService, $stateParams) {
	   *     MyService.foo($stateParams.myParam);
	   * }</pre>
	   *
	   * @param {function=} stateConfig.onExit
	   * <a id='onExit'></a>
	   *
	   * Callback function for when a state is exited. Good way to
	   *   trigger an action or dispatch an event, such as opening a dialog.
	   * If minifying your scripts, make sure to explictly annotate this function,
	   * because it won't be automatically annotated by your build tools.
	   *
	   * <pre>onExit: function(MyService, $stateParams) {
	   *     MyService.cleanup($stateParams.myParam);
	   * }</pre>
	   *
	   * @param {boolean=} [stateConfig.reloadOnSearch=true]
	   * <a id='reloadOnSearch'></a>
	   *
	   * If `false`, will not retrigger the same state
	   *   just because a search/query parameter has changed (via $location.search() or $location.hash()). 
	   *   Useful for when you'd like to modify $location.search() without triggering a reload.
	   * <pre>reloadOnSearch: false</pre>
	   *
	   * @param {object=} stateConfig.data
	   * <a id='data'></a>
	   *
	   * Arbitrary data object, useful for custom configuration.  The parent state's `data` is
	   *   prototypally inherited.  In other words, adding a data property to a state adds it to
	   *   the entire subtree via prototypal inheritance.
	   *
	   * <pre>data: {
	   *     requiredRole: 'foo'
	   * } </pre>
	   *
	   * @param {object=} stateConfig.params
	   * <a id='params'></a>
	   *
	   * A map which optionally configures parameters declared in the `url`, or
	   *   defines additional non-url parameters.  For each parameter being
	   *   configured, add a configuration object keyed to the name of the parameter.
	   *
	   *   Each parameter configuration object may contain the following properties:
	   *
	   *   - ** value ** - {object|function=}: specifies the default value for this
	   *     parameter.  This implicitly sets this parameter as optional.
	   *
	   *     When UI-Router routes to a state and no value is
	   *     specified for this parameter in the URL or transition, the
	   *     default value will be used instead.  If `value` is a function,
	   *     it will be injected and invoked, and the return value used.
	   *
	   *     *Note*: `undefined` is treated as "no default value" while `null`
	   *     is treated as "the default value is `null`".
	   *
	   *     *Shorthand*: If you only need to configure the default value of the
	   *     parameter, you may use a shorthand syntax.   In the **`params`**
	   *     map, instead mapping the param name to a full parameter configuration
	   *     object, simply set map it to the default parameter value, e.g.:
	   *
	   * <pre>// define a parameter's default value
	   * params: {
	   *     param1: { value: "defaultValue" }
	   * }
	   * // shorthand default values
	   * params: {
	   *     param1: "defaultValue",
	   *     param2: "param2Default"
	   * }</pre>
	   *
	   *   - ** array ** - {boolean=}: *(default: false)* If true, the param value will be
	   *     treated as an array of values.  If you specified a Type, the value will be
	   *     treated as an array of the specified Type.  Note: query parameter values
	   *     default to a special `"auto"` mode.
	   *
	   *     For query parameters in `"auto"` mode, if multiple  values for a single parameter
	   *     are present in the URL (e.g.: `/foo?bar=1&bar=2&bar=3`) then the values
	   *     are mapped to an array (e.g.: `{ foo: [ '1', '2', '3' ] }`).  However, if
	   *     only one value is present (e.g.: `/foo?bar=1`) then the value is treated as single
	   *     value (e.g.: `{ foo: '1' }`).
	   *
	   * <pre>params: {
	   *     param1: { array: true }
	   * }</pre>
	   *
	   *   - ** squash ** - {bool|string=}: `squash` configures how a default parameter value is represented in the URL when
	   *     the current parameter value is the same as the default value. If `squash` is not set, it uses the
	   *     configured default squash policy.
	   *     (See {@link ui.router.util.$urlMatcherFactory#methods_defaultSquashPolicy `defaultSquashPolicy()`})
	   *
	   *   There are three squash settings:
	   *
	   *     - false: The parameter's default value is not squashed.  It is encoded and included in the URL
	   *     - true: The parameter's default value is omitted from the URL.  If the parameter is preceeded and followed
	   *       by slashes in the state's `url` declaration, then one of those slashes are omitted.
	   *       This can allow for cleaner looking URLs.
	   *     - `"<arbitrary string>"`: The parameter's default value is replaced with an arbitrary placeholder of  your choice.
	   *
	   * <pre>params: {
	   *     param1: {
	   *       value: "defaultId",
	   *       squash: true
	   * } }
	   * // squash "defaultValue" to "~"
	   * params: {
	   *     param1: {
	   *       value: "defaultValue",
	   *       squash: "~"
	   * } }
	   * </pre>
	   *
	   *
	   * @example
	   * <pre>
	   * // Some state name examples
	   *
	   * // stateName can be a single top-level name (must be unique).
	   * $stateProvider.state("home", {});
	   *
	   * // Or it can be a nested state name. This state is a child of the
	   * // above "home" state.
	   * $stateProvider.state("home.newest", {});
	   *
	   * // Nest states as deeply as needed.
	   * $stateProvider.state("home.newest.abc.xyz.inception", {});
	   *
	   * // state() returns $stateProvider, so you can chain state declarations.
	   * $stateProvider
	   *   .state("home", {})
	   *   .state("about", {})
	   *   .state("contacts", {});
	   * </pre>
	   *
	   */
	  this.state = state;
	  function state(name, definition) {
	    /*jshint validthis: true */
	    if (isObject(name)) definition = name;
	    else definition.name = name;
	    registerState(definition);
	    return this;
	  }

	  /**
	   * @ngdoc object
	   * @name ui.router.state.$state
	   *
	   * @requires $rootScope
	   * @requires $q
	   * @requires ui.router.state.$view
	   * @requires $injector
	   * @requires ui.router.util.$resolve
	   * @requires ui.router.state.$stateParams
	   * @requires ui.router.router.$urlRouter
	   *
	   * @property {object} params A param object, e.g. {sectionId: section.id)}, that 
	   * you'd like to test against the current active state.
	   * @property {object} current A reference to the state's config object. However 
	   * you passed it in. Useful for accessing custom data.
	   * @property {object} transition Currently pending transition. A promise that'll 
	   * resolve or reject.
	   *
	   * @description
	   * `$state` service is responsible for representing states as well as transitioning
	   * between them. It also provides interfaces to ask for current state or even states
	   * you're coming from.
	   */
	  this.$get = $get;
	  $get.$inject = ['$rootScope', '$q', '$view', '$injector', '$resolve', '$stateParams', '$urlRouter', '$location', '$urlMatcherFactory'];
	  function $get(   $rootScope,   $q,   $view,   $injector,   $resolve,   $stateParams,   $urlRouter,   $location,   $urlMatcherFactory) {

	    var TransitionSuperseded = $q.reject(new Error('transition superseded'));
	    var TransitionPrevented = $q.reject(new Error('transition prevented'));
	    var TransitionAborted = $q.reject(new Error('transition aborted'));
	    var TransitionFailed = $q.reject(new Error('transition failed'));

	    // Handles the case where a state which is the target of a transition is not found, and the user
	    // can optionally retry or defer the transition
	    function handleRedirect(redirect, state, params, options) {
	      /**
	       * @ngdoc event
	       * @name ui.router.state.$state#$stateNotFound
	       * @eventOf ui.router.state.$state
	       * @eventType broadcast on root scope
	       * @description
	       * Fired when a requested state **cannot be found** using the provided state name during transition.
	       * The event is broadcast allowing any handlers a single chance to deal with the error (usually by
	       * lazy-loading the unfound state). A special `unfoundState` object is passed to the listener handler,
	       * you can see its three properties in the example. You can use `event.preventDefault()` to abort the
	       * transition and the promise returned from `go` will be rejected with a `'transition aborted'` value.
	       *
	       * @param {Object} event Event object.
	       * @param {Object} unfoundState Unfound State information. Contains: `to, toParams, options` properties.
	       * @param {State} fromState Current state object.
	       * @param {Object} fromParams Current state params.
	       *
	       * @example
	       *
	       * <pre>
	       * // somewhere, assume lazy.state has not been defined
	       * $state.go("lazy.state", {a:1, b:2}, {inherit:false});
	       *
	       * // somewhere else
	       * $scope.$on('$stateNotFound',
	       * function(event, unfoundState, fromState, fromParams){
	       *     console.log(unfoundState.to); // "lazy.state"
	       *     console.log(unfoundState.toParams); // {a:1, b:2}
	       *     console.log(unfoundState.options); // {inherit:false} + default options
	       * })
	       * </pre>
	       */
	      var evt = $rootScope.$broadcast('$stateNotFound', redirect, state, params);

	      if (evt.defaultPrevented) {
	        $urlRouter.update();
	        return TransitionAborted;
	      }

	      if (!evt.retry) {
	        return null;
	      }

	      // Allow the handler to return a promise to defer state lookup retry
	      if (options.$retry) {
	        $urlRouter.update();
	        return TransitionFailed;
	      }
	      var retryTransition = $state.transition = $q.when(evt.retry);

	      retryTransition.then(function() {
	        if (retryTransition !== $state.transition) return TransitionSuperseded;
	        redirect.options.$retry = true;
	        return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
	      }, function() {
	        return TransitionAborted;
	      });
	      $urlRouter.update();

	      return retryTransition;
	    }

	    root.locals = { resolve: null, globals: { $stateParams: {} } };

	    $state = {
	      params: {},
	      current: root.self,
	      $current: root,
	      transition: null
	    };

	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#reload
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * A method that force reloads the current state. All resolves are re-resolved,
	     * controllers reinstantiated, and events re-fired.
	     *
	     * @example
	     * <pre>
	     * var app angular.module('app', ['ui.router']);
	     *
	     * app.controller('ctrl', function ($scope, $state) {
	     *   $scope.reload = function(){
	     *     $state.reload();
	     *   }
	     * });
	     * </pre>
	     *
	     * `reload()` is just an alias for:
	     * <pre>
	     * $state.transitionTo($state.current, $stateParams, { 
	     *   reload: true, inherit: false, notify: true
	     * });
	     * </pre>
	     *
	     * @param {string=|object=} state - A state name or a state object, which is the root of the resolves to be re-resolved.
	     * @example
	     * <pre>
	     * //assuming app application consists of 3 states: 'contacts', 'contacts.detail', 'contacts.detail.item' 
	     * //and current state is 'contacts.detail.item'
	     * var app angular.module('app', ['ui.router']);
	     *
	     * app.controller('ctrl', function ($scope, $state) {
	     *   $scope.reload = function(){
	     *     //will reload 'contact.detail' and 'contact.detail.item' states
	     *     $state.reload('contact.detail');
	     *   }
	     * });
	     * </pre>
	     *
	     * `reload()` is just an alias for:
	     * <pre>
	     * $state.transitionTo($state.current, $stateParams, { 
	     *   reload: true, inherit: false, notify: true
	     * });
	     * </pre>

	     * @returns {promise} A promise representing the state of the new transition. See
	     * {@link ui.router.state.$state#methods_go $state.go}.
	     */
	    $state.reload = function reload(state) {
	      return $state.transitionTo($state.current, $stateParams, { reload: state || true, inherit: false, notify: true});
	    };

	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#go
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * Convenience method for transitioning to a new state. `$state.go` calls 
	     * `$state.transitionTo` internally but automatically sets options to 
	     * `{ location: true, inherit: true, relative: $state.$current, notify: true }`. 
	     * This allows you to easily use an absolute or relative to path and specify 
	     * only the parameters you'd like to update (while letting unspecified parameters 
	     * inherit from the currently active ancestor states).
	     *
	     * @example
	     * <pre>
	     * var app = angular.module('app', ['ui.router']);
	     *
	     * app.controller('ctrl', function ($scope, $state) {
	     *   $scope.changeState = function () {
	     *     $state.go('contact.detail');
	     *   };
	     * });
	     * </pre>
	     * <img src='../ngdoc_assets/StateGoExamples.png'/>
	     *
	     * @param {string} to Absolute state name or relative state path. Some examples:
	     *
	     * - `$state.go('contact.detail')` - will go to the `contact.detail` state
	     * - `$state.go('^')` - will go to a parent state
	     * - `$state.go('^.sibling')` - will go to a sibling state
	     * - `$state.go('.child.grandchild')` - will go to grandchild state
	     *
	     * @param {object=} params A map of the parameters that will be sent to the state, 
	     * will populate $stateParams. Any parameters that are not specified will be inherited from currently 
	     * defined parameters. This allows, for example, going to a sibling state that shares parameters
	     * specified in a parent state. Parameter inheritance only works between common ancestor states, I.e.
	     * transitioning to a sibling will get you the parameters for all parents, transitioning to a child
	     * will get you all current parameters, etc.
	     * @param {object=} options Options object. The options are:
	     *
	     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
	     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
	     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
	     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
	     *    defines which state to be relative from.
	     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
	     * - **`reload`** (v0.2.5) - {boolean=false}, If `true` will force transition even if the state or params 
	     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
	     *    use this when you want to force a reload when *everything* is the same, including search params.
	     *
	     * @returns {promise} A promise representing the state of the new transition.
	     *
	     * Possible success values:
	     *
	     * - $state.current
	     *
	     * <br/>Possible rejection values:
	     *
	     * - 'transition superseded' - when a newer transition has been started after this one
	     * - 'transition prevented' - when `event.preventDefault()` has been called in a `$stateChangeStart` listener
	     * - 'transition aborted' - when `event.preventDefault()` has been called in a `$stateNotFound` listener or
	     *   when a `$stateNotFound` `event.retry` promise errors.
	     * - 'transition failed' - when a state has been unsuccessfully found after 2 tries.
	     * - *resolve error* - when an error has occurred with a `resolve`
	     *
	     */
	    $state.go = function go(to, params, options) {
	      return $state.transitionTo(to, params, extend({ inherit: true, relative: $state.$current }, options));
	    };

	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#transitionTo
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * Low-level method for transitioning to a new state. {@link ui.router.state.$state#methods_go $state.go}
	     * uses `transitionTo` internally. `$state.go` is recommended in most situations.
	     *
	     * @example
	     * <pre>
	     * var app = angular.module('app', ['ui.router']);
	     *
	     * app.controller('ctrl', function ($scope, $state) {
	     *   $scope.changeState = function () {
	     *     $state.transitionTo('contact.detail');
	     *   };
	     * });
	     * </pre>
	     *
	     * @param {string} to State name.
	     * @param {object=} toParams A map of the parameters that will be sent to the state,
	     * will populate $stateParams.
	     * @param {object=} options Options object. The options are:
	     *
	     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
	     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
	     * - **`inherit`** - {boolean=false}, If `true` will inherit url parameters from current url.
	     * - **`relative`** - {object=}, When transitioning with relative path (e.g '^'), 
	     *    defines which state to be relative from.
	     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
	     * - **`reload`** (v0.2.5) - {boolean=false|string=|object=}, If `true` will force transition even if the state or params 
	     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
	     *    use this when you want to force a reload when *everything* is the same, including search params.
	     *    if String, then will reload the state with the name given in reload, and any children.
	     *    if Object, then a stateObj is expected, will reload the state found in stateObj, and any children.
	     *
	     * @returns {promise} A promise representing the state of the new transition. See
	     * {@link ui.router.state.$state#methods_go $state.go}.
	     */
	    $state.transitionTo = function transitionTo(to, toParams, options) {
	      toParams = toParams || {};
	      options = extend({
	        location: true, inherit: false, relative: null, notify: true, reload: false, $retry: false
	      }, options || {});

	      var from = $state.$current, fromParams = $state.params, fromPath = from.path;
	      var evt, toState = findState(to, options.relative);

	      // Store the hash param for later (since it will be stripped out by various methods)
	      var hash = toParams['#'];

	      if (!isDefined(toState)) {
	        var redirect = { to: to, toParams: toParams, options: options };
	        var redirectResult = handleRedirect(redirect, from.self, fromParams, options);

	        if (redirectResult) {
	          return redirectResult;
	        }

	        // Always retry once if the $stateNotFound was not prevented
	        // (handles either redirect changed or state lazy-definition)
	        to = redirect.to;
	        toParams = redirect.toParams;
	        options = redirect.options;
	        toState = findState(to, options.relative);

	        if (!isDefined(toState)) {
	          if (!options.relative) throw new Error("No such state '" + to + "'");
	          throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'");
	        }
	      }
	      if (toState[abstractKey]) throw new Error("Cannot transition to abstract state '" + to + "'");
	      if (options.inherit) toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState);
	      if (!toState.params.$$validates(toParams)) return TransitionFailed;

	      toParams = toState.params.$$values(toParams);
	      to = toState;

	      var toPath = to.path;

	      // Starting from the root of the path, keep all levels that haven't changed
	      var keep = 0, state = toPath[keep], locals = root.locals, toLocals = [];

	      if (!options.reload) {
	        while (state && state === fromPath[keep] && state.ownParams.$$equals(toParams, fromParams)) {
	          locals = toLocals[keep] = state.locals;
	          keep++;
	          state = toPath[keep];
	        }
	      } else if (isString(options.reload) || isObject(options.reload)) {
	        if (isObject(options.reload) && !options.reload.name) {
	          throw new Error('Invalid reload state object');
	        }
	        
	        var reloadState = options.reload === true ? fromPath[0] : findState(options.reload);
	        if (options.reload && !reloadState) {
	          throw new Error("No such reload state '" + (isString(options.reload) ? options.reload : options.reload.name) + "'");
	        }

	        while (state && state === fromPath[keep] && state !== reloadState) {
	          locals = toLocals[keep] = state.locals;
	          keep++;
	          state = toPath[keep];
	        }
	      }

	      // If we're going to the same state and all locals are kept, we've got nothing to do.
	      // But clear 'transition', as we still want to cancel any other pending transitions.
	      // TODO: We may not want to bump 'transition' if we're called from a location change
	      // that we've initiated ourselves, because we might accidentally abort a legitimate
	      // transition initiated from code?
	      if (shouldSkipReload(to, toParams, from, fromParams, locals, options)) {
	        if (hash) toParams['#'] = hash;
	        $state.params = toParams;
	        copy($state.params, $stateParams);
	        if (options.location && to.navigable && to.navigable.url) {
	          $urlRouter.push(to.navigable.url, toParams, {
	            $$avoidResync: true, replace: options.location === 'replace'
	          });
	          $urlRouter.update(true);
	        }
	        $state.transition = null;
	        return $q.when($state.current);
	      }

	      // Filter parameters before we pass them to event handlers etc.
	      toParams = filterByKeys(to.params.$$keys(), toParams || {});

	      // Broadcast start event and cancel the transition if requested
	      if (options.notify) {
	        /**
	         * @ngdoc event
	         * @name ui.router.state.$state#$stateChangeStart
	         * @eventOf ui.router.state.$state
	         * @eventType broadcast on root scope
	         * @description
	         * Fired when the state transition **begins**. You can use `event.preventDefault()`
	         * to prevent the transition from happening and then the transition promise will be
	         * rejected with a `'transition prevented'` value.
	         *
	         * @param {Object} event Event object.
	         * @param {State} toState The state being transitioned to.
	         * @param {Object} toParams The params supplied to the `toState`.
	         * @param {State} fromState The current state, pre-transition.
	         * @param {Object} fromParams The params supplied to the `fromState`.
	         *
	         * @example
	         *
	         * <pre>
	         * $rootScope.$on('$stateChangeStart',
	         * function(event, toState, toParams, fromState, fromParams){
	         *     event.preventDefault();
	         *     // transitionTo() promise will be rejected with
	         *     // a 'transition prevented' error
	         * })
	         * </pre>
	         */
	        if ($rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams).defaultPrevented) {
	          $rootScope.$broadcast('$stateChangeCancel', to.self, toParams, from.self, fromParams);
	          $urlRouter.update();
	          return TransitionPrevented;
	        }
	      }

	      // Resolve locals for the remaining states, but don't update any global state just
	      // yet -- if anything fails to resolve the current state needs to remain untouched.
	      // We also set up an inheritance chain for the locals here. This allows the view directive
	      // to quickly look up the correct definition for each view in the current state. Even
	      // though we create the locals object itself outside resolveState(), it is initially
	      // empty and gets filled asynchronously. We need to keep track of the promise for the
	      // (fully resolved) current locals, and pass this down the chain.
	      var resolved = $q.when(locals);

	      for (var l = keep; l < toPath.length; l++, state = toPath[l]) {
	        locals = toLocals[l] = inherit(locals);
	        resolved = resolveState(state, toParams, state === to, resolved, locals, options);
	      }

	      // Once everything is resolved, we are ready to perform the actual transition
	      // and return a promise for the new state. We also keep track of what the
	      // current promise is, so that we can detect overlapping transitions and
	      // keep only the outcome of the last transition.
	      var transition = $state.transition = resolved.then(function () {
	        var l, entering, exiting;

	        if ($state.transition !== transition) return TransitionSuperseded;

	        // Exit 'from' states not kept
	        for (l = fromPath.length - 1; l >= keep; l--) {
	          exiting = fromPath[l];
	          if (exiting.self.onExit) {
	            $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
	          }
	          exiting.locals = null;
	        }

	        // Enter 'to' states not kept
	        for (l = keep; l < toPath.length; l++) {
	          entering = toPath[l];
	          entering.locals = toLocals[l];
	          if (entering.self.onEnter) {
	            $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
	          }
	        }

	        // Re-add the saved hash before we start returning things
	        if (hash) toParams['#'] = hash;

	        // Run it again, to catch any transitions in callbacks
	        if ($state.transition !== transition) return TransitionSuperseded;

	        // Update globals in $state
	        $state.$current = to;
	        $state.current = to.self;
	        $state.params = toParams;
	        copy($state.params, $stateParams);
	        $state.transition = null;

	        if (options.location && to.navigable) {
	          $urlRouter.push(to.navigable.url, to.navigable.locals.globals.$stateParams, {
	            $$avoidResync: true, replace: options.location === 'replace'
	          });
	        }

	        if (options.notify) {
	        /**
	         * @ngdoc event
	         * @name ui.router.state.$state#$stateChangeSuccess
	         * @eventOf ui.router.state.$state
	         * @eventType broadcast on root scope
	         * @description
	         * Fired once the state transition is **complete**.
	         *
	         * @param {Object} event Event object.
	         * @param {State} toState The state being transitioned to.
	         * @param {Object} toParams The params supplied to the `toState`.
	         * @param {State} fromState The current state, pre-transition.
	         * @param {Object} fromParams The params supplied to the `fromState`.
	         */
	          $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
	        }
	        $urlRouter.update(true);

	        return $state.current;
	      }, function (error) {
	        if ($state.transition !== transition) return TransitionSuperseded;

	        $state.transition = null;
	        /**
	         * @ngdoc event
	         * @name ui.router.state.$state#$stateChangeError
	         * @eventOf ui.router.state.$state
	         * @eventType broadcast on root scope
	         * @description
	         * Fired when an **error occurs** during transition. It's important to note that if you
	         * have any errors in your resolve functions (javascript errors, non-existent services, etc)
	         * they will not throw traditionally. You must listen for this $stateChangeError event to
	         * catch **ALL** errors.
	         *
	         * @param {Object} event Event object.
	         * @param {State} toState The state being transitioned to.
	         * @param {Object} toParams The params supplied to the `toState`.
	         * @param {State} fromState The current state, pre-transition.
	         * @param {Object} fromParams The params supplied to the `fromState`.
	         * @param {Error} error The resolve error object.
	         */
	        evt = $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);

	        if (!evt.defaultPrevented) {
	            $urlRouter.update();
	        }

	        return $q.reject(error);
	      });

	      return transition;
	    };

	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#is
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * Similar to {@link ui.router.state.$state#methods_includes $state.includes},
	     * but only checks for the full state name. If params is supplied then it will be
	     * tested for strict equality against the current active params object, so all params
	     * must match with none missing and no extras.
	     *
	     * @example
	     * <pre>
	     * $state.$current.name = 'contacts.details.item';
	     *
	     * // absolute name
	     * $state.is('contact.details.item'); // returns true
	     * $state.is(contactDetailItemStateObject); // returns true
	     *
	     * // relative name (. and ^), typically from a template
	     * // E.g. from the 'contacts.details' template
	     * <div ng-class="{highlighted: $state.is('.item')}">Item</div>
	     * </pre>
	     *
	     * @param {string|object} stateOrName The state name (absolute or relative) or state object you'd like to check.
	     * @param {object=} params A param object, e.g. `{sectionId: section.id}`, that you'd like
	     * to test against the current active state.
	     * @param {object=} options An options object.  The options are:
	     *
	     * - **`relative`** - {string|object} -  If `stateOrName` is a relative state name and `options.relative` is set, .is will
	     * test relative to `options.relative` state (or name).
	     *
	     * @returns {boolean} Returns true if it is the state.
	     */
	    $state.is = function is(stateOrName, params, options) {
	      options = extend({ relative: $state.$current }, options || {});
	      var state = findState(stateOrName, options.relative);

	      if (!isDefined(state)) { return undefined; }
	      if ($state.$current !== state) { return false; }
	      return params ? equalForKeys(state.params.$$values(params), $stateParams) : true;
	    };

	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#includes
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * A method to determine if the current active state is equal to or is the child of the
	     * state stateName. If any params are passed then they will be tested for a match as well.
	     * Not all the parameters need to be passed, just the ones you'd like to test for equality.
	     *
	     * @example
	     * Partial and relative names
	     * <pre>
	     * $state.$current.name = 'contacts.details.item';
	     *
	     * // Using partial names
	     * $state.includes("contacts"); // returns true
	     * $state.includes("contacts.details"); // returns true
	     * $state.includes("contacts.details.item"); // returns true
	     * $state.includes("contacts.list"); // returns false
	     * $state.includes("about"); // returns false
	     *
	     * // Using relative names (. and ^), typically from a template
	     * // E.g. from the 'contacts.details' template
	     * <div ng-class="{highlighted: $state.includes('.item')}">Item</div>
	     * </pre>
	     *
	     * Basic globbing patterns
	     * <pre>
	     * $state.$current.name = 'contacts.details.item.url';
	     *
	     * $state.includes("*.details.*.*"); // returns true
	     * $state.includes("*.details.**"); // returns true
	     * $state.includes("**.item.**"); // returns true
	     * $state.includes("*.details.item.url"); // returns true
	     * $state.includes("*.details.*.url"); // returns true
	     * $state.includes("*.details.*"); // returns false
	     * $state.includes("item.**"); // returns false
	     * </pre>
	     *
	     * @param {string} stateOrName A partial name, relative name, or glob pattern
	     * to be searched for within the current state name.
	     * @param {object=} params A param object, e.g. `{sectionId: section.id}`,
	     * that you'd like to test against the current active state.
	     * @param {object=} options An options object.  The options are:
	     *
	     * - **`relative`** - {string|object=} -  If `stateOrName` is a relative state reference and `options.relative` is set,
	     * .includes will test relative to `options.relative` state (or name).
	     *
	     * @returns {boolean} Returns true if it does include the state
	     */
	    $state.includes = function includes(stateOrName, params, options) {
	      options = extend({ relative: $state.$current }, options || {});
	      if (isString(stateOrName) && isGlob(stateOrName)) {
	        if (!doesStateMatchGlob(stateOrName)) {
	          return false;
	        }
	        stateOrName = $state.$current.name;
	      }

	      var state = findState(stateOrName, options.relative);
	      if (!isDefined(state)) { return undefined; }
	      if (!isDefined($state.$current.includes[state.name])) { return false; }
	      return params ? equalForKeys(state.params.$$values(params), $stateParams, objectKeys(params)) : true;
	    };


	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#href
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * A url generation method that returns the compiled url for the given state populated with the given params.
	     *
	     * @example
	     * <pre>
	     * expect($state.href("about.person", { person: "bob" })).toEqual("/about/bob");
	     * </pre>
	     *
	     * @param {string|object} stateOrName The state name or state object you'd like to generate a url from.
	     * @param {object=} params An object of parameter values to fill the state's required parameters.
	     * @param {object=} options Options object. The options are:
	     *
	     * - **`lossy`** - {boolean=true} -  If true, and if there is no url associated with the state provided in the
	     *    first parameter, then the constructed href url will be built from the first navigable ancestor (aka
	     *    ancestor with a valid url).
	     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
	     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
	     *    defines which state to be relative from.
	     * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
	     * 
	     * @returns {string} compiled state url
	     */
	    $state.href = function href(stateOrName, params, options) {
	      options = extend({
	        lossy:    true,
	        inherit:  true,
	        absolute: false,
	        relative: $state.$current
	      }, options || {});

	      var state = findState(stateOrName, options.relative);

	      if (!isDefined(state)) return null;
	      if (options.inherit) params = inheritParams($stateParams, params || {}, $state.$current, state);
	      
	      var nav = (state && options.lossy) ? state.navigable : state;

	      if (!nav || nav.url === undefined || nav.url === null) {
	        return null;
	      }
	      return $urlRouter.href(nav.url, filterByKeys(state.params.$$keys().concat('#'), params || {}), {
	        absolute: options.absolute
	      });
	    };

	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#get
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * Returns the state configuration object for any specific state or all states.
	     *
	     * @param {string|object=} stateOrName (absolute or relative) If provided, will only get the config for
	     * the requested state. If not provided, returns an array of ALL state configs.
	     * @param {string|object=} context When stateOrName is a relative state reference, the state will be retrieved relative to context.
	     * @returns {Object|Array} State configuration object or array of all objects.
	     */
	    $state.get = function (stateOrName, context) {
	      if (arguments.length === 0) return map(objectKeys(states), function(name) { return states[name].self; });
	      var state = findState(stateOrName, context || $state.$current);
	      return (state && state.self) ? state.self : null;
	    };

	    function resolveState(state, params, paramsAreFiltered, inherited, dst, options) {
	      // Make a restricted $stateParams with only the parameters that apply to this state if
	      // necessary. In addition to being available to the controller and onEnter/onExit callbacks,
	      // we also need $stateParams to be available for any $injector calls we make during the
	      // dependency resolution process.
	      var $stateParams = (paramsAreFiltered) ? params : filterByKeys(state.params.$$keys(), params);
	      var locals = { $stateParams: $stateParams };

	      // Resolve 'global' dependencies for the state, i.e. those not specific to a view.
	      // We're also including $stateParams in this; that way the parameters are restricted
	      // to the set that should be visible to the state, and are independent of when we update
	      // the global $state and $stateParams values.
	      dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
	      var promises = [dst.resolve.then(function (globals) {
	        dst.globals = globals;
	      })];
	      if (inherited) promises.push(inherited);

	      function resolveViews() {
	        var viewsPromises = [];

	        // Resolve template and dependencies for all views.
	        forEach(state.views, function (view, name) {
	          var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {});
	          injectables.$template = [ function () {
	            return $view.load(name, { view: view, locals: dst.globals, params: $stateParams, notify: options.notify }) || '';
	          }];

	          viewsPromises.push($resolve.resolve(injectables, dst.globals, dst.resolve, state).then(function (result) {
	            // References to the controller (only instantiated at link time)
	            if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
	              var injectLocals = angular.extend({}, injectables, dst.globals);
	              result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
	            } else {
	              result.$$controller = view.controller;
	            }
	            // Provide access to the state itself for internal use
	            result.$$state = state;
	            result.$$controllerAs = view.controllerAs;
	            dst[name] = result;
	          }));
	        });

	        return $q.all(viewsPromises).then(function(){
	          return dst.globals;
	        });
	      }

	      // Wait for all the promises and then return the activation object
	      return $q.all(promises).then(resolveViews).then(function (values) {
	        return dst;
	      });
	    }

	    return $state;
	  }

	  function shouldSkipReload(to, toParams, from, fromParams, locals, options) {
	    // Return true if there are no differences in non-search (path/object) params, false if there are differences
	    function nonSearchParamsEqual(fromAndToState, fromParams, toParams) {
	      // Identify whether all the parameters that differ between `fromParams` and `toParams` were search params.
	      function notSearchParam(key) {
	        return fromAndToState.params[key].location != "search";
	      }
	      var nonQueryParamKeys = fromAndToState.params.$$keys().filter(notSearchParam);
	      var nonQueryParams = pick.apply({}, [fromAndToState.params].concat(nonQueryParamKeys));
	      var nonQueryParamSet = new $$UMFP.ParamSet(nonQueryParams);
	      return nonQueryParamSet.$$equals(fromParams, toParams);
	    }

	    // If reload was not explicitly requested
	    // and we're transitioning to the same state we're already in
	    // and    the locals didn't change
	    //     or they changed in a way that doesn't merit reloading
	    //        (reloadOnParams:false, or reloadOnSearch.false and only search params changed)
	    // Then return true.
	    if (!options.reload && to === from &&
	      (locals === from.locals || (to.self.reloadOnSearch === false && nonSearchParamsEqual(from, fromParams, toParams)))) {
	      return true;
	    }
	  }
	}

	angular.module('ui.router.state')
	  .value('$stateParams', {})
	  .provider('$state', $StateProvider);


	$ViewProvider.$inject = [];
	function $ViewProvider() {

	  this.$get = $get;
	  /**
	   * @ngdoc object
	   * @name ui.router.state.$view
	   *
	   * @requires ui.router.util.$templateFactory
	   * @requires $rootScope
	   *
	   * @description
	   *
	   */
	  $get.$inject = ['$rootScope', '$templateFactory'];
	  function $get(   $rootScope,   $templateFactory) {
	    return {
	      // $view.load('full.viewName', { template: ..., controller: ..., resolve: ..., async: false, params: ... })
	      /**
	       * @ngdoc function
	       * @name ui.router.state.$view#load
	       * @methodOf ui.router.state.$view
	       *
	       * @description
	       *
	       * @param {string} name name
	       * @param {object} options option object.
	       */
	      load: function load(name, options) {
	        var result, defaults = {
	          template: null, controller: null, view: null, locals: null, notify: true, async: true, params: {}
	        };
	        options = extend(defaults, options);

	        if (options.view) {
	          result = $templateFactory.fromConfig(options.view, options.params, options.locals);
	        }
	        if (result && options.notify) {
	        /**
	         * @ngdoc event
	         * @name ui.router.state.$state#$viewContentLoading
	         * @eventOf ui.router.state.$view
	         * @eventType broadcast on root scope
	         * @description
	         *
	         * Fired once the view **begins loading**, *before* the DOM is rendered.
	         *
	         * @param {Object} event Event object.
	         * @param {Object} viewConfig The view config properties (template, controller, etc).
	         *
	         * @example
	         *
	         * <pre>
	         * $scope.$on('$viewContentLoading',
	         * function(event, viewConfig){
	         *     // Access to all the view config properties.
	         *     // and one special property 'targetView'
	         *     // viewConfig.targetView
	         * });
	         * </pre>
	         */
	          $rootScope.$broadcast('$viewContentLoading', options);
	        }
	        return result;
	      }
	    };
	  }
	}

	angular.module('ui.router.state').provider('$view', $ViewProvider);

	/**
	 * @ngdoc object
	 * @name ui.router.state.$uiViewScrollProvider
	 *
	 * @description
	 * Provider that returns the {@link ui.router.state.$uiViewScroll} service function.
	 */
	function $ViewScrollProvider() {

	  var useAnchorScroll = false;

	  /**
	   * @ngdoc function
	   * @name ui.router.state.$uiViewScrollProvider#useAnchorScroll
	   * @methodOf ui.router.state.$uiViewScrollProvider
	   *
	   * @description
	   * Reverts back to using the core [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll) service for
	   * scrolling based on the url anchor.
	   */
	  this.useAnchorScroll = function () {
	    useAnchorScroll = true;
	  };

	  /**
	   * @ngdoc object
	   * @name ui.router.state.$uiViewScroll
	   *
	   * @requires $anchorScroll
	   * @requires $timeout
	   *
	   * @description
	   * When called with a jqLite element, it scrolls the element into view (after a
	   * `$timeout` so the DOM has time to refresh).
	   *
	   * If you prefer to rely on `$anchorScroll` to scroll the view to the anchor,
	   * this can be enabled by calling {@link ui.router.state.$uiViewScrollProvider#methods_useAnchorScroll `$uiViewScrollProvider.useAnchorScroll()`}.
	   */
	  this.$get = ['$anchorScroll', '$timeout', function ($anchorScroll, $timeout) {
	    if (useAnchorScroll) {
	      return $anchorScroll;
	    }

	    return function ($element) {
	      return $timeout(function () {
	        $element[0].scrollIntoView();
	      }, 0, false);
	    };
	  }];
	}

	angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);

	/**
	 * @ngdoc directive
	 * @name ui.router.state.directive:ui-view
	 *
	 * @requires ui.router.state.$state
	 * @requires $compile
	 * @requires $controller
	 * @requires $injector
	 * @requires ui.router.state.$uiViewScroll
	 * @requires $document
	 *
	 * @restrict ECA
	 *
	 * @description
	 * The ui-view directive tells $state where to place your templates.
	 *
	 * @param {string=} name A view name. The name should be unique amongst the other views in the
	 * same state. You can have views of the same name that live in different states.
	 *
	 * @param {string=} autoscroll It allows you to set the scroll behavior of the browser window
	 * when a view is populated. By default, $anchorScroll is overridden by ui-router's custom scroll
	 * service, {@link ui.router.state.$uiViewScroll}. This custom service let's you
	 * scroll ui-view elements into view when they are populated during a state activation.
	 *
	 * *Note: To revert back to old [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll)
	 * functionality, call `$uiViewScrollProvider.useAnchorScroll()`.*
	 *
	 * @param {string=} onload Expression to evaluate whenever the view updates.
	 * 
	 * @example
	 * A view can be unnamed or named. 
	 * <pre>
	 * <!-- Unnamed -->
	 * <div ui-view></div> 
	 * 
	 * <!-- Named -->
	 * <div ui-view="viewName"></div>
	 * </pre>
	 *
	 * You can only have one unnamed view within any template (or root html). If you are only using a 
	 * single view and it is unnamed then you can populate it like so:
	 * <pre>
	 * <div ui-view></div> 
	 * $stateProvider.state("home", {
	 *   template: "<h1>HELLO!</h1>"
	 * })
	 * </pre>
	 * 
	 * The above is a convenient shortcut equivalent to specifying your view explicitly with the {@link ui.router.state.$stateProvider#views `views`}
	 * config property, by name, in this case an empty name:
	 * <pre>
	 * $stateProvider.state("home", {
	 *   views: {
	 *     "": {
	 *       template: "<h1>HELLO!</h1>"
	 *     }
	 *   }    
	 * })
	 * </pre>
	 * 
	 * But typically you'll only use the views property if you name your view or have more than one view 
	 * in the same template. There's not really a compelling reason to name a view if its the only one, 
	 * but you could if you wanted, like so:
	 * <pre>
	 * <div ui-view="main"></div>
	 * </pre> 
	 * <pre>
	 * $stateProvider.state("home", {
	 *   views: {
	 *     "main": {
	 *       template: "<h1>HELLO!</h1>"
	 *     }
	 *   }    
	 * })
	 * </pre>
	 * 
	 * Really though, you'll use views to set up multiple views:
	 * <pre>
	 * <div ui-view></div>
	 * <div ui-view="chart"></div> 
	 * <div ui-view="data"></div> 
	 * </pre>
	 * 
	 * <pre>
	 * $stateProvider.state("home", {
	 *   views: {
	 *     "": {
	 *       template: "<h1>HELLO!</h1>"
	 *     },
	 *     "chart": {
	 *       template: "<chart_thing/>"
	 *     },
	 *     "data": {
	 *       template: "<data_thing/>"
	 *     }
	 *   }    
	 * })
	 * </pre>
	 *
	 * Examples for `autoscroll`:
	 *
	 * <pre>
	 * <!-- If autoscroll present with no expression,
	 *      then scroll ui-view into view -->
	 * <ui-view autoscroll/>
	 *
	 * <!-- If autoscroll present with valid expression,
	 *      then scroll ui-view into view if expression evaluates to true -->
	 * <ui-view autoscroll='true'/>
	 * <ui-view autoscroll='false'/>
	 * <ui-view autoscroll='scopeVariable'/>
	 * </pre>
	 */
	$ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll', '$interpolate'];
	function $ViewDirective(   $state,   $injector,   $uiViewScroll,   $interpolate) {

	  function getService() {
	    return ($injector.has) ? function(service) {
	      return $injector.has(service) ? $injector.get(service) : null;
	    } : function(service) {
	      try {
	        return $injector.get(service);
	      } catch (e) {
	        return null;
	      }
	    };
	  }

	  var service = getService(),
	      $animator = service('$animator'),
	      $animate = service('$animate');

	  // Returns a set of DOM manipulation functions based on which Angular version
	  // it should use
	  function getRenderer(attrs, scope) {
	    var statics = function() {
	      return {
	        enter: function (element, target, cb) { target.after(element); cb(); },
	        leave: function (element, cb) { element.remove(); cb(); }
	      };
	    };

	    if ($animate) {
	      return {
	        enter: function(element, target, cb) {
	          var promise = $animate.enter(element, null, target, cb);
	          if (promise && promise.then) promise.then(cb);
	        },
	        leave: function(element, cb) {
	          var promise = $animate.leave(element, cb);
	          if (promise && promise.then) promise.then(cb);
	        }
	      };
	    }

	    if ($animator) {
	      var animate = $animator && $animator(scope, attrs);

	      return {
	        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); },
	        leave: function(element, cb) { animate.leave(element); cb(); }
	      };
	    }

	    return statics();
	  }

	  var directive = {
	    restrict: 'ECA',
	    terminal: true,
	    priority: 400,
	    transclude: 'element',
	    compile: function (tElement, tAttrs, $transclude) {
	      return function (scope, $element, attrs) {
	        var previousEl, currentEl, currentScope, latestLocals,
	            onloadExp     = attrs.onload || '',
	            autoScrollExp = attrs.autoscroll,
	            renderer      = getRenderer(attrs, scope);

	        scope.$on('$stateChangeSuccess', function() {
	          updateView(false);
	        });
	        scope.$on('$viewContentLoading', function() {
	          updateView(false);
	        });

	        updateView(true);

	        function cleanupLastView() {
	          if (previousEl) {
	            previousEl.remove();
	            previousEl = null;
	          }

	          if (currentScope) {
	            currentScope.$destroy();
	            currentScope = null;
	          }

	          if (currentEl) {
	            renderer.leave(currentEl, function() {
	              previousEl = null;
	            });

	            previousEl = currentEl;
	            currentEl = null;
	          }
	        }

	        function updateView(firstTime) {
	          var newScope,
	              name            = getUiViewName(scope, attrs, $element, $interpolate),
	              previousLocals  = name && $state.$current && $state.$current.locals[name];

	          if (!firstTime && previousLocals === latestLocals) return; // nothing to do
	          newScope = scope.$new();
	          latestLocals = $state.$current.locals[name];

	          var clone = $transclude(newScope, function(clone) {
	            renderer.enter(clone, $element, function onUiViewEnter() {
	              if(currentScope) {
	                currentScope.$emit('$viewContentAnimationEnded');
	              }

	              if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
	                $uiViewScroll(clone);
	              }
	            });
	            cleanupLastView();
	          });

	          currentEl = clone;
	          currentScope = newScope;
	          /**
	           * @ngdoc event
	           * @name ui.router.state.directive:ui-view#$viewContentLoaded
	           * @eventOf ui.router.state.directive:ui-view
	           * @eventType emits on ui-view directive scope
	           * @description           *
	           * Fired once the view is **loaded**, *after* the DOM is rendered.
	           *
	           * @param {Object} event Event object.
	           */
	          currentScope.$emit('$viewContentLoaded');
	          currentScope.$eval(onloadExp);
	        }
	      };
	    }
	  };

	  return directive;
	}

	$ViewDirectiveFill.$inject = ['$compile', '$controller', '$state', '$interpolate'];
	function $ViewDirectiveFill (  $compile,   $controller,   $state,   $interpolate) {
	  return {
	    restrict: 'ECA',
	    priority: -400,
	    compile: function (tElement) {
	      var initial = tElement.html();
	      return function (scope, $element, attrs) {
	        var current = $state.$current,
	            name = getUiViewName(scope, attrs, $element, $interpolate),
	            locals  = current && current.locals[name];

	        if (! locals) {
	          return;
	        }

	        $element.data('$uiView', { name: name, state: locals.$$state });
	        $element.html(locals.$template ? locals.$template : initial);

	        var link = $compile($element.contents());

	        if (locals.$$controller) {
	          locals.$scope = scope;
	          locals.$element = $element;
	          var controller = $controller(locals.$$controller, locals);
	          if (locals.$$controllerAs) {
	            scope[locals.$$controllerAs] = controller;
	          }
	          $element.data('$ngControllerController', controller);
	          $element.children().data('$ngControllerController', controller);
	        }

	        link(scope);
	      };
	    }
	  };
	}

	/**
	 * Shared ui-view code for both directives:
	 * Given scope, element, and its attributes, return the view's name
	 */
	function getUiViewName(scope, attrs, element, $interpolate) {
	  var name = $interpolate(attrs.uiView || attrs.name || '')(scope);
	  var inherited = element.inheritedData('$uiView');
	  return name.indexOf('@') >= 0 ?  name :  (name + '@' + (inherited ? inherited.state.name : ''));
	}

	angular.module('ui.router.state').directive('uiView', $ViewDirective);
	angular.module('ui.router.state').directive('uiView', $ViewDirectiveFill);

	function parseStateRef(ref, current) {
	  var preparsed = ref.match(/^\s*({[^}]*})\s*$/), parsed;
	  if (preparsed) ref = current + '(' + preparsed[1] + ')';
	  parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
	  if (!parsed || parsed.length !== 4) throw new Error("Invalid state ref '" + ref + "'");
	  return { state: parsed[1], paramExpr: parsed[3] || null };
	}

	function stateContext(el) {
	  var stateData = el.parent().inheritedData('$uiView');

	  if (stateData && stateData.state && stateData.state.name) {
	    return stateData.state;
	  }
	}

	/**
	 * @ngdoc directive
	 * @name ui.router.state.directive:ui-sref
	 *
	 * @requires ui.router.state.$state
	 * @requires $timeout
	 *
	 * @restrict A
	 *
	 * @description
	 * A directive that binds a link (`<a>` tag) to a state. If the state has an associated 
	 * URL, the directive will automatically generate & update the `href` attribute via 
	 * the {@link ui.router.state.$state#methods_href $state.href()} method. Clicking 
	 * the link will trigger a state transition with optional parameters. 
	 *
	 * Also middle-clicking, right-clicking, and ctrl-clicking on the link will be 
	 * handled natively by the browser.
	 *
	 * You can also use relative state paths within ui-sref, just like the relative 
	 * paths passed to `$state.go()`. You just need to be aware that the path is relative
	 * to the state that the link lives in, in other words the state that loaded the 
	 * template containing the link.
	 *
	 * You can specify options to pass to {@link ui.router.state.$state#go $state.go()}
	 * using the `ui-sref-opts` attribute. Options are restricted to `location`, `inherit`,
	 * and `reload`.
	 *
	 * @example
	 * Here's an example of how you'd use ui-sref and how it would compile. If you have the 
	 * following template:
	 * <pre>
	 * <a ui-sref="home">Home</a> | <a ui-sref="about">About</a> | <a ui-sref="{page: 2}">Next page</a>
	 * 
	 * <ul>
	 *     <li ng-repeat="contact in contacts">
	 *         <a ui-sref="contacts.detail({ id: contact.id })">{{ contact.name }}</a>
	 *     </li>
	 * </ul>
	 * </pre>
	 * 
	 * Then the compiled html would be (assuming Html5Mode is off and current state is contacts):
	 * <pre>
	 * <a href="#/home" ui-sref="home">Home</a> | <a href="#/about" ui-sref="about">About</a> | <a href="#/contacts?page=2" ui-sref="{page: 2}">Next page</a>
	 * 
	 * <ul>
	 *     <li ng-repeat="contact in contacts">
	 *         <a href="#/contacts/1" ui-sref="contacts.detail({ id: contact.id })">Joe</a>
	 *     </li>
	 *     <li ng-repeat="contact in contacts">
	 *         <a href="#/contacts/2" ui-sref="contacts.detail({ id: contact.id })">Alice</a>
	 *     </li>
	 *     <li ng-repeat="contact in contacts">
	 *         <a href="#/contacts/3" ui-sref="contacts.detail({ id: contact.id })">Bob</a>
	 *     </li>
	 * </ul>
	 *
	 * <a ui-sref="home" ui-sref-opts="{reload: true}">Home</a>
	 * </pre>
	 *
	 * @param {string} ui-sref 'stateName' can be any valid absolute or relative state
	 * @param {Object} ui-sref-opts options to pass to {@link ui.router.state.$state#go $state.go()}
	 */
	$StateRefDirective.$inject = ['$state', '$timeout'];
	function $StateRefDirective($state, $timeout) {
	  var allowedOptions = ['location', 'inherit', 'reload', 'absolute'];

	  return {
	    restrict: 'A',
	    require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
	    link: function(scope, element, attrs, uiSrefActive) {
	      var ref = parseStateRef(attrs.uiSref, $state.current.name);
	      var params = null, url = null, base = stateContext(element) || $state.$current;
	      // SVGAElement does not use the href attribute, but rather the 'xlinkHref' attribute.
	      var hrefKind = Object.prototype.toString.call(element.prop('href')) === '[object SVGAnimatedString]' ?
	                 'xlink:href' : 'href';
	      var newHref = null, isAnchor = element.prop("tagName").toUpperCase() === "A";
	      var isForm = element[0].nodeName === "FORM";
	      var attr = isForm ? "action" : hrefKind, nav = true;

	      var options = { relative: base, inherit: true };
	      var optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};

	      angular.forEach(allowedOptions, function(option) {
	        if (option in optionsOverride) {
	          options[option] = optionsOverride[option];
	        }
	      });

	      var update = function(newVal) {
	        if (newVal) params = angular.copy(newVal);
	        if (!nav) return;

	        newHref = $state.href(ref.state, params, options);

	        var activeDirective = uiSrefActive[1] || uiSrefActive[0];
	        if (activeDirective) {
	          activeDirective.$$addStateInfo(ref.state, params);
	        }
	        if (newHref === null) {
	          nav = false;
	          return false;
	        }
	        attrs.$set(attr, newHref);
	      };

	      if (ref.paramExpr) {
	        scope.$watch(ref.paramExpr, function(newVal, oldVal) {
	          if (newVal !== params) update(newVal);
	        }, true);
	        params = angular.copy(scope.$eval(ref.paramExpr));
	      }
	      update();

	      if (isForm) return;

	      element.bind("click", function(e) {
	        var button = e.which || e.button;
	        if ( !(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr('target')) ) {
	          // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
	          var transition = $timeout(function() {
	            $state.go(ref.state, params, options);
	          });
	          e.preventDefault();

	          // if the state has no URL, ignore one preventDefault from the <a> directive.
	          var ignorePreventDefaultCount = isAnchor && !newHref ? 1: 0;
	          e.preventDefault = function() {
	            if (ignorePreventDefaultCount-- <= 0)
	              $timeout.cancel(transition);
	          };
	        }
	      });
	    }
	  };
	}

	/**
	 * @ngdoc directive
	 * @name ui.router.state.directive:ui-sref-active
	 *
	 * @requires ui.router.state.$state
	 * @requires ui.router.state.$stateParams
	 * @requires $interpolate
	 *
	 * @restrict A
	 *
	 * @description
	 * A directive working alongside ui-sref to add classes to an element when the
	 * related ui-sref directive's state is active, and removing them when it is inactive.
	 * The primary use-case is to simplify the special appearance of navigation menus
	 * relying on `ui-sref`, by having the "active" state's menu button appear different,
	 * distinguishing it from the inactive menu items.
	 *
	 * ui-sref-active can live on the same element as ui-sref or on a parent element. The first
	 * ui-sref-active found at the same level or above the ui-sref will be used.
	 *
	 * Will activate when the ui-sref's target state or any child state is active. If you
	 * need to activate only when the ui-sref target state is active and *not* any of
	 * it's children, then you will use
	 * {@link ui.router.state.directive:ui-sref-active-eq ui-sref-active-eq}
	 *
	 * @example
	 * Given the following template:
	 * <pre>
	 * <ul>
	 *   <li ui-sref-active="active" class="item">
	 *     <a href ui-sref="app.user({user: 'bilbobaggins'})">@bilbobaggins</a>
	 *   </li>
	 * </ul>
	 * </pre>
	 *
	 *
	 * When the app state is "app.user" (or any children states), and contains the state parameter "user" with value "bilbobaggins",
	 * the resulting HTML will appear as (note the 'active' class):
	 * <pre>
	 * <ul>
	 *   <li ui-sref-active="active" class="item active">
	 *     <a ui-sref="app.user({user: 'bilbobaggins'})" href="/users/bilbobaggins">@bilbobaggins</a>
	 *   </li>
	 * </ul>
	 * </pre>
	 *
	 * The class name is interpolated **once** during the directives link time (any further changes to the
	 * interpolated value are ignored).
	 *
	 * Multiple classes may be specified in a space-separated format:
	 * <pre>
	 * <ul>
	 *   <li ui-sref-active='class1 class2 class3'>
	 *     <a ui-sref="app.user">link</a>
	 *   </li>
	 * </ul>
	 * </pre>
	 */

	/**
	 * @ngdoc directive
	 * @name ui.router.state.directive:ui-sref-active-eq
	 *
	 * @requires ui.router.state.$state
	 * @requires ui.router.state.$stateParams
	 * @requires $interpolate
	 *
	 * @restrict A
	 *
	 * @description
	 * The same as {@link ui.router.state.directive:ui-sref-active ui-sref-active} but will only activate
	 * when the exact target state used in the `ui-sref` is active; no child states.
	 *
	 */
	$StateRefActiveDirective.$inject = ['$state', '$stateParams', '$interpolate'];
	function $StateRefActiveDirective($state, $stateParams, $interpolate) {
	  return  {
	    restrict: "A",
	    controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
	      var states = [], activeClass;

	      // There probably isn't much point in $observing this
	      // uiSrefActive and uiSrefActiveEq share the same directive object with some
	      // slight difference in logic routing
	      activeClass = $interpolate($attrs.uiSrefActiveEq || $attrs.uiSrefActive || '', false)($scope);

	      // Allow uiSref to communicate with uiSrefActive[Equals]
	      this.$$addStateInfo = function (newState, newParams) {
	        var state = $state.get(newState, stateContext($element));

	        states.push({
	          state: state || { name: newState },
	          params: newParams
	        });

	        update();
	      };

	      $scope.$on('$stateChangeSuccess', update);

	      // Update route state
	      function update() {
	        if (anyMatch()) {
	          $element.addClass(activeClass);
	        } else {
	          $element.removeClass(activeClass);
	        }
	      }

	      function anyMatch() {
	        for (var i = 0; i < states.length; i++) {
	          if (isMatch(states[i].state, states[i].params)) {
	            return true;
	          }
	        }
	        return false;
	      }

	      function isMatch(state, params) {
	        if (typeof $attrs.uiSrefActiveEq !== 'undefined') {
	          return $state.is(state.name, params);
	        } else {
	          return $state.includes(state.name, params);
	        }
	      }
	    }]
	  };
	}

	angular.module('ui.router.state')
	  .directive('uiSref', $StateRefDirective)
	  .directive('uiSrefActive', $StateRefActiveDirective)
	  .directive('uiSrefActiveEq', $StateRefActiveDirective);

	/**
	 * @ngdoc filter
	 * @name ui.router.state.filter:isState
	 *
	 * @requires ui.router.state.$state
	 *
	 * @description
	 * Translates to {@link ui.router.state.$state#methods_is $state.is("stateName")}.
	 */
	$IsStateFilter.$inject = ['$state'];
	function $IsStateFilter($state) {
	  var isFilter = function (state) {
	    return $state.is(state);
	  };
	  isFilter.$stateful = true;
	  return isFilter;
	}

	/**
	 * @ngdoc filter
	 * @name ui.router.state.filter:includedByState
	 *
	 * @requires ui.router.state.$state
	 *
	 * @description
	 * Translates to {@link ui.router.state.$state#methods_includes $state.includes('fullOrPartialStateName')}.
	 */
	$IncludedByStateFilter.$inject = ['$state'];
	function $IncludedByStateFilter($state) {
	  var includesFilter = function (state) {
	    return $state.includes(state);
	  };
	  includesFilter.$stateful = true;
	  return  includesFilter;
	}

	angular.module('ui.router.state')
	  .filter('isState', $IsStateFilter)
	  .filter('includedByState', $IncludedByStateFilter);
	})(window, window.angular);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(10);
	module.exports = 'ui.bootstrap';


/***/ },
/* 10 */
/***/ function(module, exports) {

	/*
	 * angular-ui-bootstrap
	 * http://angular-ui.github.io/bootstrap/

	 * Version: 0.14.3 - 2015-10-23
	 * License: MIT
	 */
	angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.dateparser","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdown","ui.bootstrap.stackedMap","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]);
	angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/day.html","template/datepicker/month.html","template/datepicker/popup.html","template/datepicker/year.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-popup.html","template/tooltip/tooltip-popup.html","template/tooltip/tooltip-template-popup.html","template/popover/popover-html.html","template/popover/popover-template.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/progressbar/progressbar.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]);
	angular.module('ui.bootstrap.collapse', [])

	  .directive('uibCollapse', ['$animate', '$injector', function($animate, $injector) {
	    var $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;
	    return {
	      link: function(scope, element, attrs) {
	        function expand() {
	          element.removeClass('collapse')
	            .addClass('collapsing')
	            .attr('aria-expanded', true)
	            .attr('aria-hidden', false);

	          if ($animateCss) {
	            $animateCss(element, {
	              addClass: 'in',
	              easing: 'ease',
	              to: { height: element[0].scrollHeight + 'px' }
	            }).start().finally(expandDone);
	          } else {
	            $animate.addClass(element, 'in', {
	              to: { height: element[0].scrollHeight + 'px' }
	            }).then(expandDone);
	          }
	        }

	        function expandDone() {
	          element.removeClass('collapsing')
	            .addClass('collapse')
	            .css({height: 'auto'});
	        }

	        function collapse() {
	          if (!element.hasClass('collapse') && !element.hasClass('in')) {
	            return collapseDone();
	          }

	          element
	            // IMPORTANT: The height must be set before adding "collapsing" class.
	            // Otherwise, the browser attempts to animate from height 0 (in
	            // collapsing class) to the given height here.
	            .css({height: element[0].scrollHeight + 'px'})
	            // initially all panel collapse have the collapse class, this removal
	            // prevents the animation from jumping to collapsed state
	            .removeClass('collapse')
	            .addClass('collapsing')
	            .attr('aria-expanded', false)
	            .attr('aria-hidden', true);

	          if ($animateCss) {
	            $animateCss(element, {
	              removeClass: 'in',
	              to: {height: '0'}
	            }).start().finally(collapseDone);
	          } else {
	            $animate.removeClass(element, 'in', {
	              to: {height: '0'}
	            }).then(collapseDone);
	          }
	        }

	        function collapseDone() {
	          element.css({height: '0'}); // Required so that collapse works when animation is disabled
	          element.removeClass('collapsing')
	            .addClass('collapse');
	        }

	        scope.$watch(attrs.uibCollapse, function(shouldCollapse) {
	          if (shouldCollapse) {
	            collapse();
	          } else {
	            expand();
	          }
	        });
	      }
	    };
	  }]);

	/* Deprecated collapse below */

	angular.module('ui.bootstrap.collapse')

	  .value('$collapseSuppressWarning', false)

	  .directive('collapse', ['$animate', '$injector', '$log', '$collapseSuppressWarning', function($animate, $injector, $log, $collapseSuppressWarning) {
	    var $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;
	    return {
	      link: function(scope, element, attrs) {
	        if (!$collapseSuppressWarning) {
	          $log.warn('collapse is now deprecated. Use uib-collapse instead.');
	        }

	        function expand() {
	          element.removeClass('collapse')
	            .addClass('collapsing')
	            .attr('aria-expanded', true)
	            .attr('aria-hidden', false);

	          if ($animateCss) {
	            $animateCss(element, {
	              easing: 'ease',
	              to: { height: element[0].scrollHeight + 'px' }
	            }).start().done(expandDone);
	          } else {
	            $animate.animate(element, {}, {
	              height: element[0].scrollHeight + 'px'
	            }).then(expandDone);
	          }
	        }

	        function expandDone() {
	          element.removeClass('collapsing')
	            .addClass('collapse in')
	            .css({height: 'auto'});
	        }

	        function collapse() {
	          if (!element.hasClass('collapse') && !element.hasClass('in')) {
	            return collapseDone();
	          }

	          element
	            // IMPORTANT: The height must be set before adding "collapsing" class.
	            // Otherwise, the browser attempts to animate from height 0 (in
	            // collapsing class) to the given height here.
	            .css({height: element[0].scrollHeight + 'px'})
	            // initially all panel collapse have the collapse class, this removal
	            // prevents the animation from jumping to collapsed state
	            .removeClass('collapse in')
	            .addClass('collapsing')
	            .attr('aria-expanded', false)
	            .attr('aria-hidden', true);

	          if ($animateCss) {
	            $animateCss(element, {
	              to: {height: '0'}
	            }).start().done(collapseDone);
	          } else {
	            $animate.animate(element, {}, {
	              height: '0'
	            }).then(collapseDone);
	          }
	        }

	        function collapseDone() {
	          element.css({height: '0'}); // Required so that collapse works when animation is disabled
	          element.removeClass('collapsing')
	            .addClass('collapse');
	        }

	        scope.$watch(attrs.collapse, function(shouldCollapse) {
	          if (shouldCollapse) {
	            collapse();
	          } else {
	            expand();
	          }
	        });
	      }
	    };
	  }]);

	angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

	.constant('uibAccordionConfig', {
	  closeOthers: true
	})

	.controller('UibAccordionController', ['$scope', '$attrs', 'uibAccordionConfig', function($scope, $attrs, accordionConfig) {
	  // This array keeps track of the accordion groups
	  this.groups = [];

	  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
	  this.closeOthers = function(openGroup) {
	    var closeOthers = angular.isDefined($attrs.closeOthers) ?
	      $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
	    if (closeOthers) {
	      angular.forEach(this.groups, function(group) {
	        if (group !== openGroup) {
	          group.isOpen = false;
	        }
	      });
	    }
	  };

	  // This is called from the accordion-group directive to add itself to the accordion
	  this.addGroup = function(groupScope) {
	    var that = this;
	    this.groups.push(groupScope);

	    groupScope.$on('$destroy', function(event) {
	      that.removeGroup(groupScope);
	    });
	  };

	  // This is called from the accordion-group directive when to remove itself
	  this.removeGroup = function(group) {
	    var index = this.groups.indexOf(group);
	    if (index !== -1) {
	      this.groups.splice(index, 1);
	    }
	  };

	}])

	// The accordion directive simply sets up the directive controller
	// and adds an accordion CSS class to itself element.
	.directive('uibAccordion', function() {
	  return {
	    controller: 'UibAccordionController',
	    controllerAs: 'accordion',
	    transclude: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/accordion/accordion.html';
	    }
	  };
	})

	// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
	.directive('uibAccordionGroup', function() {
	  return {
	    require: '^uibAccordion',         // We need this directive to be inside an accordion
	    transclude: true,              // It transcludes the contents of the directive into the template
	    replace: true,                // The element containing the directive will be replaced with the template
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/accordion/accordion-group.html';
	    },
	    scope: {
	      heading: '@',               // Interpolate the heading attribute onto this scope
	      isOpen: '=?',
	      isDisabled: '=?'
	    },
	    controller: function() {
	      this.setHeading = function(element) {
	        this.heading = element;
	      };
	    },
	    link: function(scope, element, attrs, accordionCtrl) {
	      accordionCtrl.addGroup(scope);

	      scope.openClass = attrs.openClass || 'panel-open';
	      scope.panelClass = attrs.panelClass;
	      scope.$watch('isOpen', function(value) {
	        element.toggleClass(scope.openClass, !!value);
	        if (value) {
	          accordionCtrl.closeOthers(scope);
	        }
	      });

	      scope.toggleOpen = function($event) {
	        if (!scope.isDisabled) {
	          if (!$event || $event.which === 32) {
	            scope.isOpen = !scope.isOpen;
	          }
	        }
	      };
	    }
	  };
	})

	// Use accordion-heading below an accordion-group to provide a heading containing HTML
	.directive('uibAccordionHeading', function() {
	  return {
	    transclude: true,   // Grab the contents to be used as the heading
	    template: '',       // In effect remove this element!
	    replace: true,
	    require: '^uibAccordionGroup',
	    link: function(scope, element, attrs, accordionGroupCtrl, transclude) {
	      // Pass the heading to the accordion-group controller
	      // so that it can be transcluded into the right place in the template
	      // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
	      accordionGroupCtrl.setHeading(transclude(scope, angular.noop));
	    }
	  };
	})

	// Use in the accordion-group template to indicate where you want the heading to be transcluded
	// You must provide the property on the accordion-group controller that will hold the transcluded element
	.directive('uibAccordionTransclude', function() {
	  return {
	    require: ['?^uibAccordionGroup', '?^accordionGroup'],
	    link: function(scope, element, attrs, controller) {
	      controller = controller[0] ? controller[0] : controller[1]; // Delete after we remove deprecation
	      scope.$watch(function() { return controller[attrs.uibAccordionTransclude]; }, function(heading) {
	        if (heading) {
	          element.find('span').html('');
	          element.find('span').append(heading);
	        }
	      });
	    }
	  };
	});

	/* Deprecated accordion below */

	angular.module('ui.bootstrap.accordion')

	  .value('$accordionSuppressWarning', false)

	  .controller('AccordionController', ['$scope', '$attrs', '$controller', '$log', '$accordionSuppressWarning', function($scope, $attrs, $controller, $log, $accordionSuppressWarning) {
	    if (!$accordionSuppressWarning) {
	      $log.warn('AccordionController is now deprecated. Use UibAccordionController instead.');
	    }

	    angular.extend(this, $controller('UibAccordionController', {
	      $scope: $scope,
	      $attrs: $attrs
	    }));
	  }])

	  .directive('accordion', ['$log', '$accordionSuppressWarning', function($log, $accordionSuppressWarning) {
	    return {
	      restrict: 'EA',
	      controller: 'AccordionController',
	      controllerAs: 'accordion',
	      transclude: true,
	      replace: false,
	      templateUrl: function(element, attrs) {
	        return attrs.templateUrl || 'template/accordion/accordion.html';
	      },
	      link: function() {
	        if (!$accordionSuppressWarning) {
	          $log.warn('accordion is now deprecated. Use uib-accordion instead.');
	        }
	      }
	    };
	  }])

	  .directive('accordionGroup', ['$log', '$accordionSuppressWarning', function($log, $accordionSuppressWarning) {
	    return {
	      require: '^accordion',         // We need this directive to be inside an accordion
	      restrict: 'EA',
	      transclude: true,              // It transcludes the contents of the directive into the template
	      replace: true,                // The element containing the directive will be replaced with the template
	      templateUrl: function(element, attrs) {
	        return attrs.templateUrl || 'template/accordion/accordion-group.html';
	      },
	      scope: {
	        heading: '@',               // Interpolate the heading attribute onto this scope
	        isOpen: '=?',
	        isDisabled: '=?'
	      },
	      controller: function() {
	        this.setHeading = function(element) {
	          this.heading = element;
	        };
	      },
	      link: function(scope, element, attrs, accordionCtrl) {
	        if (!$accordionSuppressWarning) {
	          $log.warn('accordion-group is now deprecated. Use uib-accordion-group instead.');
	        }

	        accordionCtrl.addGroup(scope);

	        scope.openClass = attrs.openClass || 'panel-open';
	        scope.panelClass = attrs.panelClass;
	        scope.$watch('isOpen', function(value) {
	          element.toggleClass(scope.openClass, !!value);
	          if (value) {
	            accordionCtrl.closeOthers(scope);
	          }
	        });

	        scope.toggleOpen = function($event) {
	          if (!scope.isDisabled) {
	            if (!$event || $event.which === 32) {
	              scope.isOpen = !scope.isOpen;
	            }
	          }
	        };
	      }
	    };
	  }])

	  .directive('accordionHeading', ['$log', '$accordionSuppressWarning', function($log, $accordionSuppressWarning) {
	    return {
	      restrict: 'EA',
	      transclude: true,   // Grab the contents to be used as the heading
	      template: '',       // In effect remove this element!
	      replace: true,
	      require: '^accordionGroup',
	      link: function(scope, element, attr, accordionGroupCtrl, transclude) {
	        if (!$accordionSuppressWarning) {
	          $log.warn('accordion-heading is now deprecated. Use uib-accordion-heading instead.');
	        }
	        // Pass the heading to the accordion-group controller
	        // so that it can be transcluded into the right place in the template
	        // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
	        accordionGroupCtrl.setHeading(transclude(scope, angular.noop));
	      }
	    };
	  }])

	  .directive('accordionTransclude', ['$log', '$accordionSuppressWarning', function($log, $accordionSuppressWarning) {
	    return {
	      require: '^accordionGroup',
	      link: function(scope, element, attr, controller) {
	        if (!$accordionSuppressWarning) {
	          $log.warn('accordion-transclude is now deprecated. Use uib-accordion-transclude instead.');
	        }

	        scope.$watch(function() { return controller[attr.accordionTransclude]; }, function(heading) {
	          if (heading) {
	            element.find('span').html('');
	            element.find('span').append(heading);
	          }
	        });
	      }
	    };
	  }]);


	angular.module('ui.bootstrap.alert', [])

	.controller('UibAlertController', ['$scope', '$attrs', '$interpolate', '$timeout', function($scope, $attrs, $interpolate, $timeout) {
	  $scope.closeable = !!$attrs.close;

	  var dismissOnTimeout = angular.isDefined($attrs.dismissOnTimeout) ?
	    $interpolate($attrs.dismissOnTimeout)($scope.$parent) : null;

	  if (dismissOnTimeout) {
	    $timeout(function() {
	      $scope.close();
	    }, parseInt(dismissOnTimeout, 10));
	  }
	}])

	.directive('uibAlert', function() {
	  return {
	    controller: 'UibAlertController',
	    controllerAs: 'alert',
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/alert/alert.html';
	    },
	    transclude: true,
	    replace: true,
	    scope: {
	      type: '@',
	      close: '&'
	    }
	  };
	});

	/* Deprecated alert below */

	angular.module('ui.bootstrap.alert')

	  .value('$alertSuppressWarning', false)

	  .controller('AlertController', ['$scope', '$attrs', '$controller', '$log', '$alertSuppressWarning', function($scope, $attrs, $controller, $log, $alertSuppressWarning) {
	    if (!$alertSuppressWarning) {
	      $log.warn('AlertController is now deprecated. Use UibAlertController instead.');
	    }

	    angular.extend(this, $controller('UibAlertController', {
	      $scope: $scope,
	      $attrs: $attrs
	    }));
	  }])

	  .directive('alert', ['$log', '$alertSuppressWarning', function($log, $alertSuppressWarning) {
	    return {
	      controller: 'AlertController',
	      controllerAs: 'alert',
	      templateUrl: function(element, attrs) {
	        return attrs.templateUrl || 'template/alert/alert.html';
	      },
	      transclude: true,
	      replace: true,
	      scope: {
	        type: '@',
	        close: '&'
	      },
	      link: function() {
	        if (!$alertSuppressWarning) {
	          $log.warn('alert is now deprecated. Use uib-alert instead.');
	        }
	      }
	    };
	  }]);

	angular.module('ui.bootstrap.buttons', [])

	.constant('uibButtonConfig', {
	  activeClass: 'active',
	  toggleEvent: 'click'
	})

	.controller('UibButtonsController', ['uibButtonConfig', function(buttonConfig) {
	  this.activeClass = buttonConfig.activeClass || 'active';
	  this.toggleEvent = buttonConfig.toggleEvent || 'click';
	}])

	.directive('uibBtnRadio', function() {
	  return {
	    require: ['uibBtnRadio', 'ngModel'],
	    controller: 'UibButtonsController',
	    controllerAs: 'buttons',
	    link: function(scope, element, attrs, ctrls) {
	      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      element.find('input').css({display: 'none'});

	      //model -> UI
	      ngModelCtrl.$render = function() {
	        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.uibBtnRadio)));
	      };

	      //ui->model
	      element.on(buttonsCtrl.toggleEvent, function() {
	        if (attrs.disabled) {
	          return;
	        }

	        var isActive = element.hasClass(buttonsCtrl.activeClass);

	        if (!isActive || angular.isDefined(attrs.uncheckable)) {
	          scope.$apply(function() {
	            ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.uibBtnRadio));
	            ngModelCtrl.$render();
	          });
	        }
	      });
	    }
	  };
	})

	.directive('uibBtnCheckbox', function() {
	  return {
	    require: ['uibBtnCheckbox', 'ngModel'],
	    controller: 'UibButtonsController',
	    controllerAs: 'button',
	    link: function(scope, element, attrs, ctrls) {
	      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      element.find('input').css({display: 'none'});

	      function getTrueValue() {
	        return getCheckboxValue(attrs.btnCheckboxTrue, true);
	      }

	      function getFalseValue() {
	        return getCheckboxValue(attrs.btnCheckboxFalse, false);
	      }

	      function getCheckboxValue(attribute, defaultValue) {
	        return angular.isDefined(attribute) ? scope.$eval(attribute) : defaultValue;
	      }

	      //model -> UI
	      ngModelCtrl.$render = function() {
	        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
	      };

	      //ui->model
	      element.on(buttonsCtrl.toggleEvent, function() {
	        if (attrs.disabled) {
	          return;
	        }

	        scope.$apply(function() {
	          ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
	          ngModelCtrl.$render();
	        });
	      });
	    }
	  };
	});

	/* Deprecated buttons below */

	angular.module('ui.bootstrap.buttons')

	  .value('$buttonsSuppressWarning', false)

	  .controller('ButtonsController', ['$controller', '$log', '$buttonsSuppressWarning', function($controller, $log, $buttonsSuppressWarning) {
	    if (!$buttonsSuppressWarning) {
	      $log.warn('ButtonsController is now deprecated. Use UibButtonsController instead.');
	    }

	    angular.extend(this, $controller('UibButtonsController'));
	  }])

	  .directive('btnRadio', ['$log', '$buttonsSuppressWarning', function($log, $buttonsSuppressWarning) {
	    return {
	      require: ['btnRadio', 'ngModel'],
	      controller: 'ButtonsController',
	      controllerAs: 'buttons',
	      link: function(scope, element, attrs, ctrls) {
	        if (!$buttonsSuppressWarning) {
	          $log.warn('btn-radio is now deprecated. Use uib-btn-radio instead.');
	        }

	        var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	        element.find('input').css({display: 'none'});

	        //model -> UI
	        ngModelCtrl.$render = function() {
	          element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
	        };

	        //ui->model
	        element.bind(buttonsCtrl.toggleEvent, function() {
	          if (attrs.disabled) {
	            return;
	          }

	          var isActive = element.hasClass(buttonsCtrl.activeClass);

	          if (!isActive || angular.isDefined(attrs.uncheckable)) {
	            scope.$apply(function() {
	              ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.btnRadio));
	              ngModelCtrl.$render();
	            });
	          }
	        });
	      }
	    };
	  }])

	  .directive('btnCheckbox', ['$document', '$log', '$buttonsSuppressWarning', function($document, $log, $buttonsSuppressWarning) {
	    return {
	      require: ['btnCheckbox', 'ngModel'],
	      controller: 'ButtonsController',
	      controllerAs: 'button',
	      link: function(scope, element, attrs, ctrls) {
	        if (!$buttonsSuppressWarning) {
	          $log.warn('btn-checkbox is now deprecated. Use uib-btn-checkbox instead.');
	        }

	        var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	        element.find('input').css({display: 'none'});

	        function getTrueValue() {
	          return getCheckboxValue(attrs.btnCheckboxTrue, true);
	        }

	        function getFalseValue() {
	          return getCheckboxValue(attrs.btnCheckboxFalse, false);
	        }

	        function getCheckboxValue(attributeValue, defaultValue) {
	          var val = scope.$eval(attributeValue);
	          return angular.isDefined(val) ? val : defaultValue;
	        }

	        //model -> UI
	        ngModelCtrl.$render = function() {
	          element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
	        };

	        //ui->model
	        element.bind(buttonsCtrl.toggleEvent, function() {
	          if (attrs.disabled) {
	            return;
	          }

	          scope.$apply(function() {
	            ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
	            ngModelCtrl.$render();
	          });
	        });

	        //accessibility
	        element.on('keypress', function(e) {
	          if (attrs.disabled || e.which !== 32 || $document[0].activeElement !== element[0]) {
	            return;
	          }

	          scope.$apply(function() {
	            ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
	            ngModelCtrl.$render();
	          });
	        });
	      }
	    };
	  }]);


	/**
	 * @ngdoc overview
	 * @name ui.bootstrap.carousel
	 *
	 * @description
	 * AngularJS version of an image carousel.
	 *
	 */
	angular.module('ui.bootstrap.carousel', [])

	.controller('UibCarouselController', ['$scope', '$element', '$interval', '$animate', function($scope, $element, $interval, $animate) {
	  var self = this,
	    slides = self.slides = $scope.slides = [],
	    NEW_ANIMATE = angular.version.minor >= 4,
	    NO_TRANSITION = 'uib-noTransition',
	    SLIDE_DIRECTION = 'uib-slideDirection',
	    currentIndex = -1,
	    currentInterval, isPlaying;
	  self.currentSlide = null;

	  var destroyed = false;
	  /* direction: "prev" or "next" */
	  self.select = $scope.select = function(nextSlide, direction) {
	    var nextIndex = $scope.indexOfSlide(nextSlide);
	    //Decide direction if it's not given
	    if (direction === undefined) {
	      direction = nextIndex > self.getCurrentIndex() ? 'next' : 'prev';
	    }
	    //Prevent this user-triggered transition from occurring if there is already one in progress
	    if (nextSlide && nextSlide !== self.currentSlide && !$scope.$currentTransition) {
	      goNext(nextSlide, nextIndex, direction);
	    }
	  };

	  function goNext(slide, index, direction) {
	    // Scope has been destroyed, stop here.
	    if (destroyed) { return; }

	    angular.extend(slide, {direction: direction, active: true});
	    angular.extend(self.currentSlide || {}, {direction: direction, active: false});
	    if ($animate.enabled() && !$scope.noTransition && !$scope.$currentTransition &&
	      slide.$element && self.slides.length > 1) {
	      slide.$element.data(SLIDE_DIRECTION, slide.direction);
	      if (self.currentSlide && self.currentSlide.$element) {
	        self.currentSlide.$element.data(SLIDE_DIRECTION, slide.direction);
	      }

	      $scope.$currentTransition = true;
	      if (NEW_ANIMATE) {
	        $animate.on('addClass', slide.$element, function(element, phase) {
	          if (phase === 'close') {
	            $scope.$currentTransition = null;
	            $animate.off('addClass', element);
	          }
	        });
	      } else {
	        slide.$element.one('$animate:close', function closeFn() {
	          $scope.$currentTransition = null;
	        });
	      }
	    }

	    self.currentSlide = slide;
	    currentIndex = index;

	    //every time you change slides, reset the timer
	    restartTimer();
	  }

	  $scope.$on('$destroy', function() {
	    destroyed = true;
	  });

	  function getSlideByIndex(index) {
	    if (angular.isUndefined(slides[index].index)) {
	      return slides[index];
	    }
	    var i, len = slides.length;
	    for (i = 0; i < slides.length; ++i) {
	      if (slides[i].index == index) {
	        return slides[i];
	      }
	    }
	  }

	  self.getCurrentIndex = function() {
	    if (self.currentSlide && angular.isDefined(self.currentSlide.index)) {
	      return +self.currentSlide.index;
	    }
	    return currentIndex;
	  };

	  /* Allow outside people to call indexOf on slides array */
	  $scope.indexOfSlide = function(slide) {
	    return angular.isDefined(slide.index) ? +slide.index : slides.indexOf(slide);
	  };

	  $scope.next = function() {
	    var newIndex = (self.getCurrentIndex() + 1) % slides.length;

	    if (newIndex === 0 && $scope.noWrap()) {
	      $scope.pause();
	      return;
	    }

	    return self.select(getSlideByIndex(newIndex), 'next');
	  };

	  $scope.prev = function() {
	    var newIndex = self.getCurrentIndex() - 1 < 0 ? slides.length - 1 : self.getCurrentIndex() - 1;

	    if ($scope.noWrap() && newIndex === slides.length - 1) {
	      $scope.pause();
	      return;
	    }

	    return self.select(getSlideByIndex(newIndex), 'prev');
	  };

	  $scope.isActive = function(slide) {
	     return self.currentSlide === slide;
	  };

	  $scope.$watch('interval', restartTimer);
	  $scope.$watchCollection('slides', resetTransition);
	  $scope.$on('$destroy', resetTimer);

	  function restartTimer() {
	    resetTimer();
	    var interval = +$scope.interval;
	    if (!isNaN(interval) && interval > 0) {
	      currentInterval = $interval(timerFn, interval);
	    }
	  }

	  function resetTimer() {
	    if (currentInterval) {
	      $interval.cancel(currentInterval);
	      currentInterval = null;
	    }
	  }

	  function timerFn() {
	    var interval = +$scope.interval;
	    if (isPlaying && !isNaN(interval) && interval > 0 && slides.length) {
	      $scope.next();
	    } else {
	      $scope.pause();
	    }
	  }

	  function resetTransition(slides) {
	    if (!slides.length) {
	      $scope.$currentTransition = null;
	    }
	  }

	  $scope.play = function() {
	    if (!isPlaying) {
	      isPlaying = true;
	      restartTimer();
	    }
	  };
	  $scope.pause = function() {
	    if (!$scope.noPause) {
	      isPlaying = false;
	      resetTimer();
	    }
	  };

	  self.addSlide = function(slide, element) {
	    slide.$element = element;
	    slides.push(slide);
	    //if this is the first slide or the slide is set to active, select it
	    if (slides.length === 1 || slide.active) {
	      self.select(slides[slides.length - 1]);
	      if (slides.length === 1) {
	        $scope.play();
	      }
	    } else {
	      slide.active = false;
	    }
	  };

	  self.removeSlide = function(slide) {
	    if (angular.isDefined(slide.index)) {
	      slides.sort(function(a, b) {
	        return +a.index > +b.index;
	      });
	    }
	    //get the index of the slide inside the carousel
	    var index = slides.indexOf(slide);
	    slides.splice(index, 1);
	    if (slides.length > 0 && slide.active) {
	      if (index >= slides.length) {
	        self.select(slides[index - 1]);
	      } else {
	        self.select(slides[index]);
	      }
	    } else if (currentIndex > index) {
	      currentIndex--;
	    }

	    //clean the currentSlide when no more slide
	    if (slides.length === 0) {
	      self.currentSlide = null;
	    }
	  };

	  $scope.$watch('noTransition', function(noTransition) {
	    $element.data(NO_TRANSITION, noTransition);
	  });

	}])

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.carousel.directive:carousel
	 * @restrict EA
	 *
	 * @description
	 * Carousel is the outer container for a set of image 'slides' to showcase.
	 *
	 * @param {number=} interval The time, in milliseconds, that it will take the carousel to go to the next slide.
	 * @param {boolean=} noTransition Whether to disable transitions on the carousel.
	 * @param {boolean=} noPause Whether to disable pausing on the carousel (by default, the carousel interval pauses on hover).
	 *
	 * @example
	<example module="ui.bootstrap">
	  <file name="index.html">
	    <uib-carousel>
	      <uib-slide>
	        <img src="http://placekitten.com/150/150" style="margin:auto;">
	        <div class="carousel-caption">
	          <p>Beautiful!</p>
	        </div>
	      </uib-slide>
	      <uib-slide>
	        <img src="http://placekitten.com/100/150" style="margin:auto;">
	        <div class="carousel-caption">
	          <p>D'aww!</p>
	        </div>
	      </uib-slide>
	    </uib-carousel>
	  </file>
	  <file name="demo.css">
	    .carousel-indicators {
	      top: auto;
	      bottom: 15px;
	    }
	  </file>
	</example>
	 */
	.directive('uibCarousel', [function() {
	  return {
	    transclude: true,
	    replace: true,
	    controller: 'UibCarouselController',
	    controllerAs: 'carousel',
	    require: 'carousel',
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/carousel/carousel.html';
	    },
	    scope: {
	      interval: '=',
	      noTransition: '=',
	      noPause: '=',
	      noWrap: '&'
	    }
	  };
	}])

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.carousel.directive:slide
	 * @restrict EA
	 *
	 * @description
	 * Creates a slide inside a {@link ui.bootstrap.carousel.directive:carousel carousel}.  Must be placed as a child of a carousel element.
	 *
	 * @param {boolean=} active Model binding, whether or not this slide is currently active.
	 * @param {number=} index The index of the slide. The slides will be sorted by this parameter.
	 *
	 * @example
	<example module="ui.bootstrap">
	  <file name="index.html">
	<div ng-controller="CarouselDemoCtrl">
	  <uib-carousel>
	    <uib-slide ng-repeat="slide in slides" active="slide.active" index="$index">
	      <img ng-src="{{slide.image}}" style="margin:auto;">
	      <div class="carousel-caption">
	        <h4>Slide {{$index}}</h4>
	        <p>{{slide.text}}</p>
	      </div>
	    </uib-slide>
	  </uib-carousel>
	  Interval, in milliseconds: <input type="number" ng-model="myInterval">
	  <br />Enter a negative number to stop the interval.
	</div>
	  </file>
	  <file name="script.js">
	function CarouselDemoCtrl($scope) {
	  $scope.myInterval = 5000;
	}
	  </file>
	  <file name="demo.css">
	    .carousel-indicators {
	      top: auto;
	      bottom: 15px;
	    }
	  </file>
	</example>
	*/

	.directive('uibSlide', function() {
	  return {
	    require: '^uibCarousel',
	    restrict: 'EA',
	    transclude: true,
	    replace: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/carousel/slide.html';
	    },
	    scope: {
	      active: '=?',
	      actual: '=?',
	      index: '=?'
	    },
	    link: function (scope, element, attrs, carouselCtrl) {
	      carouselCtrl.addSlide(scope, element);
	      //when the scope is destroyed then remove the slide from the current slides array
	      scope.$on('$destroy', function() {
	        carouselCtrl.removeSlide(scope);
	      });

	      scope.$watch('active', function(active) {
	        if (active) {
	          carouselCtrl.select(scope);
	        }
	      });
	    }
	  };
	})

	.animation('.item', [
	         '$injector', '$animate',
	function ($injector, $animate) {
	  var NO_TRANSITION = 'uib-noTransition',
	    SLIDE_DIRECTION = 'uib-slideDirection',
	    $animateCss = null;

	  if ($injector.has('$animateCss')) {
	    $animateCss = $injector.get('$animateCss');
	  }

	  function removeClass(element, className, callback) {
	    element.removeClass(className);
	    if (callback) {
	      callback();
	    }
	  }

	  return {
	    beforeAddClass: function(element, className, done) {
	      // Due to transclusion, noTransition property is on parent's scope
	      if (className == 'active' && element.parent() && element.parent().parent() &&
	          !element.parent().parent().data(NO_TRANSITION)) {
	        var stopped = false;
	        var direction = element.data(SLIDE_DIRECTION);
	        var directionClass = direction == 'next' ? 'left' : 'right';
	        var removeClassFn = removeClass.bind(this, element,
	          directionClass + ' ' + direction, done);
	        element.addClass(direction);

	        if ($animateCss) {
	          $animateCss(element, {addClass: directionClass})
	            .start()
	            .done(removeClassFn);
	        } else {
	          $animate.addClass(element, directionClass).then(function () {
	            if (!stopped) {
	              removeClassFn();
	            }
	            done();
	          });
	        }

	        return function () {
	          stopped = true;
	        };
	      }
	      done();
	    },
	    beforeRemoveClass: function (element, className, done) {
	      // Due to transclusion, noTransition property is on parent's scope
	      if (className === 'active' && element.parent() && element.parent().parent() &&
	          !element.parent().parent().data(NO_TRANSITION)) {
	        var stopped = false;
	        var direction = element.data(SLIDE_DIRECTION);
	        var directionClass = direction == 'next' ? 'left' : 'right';
	        var removeClassFn = removeClass.bind(this, element, directionClass, done);

	        if ($animateCss) {
	          $animateCss(element, {addClass: directionClass})
	            .start()
	            .done(removeClassFn);
	        } else {
	          $animate.addClass(element, directionClass).then(function() {
	            if (!stopped) {
	              removeClassFn();
	            }
	            done();
	          });
	        }
	        return function() {
	          stopped = true;
	        };
	      }
	      done();
	    }
	  };
	}]);

	/* deprecated carousel below */

	angular.module('ui.bootstrap.carousel')

	.value('$carouselSuppressWarning', false)

	.controller('CarouselController', ['$scope', '$element', '$controller', '$log', '$carouselSuppressWarning', function($scope, $element, $controller, $log, $carouselSuppressWarning) {
	  if (!$carouselSuppressWarning) {
	    $log.warn('CarouselController is now deprecated. Use UibCarouselController instead.');
	  }

	  angular.extend(this, $controller('UibCarouselController', {
	    $scope: $scope,
	    $element: $element
	  }));
	}])

	.directive('carousel', ['$log', '$carouselSuppressWarning', function($log, $carouselSuppressWarning) {
	  return {
	    transclude: true,
	    replace: true,
	    controller: 'CarouselController',
	    controllerAs: 'carousel',
	    require: 'carousel',
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/carousel/carousel.html';
	    },
	    scope: {
	      interval: '=',
	      noTransition: '=',
	      noPause: '=',
	      noWrap: '&'
	    },
	    link: function() {
	      if (!$carouselSuppressWarning) {
	        $log.warn('carousel is now deprecated. Use uib-carousel instead.');
	      }
	    }
	  };
	}])

	.directive('slide', ['$log', '$carouselSuppressWarning', function($log, $carouselSuppressWarning) {
	  return {
	    require: '^carousel',
	    transclude: true,
	    replace: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/carousel/slide.html';
	    },
	    scope: {
	      active: '=?',
	      actual: '=?',
	      index: '=?'
	    },
	    link: function (scope, element, attrs, carouselCtrl) {
	      if (!$carouselSuppressWarning) {
	        $log.warn('slide is now deprecated. Use uib-slide instead.');
	      }

	      carouselCtrl.addSlide(scope, element);
	      //when the scope is destroyed then remove the slide from the current slides array
	      scope.$on('$destroy', function() {
	        carouselCtrl.removeSlide(scope);
	      });

	      scope.$watch('active', function(active) {
	        if (active) {
	          carouselCtrl.select(scope);
	        }
	      });
	    }
	  };
	}]);

	angular.module('ui.bootstrap.dateparser', [])

	.service('uibDateParser', ['$log', '$locale', 'orderByFilter', function($log, $locale, orderByFilter) {
	  // Pulled from https://github.com/mbostock/d3/blob/master/src/format/requote.js
	  var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

	  var localeId;
	  var formatCodeToRegex;

	  this.init = function() {
	    localeId = $locale.id;

	    this.parsers = {};

	    formatCodeToRegex = {
	      'yyyy': {
	        regex: '\\d{4}',
	        apply: function(value) { this.year = +value; }
	      },
	      'yy': {
	        regex: '\\d{2}',
	        apply: function(value) { this.year = +value + 2000; }
	      },
	      'y': {
	        regex: '\\d{1,4}',
	        apply: function(value) { this.year = +value; }
	      },
	      'MMMM': {
	        regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
	        apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); }
	      },
	      'MMM': {
	        regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
	        apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); }
	      },
	      'MM': {
	        regex: '0[1-9]|1[0-2]',
	        apply: function(value) { this.month = value - 1; }
	      },
	      'M': {
	        regex: '[1-9]|1[0-2]',
	        apply: function(value) { this.month = value - 1; }
	      },
	      'dd': {
	        regex: '[0-2][0-9]{1}|3[0-1]{1}',
	        apply: function(value) { this.date = +value; }
	      },
	      'd': {
	        regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
	        apply: function(value) { this.date = +value; }
	      },
	      'EEEE': {
	        regex: $locale.DATETIME_FORMATS.DAY.join('|')
	      },
	      'EEE': {
	        regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
	      },
	      'HH': {
	        regex: '(?:0|1)[0-9]|2[0-3]',
	        apply: function(value) { this.hours = +value; }
	      },
	      'hh': {
	        regex: '0[0-9]|1[0-2]',
	        apply: function(value) { this.hours = +value; }
	      },
	      'H': {
	        regex: '1?[0-9]|2[0-3]',
	        apply: function(value) { this.hours = +value; }
	      },
	      'h': {
	        regex: '[0-9]|1[0-2]',
	        apply: function(value) { this.hours = +value; }
	      },
	      'mm': {
	        regex: '[0-5][0-9]',
	        apply: function(value) { this.minutes = +value; }
	      },
	      'm': {
	        regex: '[0-9]|[1-5][0-9]',
	        apply: function(value) { this.minutes = +value; }
	      },
	      'sss': {
	        regex: '[0-9][0-9][0-9]',
	        apply: function(value) { this.milliseconds = +value; }
	      },
	      'ss': {
	        regex: '[0-5][0-9]',
	        apply: function(value) { this.seconds = +value; }
	      },
	      's': {
	        regex: '[0-9]|[1-5][0-9]',
	        apply: function(value) { this.seconds = +value; }
	      },
	      'a': {
	        regex: $locale.DATETIME_FORMATS.AMPMS.join('|'),
	        apply: function(value) {
	          if (this.hours === 12) {
	            this.hours = 0;
	          }

	          if (value === 'PM') {
	            this.hours += 12;
	          }
	        }
	      }
	    };
	  };

	  this.init();

	  function createParser(format) {
	    var map = [], regex = format.split('');

	    angular.forEach(formatCodeToRegex, function(data, code) {
	      var index = format.indexOf(code);

	      if (index > -1) {
	        format = format.split('');

	        regex[index] = '(' + data.regex + ')';
	        format[index] = '$'; // Custom symbol to define consumed part of format
	        for (var i = index + 1, n = index + code.length; i < n; i++) {
	          regex[i] = '';
	          format[i] = '$';
	        }
	        format = format.join('');

	        map.push({ index: index, apply: data.apply });
	      }
	    });

	    return {
	      regex: new RegExp('^' + regex.join('') + '$'),
	      map: orderByFilter(map, 'index')
	    };
	  }

	  this.parse = function(input, format, baseDate) {
	    if (!angular.isString(input) || !format) {
	      return input;
	    }

	    format = $locale.DATETIME_FORMATS[format] || format;
	    format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

	    if ($locale.id !== localeId) {
	      this.init();
	    }

	    if (!this.parsers[format]) {
	      this.parsers[format] = createParser(format);
	    }

	    var parser = this.parsers[format],
	        regex = parser.regex,
	        map = parser.map,
	        results = input.match(regex);

	    if (results && results.length) {
	      var fields, dt;
	      if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
	        fields = {
	          year: baseDate.getFullYear(),
	          month: baseDate.getMonth(),
	          date: baseDate.getDate(),
	          hours: baseDate.getHours(),
	          minutes: baseDate.getMinutes(),
	          seconds: baseDate.getSeconds(),
	          milliseconds: baseDate.getMilliseconds()
	        };
	      } else {
	        if (baseDate) {
	          $log.warn('dateparser:', 'baseDate is not a valid date');
	        }
	        fields = { year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
	      }

	      for (var i = 1, n = results.length; i < n; i++) {
	        var mapper = map[i-1];
	        if (mapper.apply) {
	          mapper.apply.call(fields, results[i]);
	        }
	      }

	      if (isValid(fields.year, fields.month, fields.date)) {
	        if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
	          dt = new Date(baseDate);
	          dt.setFullYear(fields.year, fields.month, fields.date,
	            fields.hours, fields.minutes, fields.seconds,
	            fields.milliseconds || 0);
	        } else {
	          dt = new Date(fields.year, fields.month, fields.date,
	            fields.hours, fields.minutes, fields.seconds,
	            fields.milliseconds || 0);
	        }
	      }

	      return dt;
	    }
	  };

	  // Check if date is valid for specific month (and year for February).
	  // Month: 0 = Jan, 1 = Feb, etc
	  function isValid(year, month, date) {
	    if (date < 1) {
	      return false;
	    }

	    if (month === 1 && date > 28) {
	      return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
	    }

	    if (month === 3 || month === 5 || month === 8 || month === 10) {
	      return date < 31;
	    }

	    return true;
	  }
	}]);

	/* Deprecated dateparser below */

	angular.module('ui.bootstrap.dateparser')

	.value('$dateParserSuppressWarning', false)

	.service('dateParser', ['$log', '$dateParserSuppressWarning', 'uibDateParser', function($log, $dateParserSuppressWarning, uibDateParser) {
	  if (!$dateParserSuppressWarning) {
	    $log.warn('dateParser is now deprecated. Use uibDateParser instead.');
	  }

	  angular.extend(this, uibDateParser);
	}]);

	angular.module('ui.bootstrap.position', [])

	/**
	 * A set of utility methods that can be use to retrieve position of DOM elements.
	 * It is meant to be used where we need to absolute-position DOM elements in
	 * relation to other, existing elements (this is the case for tooltips, popovers,
	 * typeahead suggestions etc.).
	 */
	  .factory('$uibPosition', ['$document', '$window', function($document, $window) {
	    function getStyle(el, cssprop) {
	      if (el.currentStyle) { //IE
	        return el.currentStyle[cssprop];
	      } else if ($window.getComputedStyle) {
	        return $window.getComputedStyle(el)[cssprop];
	      }
	      // finally try and get inline style
	      return el.style[cssprop];
	    }

	    /**
	     * Checks if a given element is statically positioned
	     * @param element - raw DOM element
	     */
	    function isStaticPositioned(element) {
	      return (getStyle(element, 'position') || 'static' ) === 'static';
	    }

	    /**
	     * returns the closest, non-statically positioned parentOffset of a given element
	     * @param element
	     */
	    var parentOffsetEl = function(element) {
	      var docDomEl = $document[0];
	      var offsetParent = element.offsetParent || docDomEl;
	      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
	        offsetParent = offsetParent.offsetParent;
	      }
	      return offsetParent || docDomEl;
	    };

	    return {
	      /**
	       * Provides read-only equivalent of jQuery's position function:
	       * http://api.jquery.com/position/
	       */
	      position: function(element) {
	        var elBCR = this.offset(element);
	        var offsetParentBCR = { top: 0, left: 0 };
	        var offsetParentEl = parentOffsetEl(element[0]);
	        if (offsetParentEl != $document[0]) {
	          offsetParentBCR = this.offset(angular.element(offsetParentEl));
	          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
	          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
	        }

	        var boundingClientRect = element[0].getBoundingClientRect();
	        return {
	          width: boundingClientRect.width || element.prop('offsetWidth'),
	          height: boundingClientRect.height || element.prop('offsetHeight'),
	          top: elBCR.top - offsetParentBCR.top,
	          left: elBCR.left - offsetParentBCR.left
	        };
	      },

	      /**
	       * Provides read-only equivalent of jQuery's offset function:
	       * http://api.jquery.com/offset/
	       */
	      offset: function(element) {
	        var boundingClientRect = element[0].getBoundingClientRect();
	        return {
	          width: boundingClientRect.width || element.prop('offsetWidth'),
	          height: boundingClientRect.height || element.prop('offsetHeight'),
	          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
	          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
	        };
	      },

	      /**
	       * Provides coordinates for the targetEl in relation to hostEl
	       */
	      positionElements: function(hostEl, targetEl, positionStr, appendToBody) {
	        var positionStrParts = positionStr.split('-');
	        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

	        var hostElPos,
	          targetElWidth,
	          targetElHeight,
	          targetElPos;

	        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

	        targetElWidth = targetEl.prop('offsetWidth');
	        targetElHeight = targetEl.prop('offsetHeight');

	        var shiftWidth = {
	          center: function() {
	            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
	          },
	          left: function() {
	            return hostElPos.left;
	          },
	          right: function() {
	            return hostElPos.left + hostElPos.width;
	          }
	        };

	        var shiftHeight = {
	          center: function() {
	            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
	          },
	          top: function() {
	            return hostElPos.top;
	          },
	          bottom: function() {
	            return hostElPos.top + hostElPos.height;
	          }
	        };

	        switch (pos0) {
	          case 'right':
	            targetElPos = {
	              top: shiftHeight[pos1](),
	              left: shiftWidth[pos0]()
	            };
	            break;
	          case 'left':
	            targetElPos = {
	              top: shiftHeight[pos1](),
	              left: hostElPos.left - targetElWidth
	            };
	            break;
	          case 'bottom':
	            targetElPos = {
	              top: shiftHeight[pos0](),
	              left: shiftWidth[pos1]()
	            };
	            break;
	          default:
	            targetElPos = {
	              top: hostElPos.top - targetElHeight,
	              left: shiftWidth[pos1]()
	            };
	            break;
	        }

	        return targetElPos;
	      }
	    };
	  }]);

	/* Deprecated position below */

	angular.module('ui.bootstrap.position')

	.value('$positionSuppressWarning', false)

	.service('$position', ['$log', '$positionSuppressWarning', '$uibPosition', function($log, $positionSuppressWarning, $uibPosition) {
	  if (!$positionSuppressWarning) {
	    $log.warn('$position is now deprecated. Use $uibPosition instead.');
	  }

	  angular.extend(this, $uibPosition);
	}]);

	angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.position'])

	.value('$datepickerSuppressError', false)

	.constant('uibDatepickerConfig', {
	  formatDay: 'dd',
	  formatMonth: 'MMMM',
	  formatYear: 'yyyy',
	  formatDayHeader: 'EEE',
	  formatDayTitle: 'MMMM yyyy',
	  formatMonthTitle: 'yyyy',
	  datepickerMode: 'day',
	  minMode: 'day',
	  maxMode: 'year',
	  showWeeks: true,
	  startingDay: 0,
	  yearRange: 20,
	  minDate: null,
	  maxDate: null,
	  shortcutPropagation: false
	})

	.controller('UibDatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$log', 'dateFilter', 'uibDatepickerConfig', '$datepickerSuppressError', function($scope, $attrs, $parse, $interpolate, $log, dateFilter, datepickerConfig, $datepickerSuppressError) {
	  var self = this,
	      ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

	  // Modes chain
	  this.modes = ['day', 'month', 'year'];

	  // Configuration attributes
	  angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
	                   'showWeeks', 'startingDay', 'yearRange', 'shortcutPropagation'], function(key, index) {
	    self[key] = angular.isDefined($attrs[key]) ? (index < 6 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
	  });

	  // Watchable date attributes
	  angular.forEach(['minDate', 'maxDate'], function(key) {
	    if ($attrs[key]) {
	      $scope.$parent.$watch($parse($attrs[key]), function(value) {
	        self[key] = value ? new Date(value) : null;
	        self.refreshView();
	      });
	    } else {
	      self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
	    }
	  });

	  angular.forEach(['minMode', 'maxMode'], function(key) {
	    if ($attrs[key]) {
	      $scope.$parent.$watch($parse($attrs[key]), function(value) {
	        self[key] = angular.isDefined(value) ? value : $attrs[key];
	        $scope[key] = self[key];
	        if ((key == 'minMode' && self.modes.indexOf($scope.datepickerMode) < self.modes.indexOf(self[key])) || (key == 'maxMode' && self.modes.indexOf($scope.datepickerMode) > self.modes.indexOf(self[key]))) {
	          $scope.datepickerMode = self[key];
	        }
	      });
	    } else {
	      self[key] = datepickerConfig[key] || null;
	      $scope[key] = self[key];
	    }
	  });

	  $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
	  $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

	  if (angular.isDefined($attrs.initDate)) {
	    this.activeDate = $scope.$parent.$eval($attrs.initDate) || new Date();
	    $scope.$parent.$watch($attrs.initDate, function(initDate) {
	      if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
	        self.activeDate = initDate;
	        self.refreshView();
	      }
	    });
	  } else {
	    this.activeDate = new Date();
	  }

	  $scope.isActive = function(dateObject) {
	    if (self.compare(dateObject.date, self.activeDate) === 0) {
	      $scope.activeDateId = dateObject.uid;
	      return true;
	    }
	    return false;
	  };

	  this.init = function(ngModelCtrl_) {
	    ngModelCtrl = ngModelCtrl_;

	    ngModelCtrl.$render = function() {
	      self.render();
	    };
	  };

	  this.render = function() {
	    if (ngModelCtrl.$viewValue) {
	      var date = new Date(ngModelCtrl.$viewValue),
	          isValid = !isNaN(date);

	      if (isValid) {
	        this.activeDate = date;
	      } else if (!$datepickerSuppressError) {
	        $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
	      }
	    }
	    this.refreshView();
	  };

	  this.refreshView = function() {
	    if (this.element) {
	      this._refreshView();

	      var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
	      ngModelCtrl.$setValidity('dateDisabled', !date || (this.element && !this.isDisabled(date)));
	    }
	  };

	  this.createDateObject = function(date, format) {
	    var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
	    return {
	      date: date,
	      label: dateFilter(date, format),
	      selected: model && this.compare(date, model) === 0,
	      disabled: this.isDisabled(date),
	      current: this.compare(date, new Date()) === 0,
	      customClass: this.customClass(date)
	    };
	  };

	  this.isDisabled = function(date) {
	    return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
	  };

	  this.customClass = function(date) {
	    return $scope.customClass({date: date, mode: $scope.datepickerMode});
	  };

	  // Split array into smaller arrays
	  this.split = function(arr, size) {
	    var arrays = [];
	    while (arr.length > 0) {
	      arrays.push(arr.splice(0, size));
	    }
	    return arrays;
	  };

	  $scope.select = function(date) {
	    if ($scope.datepickerMode === self.minMode) {
	      var dt = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : new Date(0, 0, 0, 0, 0, 0, 0);
	      dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
	      ngModelCtrl.$setViewValue(dt);
	      ngModelCtrl.$render();
	    } else {
	      self.activeDate = date;
	      $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1];
	    }
	  };

	  $scope.move = function(direction) {
	    var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
	        month = self.activeDate.getMonth() + direction * (self.step.months || 0);
	    self.activeDate.setFullYear(year, month, 1);
	    self.refreshView();
	  };

	  $scope.toggleMode = function(direction) {
	    direction = direction || 1;

	    if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
	      return;
	    }

	    $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction];
	  };

	  // Key event mapper
	  $scope.keys = { 13: 'enter', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

	  var focusElement = function() {
	    self.element[0].focus();
	  };

	  // Listen for focus requests from popup directive
	  $scope.$on('uib:datepicker.focus', focusElement);

	  $scope.keydown = function(evt) {
	    var key = $scope.keys[evt.which];

	    if (!key || evt.shiftKey || evt.altKey) {
	      return;
	    }

	    evt.preventDefault();
	    if (!self.shortcutPropagation) {
	      evt.stopPropagation();
	    }

	    if (key === 'enter' || key === 'space') {
	      if (self.isDisabled(self.activeDate)) {
	        return; // do nothing
	      }
	      $scope.select(self.activeDate);
	    } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
	      $scope.toggleMode(key === 'up' ? 1 : -1);
	    } else {
	      self.handleKeyDown(key, evt);
	      self.refreshView();
	    }
	  };
	}])

	.controller('UibDaypickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
	  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	  this.step = { months: 1 };
	  this.element = $element;
	  function getDaysInMonth(year, month) {
	    return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
	  }

	  this.init = function(ctrl) {
	    angular.extend(ctrl, this);
	    scope.showWeeks = ctrl.showWeeks;
	    ctrl.refreshView();
	  };

	  this.getDates = function(startDate, n) {
	    var dates = new Array(n), current = new Date(startDate), i = 0, date;
	    while (i < n) {
	      date = new Date(current);
	      dates[i++] = date;
	      current.setDate(current.getDate() + 1);
	    }
	    return dates;
	  };

	  this._refreshView = function() {
	    var year = this.activeDate.getFullYear(),
	      month = this.activeDate.getMonth(),
	      firstDayOfMonth = new Date(this.activeDate);

	    firstDayOfMonth.setFullYear(year, month, 1);

	    var difference = this.startingDay - firstDayOfMonth.getDay(),
	      numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
	      firstDate = new Date(firstDayOfMonth);

	    if (numDisplayedFromPreviousMonth > 0) {
	      firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
	    }

	    // 42 is the number of days on a six-month calendar
	    var days = this.getDates(firstDate, 42);
	    for (var i = 0; i < 42; i ++) {
	      days[i] = angular.extend(this.createDateObject(days[i], this.formatDay), {
	        secondary: days[i].getMonth() !== month,
	        uid: scope.uniqueId + '-' + i
	      });
	    }

	    scope.labels = new Array(7);
	    for (var j = 0; j < 7; j++) {
	      scope.labels[j] = {
	        abbr: dateFilter(days[j].date, this.formatDayHeader),
	        full: dateFilter(days[j].date, 'EEEE')
	      };
	    }

	    scope.title = dateFilter(this.activeDate, this.formatDayTitle);
	    scope.rows = this.split(days, 7);

	    if (scope.showWeeks) {
	      scope.weekNumbers = [];
	      var thursdayIndex = (4 + 7 - this.startingDay) % 7,
	          numWeeks = scope.rows.length;
	      for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
	        scope.weekNumbers.push(
	          getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
	      }
	    }
	  };

	  this.compare = function(date1, date2) {
	    return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()));
	  };

	  function getISO8601WeekNumber(date) {
	    var checkDate = new Date(date);
	    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
	    var time = checkDate.getTime();
	    checkDate.setMonth(0); // Compare with Jan 1
	    checkDate.setDate(1);
	    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	  }

	  this.handleKeyDown = function(key, evt) {
	    var date = this.activeDate.getDate();

	    if (key === 'left') {
	      date = date - 1;   // up
	    } else if (key === 'up') {
	      date = date - 7;   // down
	    } else if (key === 'right') {
	      date = date + 1;   // down
	    } else if (key === 'down') {
	      date = date + 7;
	    } else if (key === 'pageup' || key === 'pagedown') {
	      var month = this.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
	      this.activeDate.setMonth(month, 1);
	      date = Math.min(getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth()), date);
	    } else if (key === 'home') {
	      date = 1;
	    } else if (key === 'end') {
	      date = getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth());
	    }
	    this.activeDate.setDate(date);
	  };
	}])

	.controller('UibMonthpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
	  this.step = { years: 1 };
	  this.element = $element;

	  this.init = function(ctrl) {
	    angular.extend(ctrl, this);
	    ctrl.refreshView();
	  };

	  this._refreshView = function() {
	    var months = new Array(12),
	        year = this.activeDate.getFullYear(),
	        date;

	    for (var i = 0; i < 12; i++) {
	      date = new Date(this.activeDate);
	      date.setFullYear(year, i, 1);
	      months[i] = angular.extend(this.createDateObject(date, this.formatMonth), {
	        uid: scope.uniqueId + '-' + i
	      });
	    }

	    scope.title = dateFilter(this.activeDate, this.formatMonthTitle);
	    scope.rows = this.split(months, 3);
	  };

	  this.compare = function(date1, date2) {
	    return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth());
	  };

	  this.handleKeyDown = function(key, evt) {
	    var date = this.activeDate.getMonth();

	    if (key === 'left') {
	      date = date - 1;   // up
	    } else if (key === 'up') {
	      date = date - 3;   // down
	    } else if (key === 'right') {
	      date = date + 1;   // down
	    } else if (key === 'down') {
	      date = date + 3;
	    } else if (key === 'pageup' || key === 'pagedown') {
	      var year = this.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
	      this.activeDate.setFullYear(year);
	    } else if (key === 'home') {
	      date = 0;
	    } else if (key === 'end') {
	      date = 11;
	    }
	    this.activeDate.setMonth(date);
	  };
	}])

	.controller('UibYearpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
	  var range;
	  this.element = $element;

	  function getStartingYear(year) {
	    return parseInt((year - 1) / range, 10) * range + 1;
	  }

	  this.yearpickerInit = function() {
	    range = this.yearRange;
	    this.step = { years: range };
	  };

	  this._refreshView = function() {
	    var years = new Array(range), date;

	    for (var i = 0, start = getStartingYear(this.activeDate.getFullYear()); i < range; i++) {
	      date = new Date(this.activeDate);
	      date.setFullYear(start + i, 0, 1);
	      years[i] = angular.extend(this.createDateObject(date, this.formatYear), {
	        uid: scope.uniqueId + '-' + i
	      });
	    }

	    scope.title = [years[0].label, years[range - 1].label].join(' - ');
	    scope.rows = this.split(years, 5);
	  };

	  this.compare = function(date1, date2) {
	    return date1.getFullYear() - date2.getFullYear();
	  };

	  this.handleKeyDown = function(key, evt) {
	    var date = this.activeDate.getFullYear();

	    if (key === 'left') {
	      date = date - 1;   // up
	    } else if (key === 'up') {
	      date = date - 5;   // down
	    } else if (key === 'right') {
	      date = date + 1;   // down
	    } else if (key === 'down') {
	      date = date + 5;
	    } else if (key === 'pageup' || key === 'pagedown') {
	      date += (key === 'pageup' ? - 1 : 1) * this.step.years;
	    } else if (key === 'home') {
	      date = getStartingYear(this.activeDate.getFullYear());
	    } else if (key === 'end') {
	      date = getStartingYear(this.activeDate.getFullYear()) + range - 1;
	    }
	    this.activeDate.setFullYear(date);
	  };
	}])

	.directive('uibDatepicker', function() {
	  return {
	    replace: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/datepicker/datepicker.html';
	    },
	    scope: {
	      datepickerMode: '=?',
	      dateDisabled: '&',
	      customClass: '&',
	      shortcutPropagation: '&?'
	    },
	    require: ['uibDatepicker', '^ngModel'],
	    controller: 'UibDatepickerController',
	    controllerAs: 'datepicker',
	    link: function(scope, element, attrs, ctrls) {
	      var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      datepickerCtrl.init(ngModelCtrl);
	    }
	  };
	})

	.directive('uibDaypicker', function() {
	  return {
	    replace: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/datepicker/day.html';
	    },
	    require: ['^?uibDatepicker', 'uibDaypicker', '^?datepicker'],
	    controller: 'UibDaypickerController',
	    link: function(scope, element, attrs, ctrls) {
	      var datepickerCtrl = ctrls[0] || ctrls[2],
	        daypickerCtrl = ctrls[1];

	      daypickerCtrl.init(datepickerCtrl);
	    }
	  };
	})

	.directive('uibMonthpicker', function() {
	  return {
	    replace: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/datepicker/month.html';
	    },
	    require: ['^?uibDatepicker', 'uibMonthpicker', '^?datepicker'],
	    controller: 'UibMonthpickerController',
	    link: function(scope, element, attrs, ctrls) {
	      var datepickerCtrl = ctrls[0] || ctrls[2],
	        monthpickerCtrl = ctrls[1];

	      monthpickerCtrl.init(datepickerCtrl);
	    }
	  };
	})

	.directive('uibYearpicker', function() {
	  return {
	    replace: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/datepicker/year.html';
	    },
	    require: ['^?uibDatepicker', 'uibYearpicker', '^?datepicker'],
	    controller: 'UibYearpickerController',
	    link: function(scope, element, attrs, ctrls) {
	      var ctrl = ctrls[0] || ctrls[2];
	      angular.extend(ctrl, ctrls[1]);
	      ctrl.yearpickerInit();

	      ctrl.refreshView();
	    }
	  };
	})

	.constant('uibDatepickerPopupConfig', {
	  datepickerPopup: 'yyyy-MM-dd',
	  datepickerPopupTemplateUrl: 'template/datepicker/popup.html',
	  datepickerTemplateUrl: 'template/datepicker/datepicker.html',
	  html5Types: {
	    date: 'yyyy-MM-dd',
	    'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
	    'month': 'yyyy-MM'
	  },
	  currentText: 'Today',
	  clearText: 'Clear',
	  closeText: 'Done',
	  closeOnDateSelection: true,
	  appendToBody: false,
	  showButtonBar: true,
	  onOpenFocus: true
	})

	.controller('UibDatepickerPopupController', ['$scope', '$element', '$attrs', '$compile', '$parse', '$document', '$rootScope', '$uibPosition', 'dateFilter', 'uibDateParser', 'uibDatepickerPopupConfig', '$timeout',
	function(scope, element, attrs, $compile, $parse, $document, $rootScope, $position, dateFilter, dateParser, datepickerPopupConfig, $timeout) {
	  var self = this;
	  var cache = {},
	    isHtml5DateInput = false;
	  var dateFormat, closeOnDateSelection, appendToBody, onOpenFocus,
	    datepickerPopupTemplateUrl, datepickerTemplateUrl, popupEl, datepickerEl,
	    ngModel, $popup;

	  scope.watchData = {};

	  this.init = function(_ngModel_) {
	    ngModel = _ngModel_;
	    closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection;
	    appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;
	    onOpenFocus = angular.isDefined(attrs.onOpenFocus) ? scope.$parent.$eval(attrs.onOpenFocus) : datepickerPopupConfig.onOpenFocus;
	    datepickerPopupTemplateUrl = angular.isDefined(attrs.datepickerPopupTemplateUrl) ? attrs.datepickerPopupTemplateUrl : datepickerPopupConfig.datepickerPopupTemplateUrl;
	    datepickerTemplateUrl = angular.isDefined(attrs.datepickerTemplateUrl) ? attrs.datepickerTemplateUrl : datepickerPopupConfig.datepickerTemplateUrl;

	    scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

	    if (datepickerPopupConfig.html5Types[attrs.type]) {
	      dateFormat = datepickerPopupConfig.html5Types[attrs.type];
	      isHtml5DateInput = true;
	    } else {
	      dateFormat = attrs.datepickerPopup || attrs.uibDatepickerPopup || datepickerPopupConfig.datepickerPopup;
	      attrs.$observe('uibDatepickerPopup', function(value, oldValue) {
	          var newDateFormat = value || datepickerPopupConfig.datepickerPopup;
	          // Invalidate the $modelValue to ensure that formatters re-run
	          // FIXME: Refactor when PR is merged: https://github.com/angular/angular.js/pull/10764
	          if (newDateFormat !== dateFormat) {
	            dateFormat = newDateFormat;
	            ngModel.$modelValue = null;

	            if (!dateFormat) {
	              throw new Error('uibDatepickerPopup must have a date format specified.');
	            }
	          }
	      });
	    }

	    if (!dateFormat) {
	      throw new Error('uibDatepickerPopup must have a date format specified.');
	    }

	    if (isHtml5DateInput && attrs.datepickerPopup) {
	      throw new Error('HTML5 date input types do not support custom formats.');
	    }

	    // popup element used to display calendar
	    popupEl = angular.element('<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>');
	    popupEl.attr({
	      'ng-model': 'date',
	      'ng-change': 'dateSelection(date)',
	      'template-url': datepickerPopupTemplateUrl
	    });

	    // datepicker element
	    datepickerEl = angular.element(popupEl.children()[0]);
	    datepickerEl.attr('template-url', datepickerTemplateUrl);

	    if (isHtml5DateInput) {
	      if (attrs.type === 'month') {
	        datepickerEl.attr('datepicker-mode', '"month"');
	        datepickerEl.attr('min-mode', 'month');
	      }
	    }

	    if (attrs.datepickerOptions) {
	      var options = scope.$parent.$eval(attrs.datepickerOptions);
	      if (options && options.initDate) {
	        scope.initDate = options.initDate;
	        datepickerEl.attr('init-date', 'initDate');
	        delete options.initDate;
	      }
	      angular.forEach(options, function(value, option) {
	        datepickerEl.attr(cameltoDash(option), value);
	      });
	    }

	    angular.forEach(['minMode', 'maxMode', 'minDate', 'maxDate', 'datepickerMode', 'initDate', 'shortcutPropagation'], function(key) {
	      if (attrs[key]) {
	        var getAttribute = $parse(attrs[key]);
	        scope.$parent.$watch(getAttribute, function(value) {
	          scope.watchData[key] = value;
	          if (key === 'minDate' || key === 'maxDate') {
	            cache[key] = new Date(value);
	          }
	        });
	        datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

	        // Propagate changes from datepicker to outside
	        if (key === 'datepickerMode') {
	          var setAttribute = getAttribute.assign;
	          scope.$watch('watchData.' + key, function(value, oldvalue) {
	            if (angular.isFunction(setAttribute) && value !== oldvalue) {
	              setAttribute(scope.$parent, value);
	            }
	          });
	        }
	      }
	    });
	    if (attrs.dateDisabled) {
	      datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
	    }

	    if (attrs.showWeeks) {
	      datepickerEl.attr('show-weeks', attrs.showWeeks);
	    }

	    if (attrs.customClass) {
	      datepickerEl.attr('custom-class', 'customClass({ date: date, mode: mode })');
	    }

	    if (!isHtml5DateInput) {
	      // Internal API to maintain the correct ng-invalid-[key] class
	      ngModel.$$parserName = 'date';
	      ngModel.$validators.date = validator;
	      ngModel.$parsers.unshift(parseDate);
	      ngModel.$formatters.push(function(value) {
	        scope.date = value;
	        return ngModel.$isEmpty(value) ? value : dateFilter(value, dateFormat);
	      });
	    } else {
	      ngModel.$formatters.push(function(value) {
	        scope.date = value;
	        return value;
	      });
	    }

	    // Detect changes in the view from the text box
	    ngModel.$viewChangeListeners.push(function() {
	      scope.date = dateParser.parse(ngModel.$viewValue, dateFormat, scope.date);
	    });

	    element.bind('keydown', inputKeydownBind);

	    $popup = $compile(popupEl)(scope);
	    // Prevent jQuery cache memory leak (template is now redundant after linking)
	    popupEl.remove();

	    if (appendToBody) {
	      $document.find('body').append($popup);
	    } else {
	      element.after($popup);
	    }

	    scope.$on('$destroy', function() {
	      if (scope.isOpen === true) {
	        if (!$rootScope.$$phase) {
	          scope.$apply(function() {
	            scope.isOpen = false;
	          });
	        }
	      }

	      $popup.remove();
	      element.unbind('keydown', inputKeydownBind);
	      $document.unbind('click', documentClickBind);
	    });
	  };

	  scope.getText = function(key) {
	    return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
	  };

	  scope.isDisabled = function(date) {
	    if (date === 'today') {
	      date = new Date();
	    }

	    return ((scope.watchData.minDate && scope.compare(date, cache.minDate) < 0) ||
	      (scope.watchData.maxDate && scope.compare(date, cache.maxDate) > 0));
	  };

	  scope.compare = function(date1, date2) {
	    return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()));
	  };

	  // Inner change
	  scope.dateSelection = function(dt) {
	    if (angular.isDefined(dt)) {
	      scope.date = dt;
	    }
	    var date = scope.date ? dateFilter(scope.date, dateFormat) : null; // Setting to NULL is necessary for form validators to function
	    element.val(date);
	    ngModel.$setViewValue(date);

	    if (closeOnDateSelection) {
	      scope.isOpen = false;
	      element[0].focus();
	    }
	  };

	  scope.keydown = function(evt) {
	    if (evt.which === 27) {
	      scope.isOpen = false;
	      element[0].focus();
	    }
	  };

	  scope.select = function(date) {
	    if (date === 'today') {
	      var today = new Date();
	      if (angular.isDate(scope.date)) {
	        date = new Date(scope.date);
	        date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
	      } else {
	        date = new Date(today.setHours(0, 0, 0, 0));
	      }
	    }
	    scope.dateSelection(date);
	  };

	  scope.close = function() {
	    scope.isOpen = false;
	    element[0].focus();
	  };

	  scope.$watch('isOpen', function(value) {
	    if (value) {
	      scope.position = appendToBody ? $position.offset(element) : $position.position(element);
	      scope.position.top = scope.position.top + element.prop('offsetHeight');

	      $timeout(function() {
	        if (onOpenFocus) {
	          scope.$broadcast('uib:datepicker.focus');
	        }
	        $document.bind('click', documentClickBind);
	      }, 0, false);
	    } else {
	      $document.unbind('click', documentClickBind);
	    }
	  });

	  function cameltoDash(string) {
	    return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
	  }

	  function parseDate(viewValue) {
	    if (angular.isNumber(viewValue)) {
	      // presumably timestamp to date object
	      viewValue = new Date(viewValue);
	    }

	    if (!viewValue) {
	      return null;
	    } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
	      return viewValue;
	    } else if (angular.isString(viewValue)) {
	      var date = dateParser.parse(viewValue, dateFormat, scope.date);
	      if (isNaN(date)) {
	        return undefined;
	      } else {
	        return date;
	      }
	    } else {
	      return undefined;
	    }
	  }

	  function validator(modelValue, viewValue) {
	    var value = modelValue || viewValue;

	    if (!attrs.ngRequired && !value) {
	      return true;
	    }

	    if (angular.isNumber(value)) {
	      value = new Date(value);
	    }
	    if (!value) {
	      return true;
	    } else if (angular.isDate(value) && !isNaN(value)) {
	      return true;
	    } else if (angular.isString(value)) {
	      var date = dateParser.parse(value, dateFormat);
	      return !isNaN(date);
	    } else {
	      return false;
	    }
	  }

	  function documentClickBind(event) {
	    var popup = $popup[0];
	    var dpContainsTarget = element[0].contains(event.target);
	    // The popup node may not be an element node
	    // In some browsers (IE) only element nodes have the 'contains' function
	    var popupContainsTarget = popup.contains !== undefined && popup.contains(event.target);
	    if (scope.isOpen && !(dpContainsTarget || popupContainsTarget)) {
	      scope.$apply(function() {
	        scope.isOpen = false;
	      });
	    }
	  }

	  function inputKeydownBind(evt) {
	    if (evt.which === 27 && scope.isOpen) {
	      evt.preventDefault();
	      evt.stopPropagation();
	      scope.$apply(function() {
	        scope.isOpen = false;
	      });
	      element[0].focus();
	    } else if (evt.which === 40 && !scope.isOpen) {
	      evt.preventDefault();
	      evt.stopPropagation();
	      scope.$apply(function() {
	        scope.isOpen = true;
	      });
	    }
	  }
	}])

	.directive('uibDatepickerPopup', function() {
	  return {
	    require: ['ngModel', 'uibDatepickerPopup'],
	    controller: 'UibDatepickerPopupController',
	    scope: {
	      isOpen: '=?',
	      currentText: '@',
	      clearText: '@',
	      closeText: '@',
	      dateDisabled: '&',
	      customClass: '&'
	    },
	    link: function(scope, element, attrs, ctrls) {
	      var ngModel = ctrls[0],
	        ctrl = ctrls[1];

	      ctrl.init(ngModel);
	    }
	  };
	})

	.directive('uibDatepickerPopupWrap', function() {
	  return {
	    replace: true,
	    transclude: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/datepicker/popup.html';
	    }
	  };
	});

	/* Deprecated datepicker below */

	angular.module('ui.bootstrap.datepicker')

	.value('$datepickerSuppressWarning', false)

	.controller('DatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$log', 'dateFilter', 'uibDatepickerConfig', '$datepickerSuppressError', '$datepickerSuppressWarning', function($scope, $attrs, $parse, $interpolate, $log, dateFilter, datepickerConfig, $datepickerSuppressError, $datepickerSuppressWarning) {
	  if (!$datepickerSuppressWarning) {
	    $log.warn('DatepickerController is now deprecated. Use UibDatepickerController instead.');
	  }

	  var self = this,
	    ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

	  this.modes = ['day', 'month', 'year'];

	  angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
	    'showWeeks', 'startingDay', 'yearRange', 'shortcutPropagation'], function(key, index) {
	    self[key] = angular.isDefined($attrs[key]) ? (index < 6 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
	  });

	  angular.forEach(['minDate', 'maxDate'], function(key) {
	    if ($attrs[key]) {
	      $scope.$parent.$watch($parse($attrs[key]), function(value) {
	        self[key] = value ? new Date(value) : null;
	        self.refreshView();
	      });
	    } else {
	      self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
	    }
	  });

	  angular.forEach(['minMode', 'maxMode'], function(key) {
	    if ($attrs[key]) {
	      $scope.$parent.$watch($parse($attrs[key]), function(value) {
	        self[key] = angular.isDefined(value) ? value : $attrs[key];
	        $scope[key] = self[key];
	        if ((key == 'minMode' && self.modes.indexOf($scope.datepickerMode) < self.modes.indexOf(self[key])) || (key == 'maxMode' && self.modes.indexOf($scope.datepickerMode) > self.modes.indexOf(self[key]))) {
	          $scope.datepickerMode = self[key];
	        }
	      });
	    } else {
	      self[key] = datepickerConfig[key] || null;
	      $scope[key] = self[key];
	    }
	  });

	  $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
	  $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

	  if (angular.isDefined($attrs.initDate)) {
	    this.activeDate = $scope.$parent.$eval($attrs.initDate) || new Date();
	    $scope.$parent.$watch($attrs.initDate, function(initDate) {
	      if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
	        self.activeDate = initDate;
	        self.refreshView();
	      }
	    });
	  } else {
	    this.activeDate = new Date();
	  }

	  $scope.isActive = function(dateObject) {
	    if (self.compare(dateObject.date, self.activeDate) === 0) {
	      $scope.activeDateId = dateObject.uid;
	      return true;
	    }
	    return false;
	  };

	  this.init = function(ngModelCtrl_) {
	    ngModelCtrl = ngModelCtrl_;

	    ngModelCtrl.$render = function() {
	      self.render();
	    };
	  };

	  this.render = function() {
	    if (ngModelCtrl.$viewValue) {
	      var date = new Date(ngModelCtrl.$viewValue),
	        isValid = !isNaN(date);

	      if (isValid) {
	        this.activeDate = date;
	      } else if (!$datepickerSuppressError) {
	        $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
	      }
	    }
	    this.refreshView();
	  };

	  this.refreshView = function() {
	    if (this.element) {
	      this._refreshView();

	      var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
	      ngModelCtrl.$setValidity('dateDisabled', !date || (this.element && !this.isDisabled(date)));
	    }
	  };

	  this.createDateObject = function(date, format) {
	    var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
	    return {
	      date: date,
	      label: dateFilter(date, format),
	      selected: model && this.compare(date, model) === 0,
	      disabled: this.isDisabled(date),
	      current: this.compare(date, new Date()) === 0,
	      customClass: this.customClass(date)
	    };
	  };

	  this.isDisabled = function(date) {
	    return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
	  };

	  this.customClass = function(date) {
	    return $scope.customClass({date: date, mode: $scope.datepickerMode});
	  };

	  // Split array into smaller arrays
	  this.split = function(arr, size) {
	    var arrays = [];
	    while (arr.length > 0) {
	      arrays.push(arr.splice(0, size));
	    }
	    return arrays;
	  };

	  this.fixTimeZone = function(date) {
	    var hours = date.getHours();
	    date.setHours(hours === 23 ? hours + 2 : 0);
	  };

	  $scope.select = function(date) {
	    if ($scope.datepickerMode === self.minMode) {
	      var dt = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : new Date(0, 0, 0, 0, 0, 0, 0);
	      dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
	      ngModelCtrl.$setViewValue(dt);
	      ngModelCtrl.$render();
	    } else {
	      self.activeDate = date;
	      $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1];
	    }
	  };

	  $scope.move = function(direction) {
	    var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
	      month = self.activeDate.getMonth() + direction * (self.step.months || 0);
	    self.activeDate.setFullYear(year, month, 1);
	    self.refreshView();
	  };

	  $scope.toggleMode = function(direction) {
	    direction = direction || 1;

	    if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
	      return;
	    }

	    $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction];
	  };

	  // Key event mapper
	  $scope.keys = { 13: 'enter', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

	  var focusElement = function() {
	    self.element[0].focus();
	  };

	  $scope.$on('uib:datepicker.focus', focusElement);

	  $scope.keydown = function(evt) {
	    var key = $scope.keys[evt.which];

	    if (!key || evt.shiftKey || evt.altKey) {
	      return;
	    }

	    evt.preventDefault();
	    if (!self.shortcutPropagation) {
	      evt.stopPropagation();
	    }

	    if (key === 'enter' || key === 'space') {
	      if (self.isDisabled(self.activeDate)) {
	        return; // do nothing
	      }
	      $scope.select(self.activeDate);
	    } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
	      $scope.toggleMode(key === 'up' ? 1 : -1);
	    } else {
	      self.handleKeyDown(key, evt);
	      self.refreshView();
	    }
	  };
	}])

	.directive('datepicker', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
	  return {
	    replace: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/datepicker/datepicker.html';
	    },
	    scope: {
	      datepickerMode: '=?',
	      dateDisabled: '&',
	      customClass: '&',
	      shortcutPropagation: '&?'
	    },
	    require: ['datepicker', '^ngModel'],
	    controller: 'DatepickerController',
	    controllerAs: 'datepicker',
	    link: function(scope, element, attrs, ctrls) {
	      if (!$datepickerSuppressWarning) {
	        $log.warn('datepicker is now deprecated. Use uib-datepicker instead.');
	      }

	      var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      datepickerCtrl.init(ngModelCtrl);
	    }
	  };
	}])

	.directive('daypicker', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
	  return {
	    replace: true,
	    templateUrl: 'template/datepicker/day.html',
	    require: ['^datepicker', 'daypicker'],
	    controller: 'UibDaypickerController',
	    link: function(scope, element, attrs, ctrls) {
	      if (!$datepickerSuppressWarning) {
	        $log.warn('daypicker is now deprecated. Use uib-daypicker instead.');
	      }

	      var datepickerCtrl = ctrls[0],
	        daypickerCtrl = ctrls[1];

	      daypickerCtrl.init(datepickerCtrl);
	    }
	  };
	}])

	.directive('monthpicker', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
	  return {
	    replace: true,
	    templateUrl: 'template/datepicker/month.html',
	    require: ['^datepicker', 'monthpicker'],
	    controller: 'UibMonthpickerController',
	    link: function(scope, element, attrs, ctrls) {
	      if (!$datepickerSuppressWarning) {
	        $log.warn('monthpicker is now deprecated. Use uib-monthpicker instead.');
	      }

	      var datepickerCtrl = ctrls[0],
	        monthpickerCtrl = ctrls[1];

	      monthpickerCtrl.init(datepickerCtrl);
	    }
	  };
	}])

	.directive('yearpicker', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
	  return {
	    replace: true,
	    templateUrl: 'template/datepicker/year.html',
	    require: ['^datepicker', 'yearpicker'],
	    controller: 'UibYearpickerController',
	    link: function(scope, element, attrs, ctrls) {
	      if (!$datepickerSuppressWarning) {
	        $log.warn('yearpicker is now deprecated. Use uib-yearpicker instead.');
	      }

	      var ctrl = ctrls[0];
	      angular.extend(ctrl, ctrls[1]);
	      ctrl.yearpickerInit();

	      ctrl.refreshView();
	    }
	  };
	}])

	.directive('datepickerPopup', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
	  return {
	    require: ['ngModel', 'datepickerPopup'],
	    controller: 'UibDatepickerPopupController',
	    scope: {
	      isOpen: '=?',
	      currentText: '@',
	      clearText: '@',
	      closeText: '@',
	      dateDisabled: '&',
	      customClass: '&'
	    },
	    link: function(scope, element, attrs, ctrls) {
	      if (!$datepickerSuppressWarning) {
	        $log.warn('datepicker-popup is now deprecated. Use uib-datepicker-popup instead.');
	      }

	      var ngModel = ctrls[0],
	        ctrl = ctrls[1];

	      ctrl.init(ngModel);
	    }
	  };
	}])

	.directive('datepickerPopupWrap', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
	  return {
	    replace: true,
	    transclude: true,
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/datepicker/popup.html';
	    },
	    link: function() {
	      if (!$datepickerSuppressWarning) {
	        $log.warn('datepicker-popup-wrap is now deprecated. Use uib-datepicker-popup-wrap instead.');
	      }
	    }
	  };
	}]);

	angular.module('ui.bootstrap.dropdown', ['ui.bootstrap.position'])

	.constant('uibDropdownConfig', {
	  openClass: 'open'
	})

	.service('uibDropdownService', ['$document', '$rootScope', function($document, $rootScope) {
	  var openScope = null;

	  this.open = function(dropdownScope) {
	    if (!openScope) {
	      $document.bind('click', closeDropdown);
	      $document.bind('keydown', keybindFilter);
	    }

	    if (openScope && openScope !== dropdownScope) {
	      openScope.isOpen = false;
	    }

	    openScope = dropdownScope;
	  };

	  this.close = function(dropdownScope) {
	    if (openScope === dropdownScope) {
	      openScope = null;
	      $document.unbind('click', closeDropdown);
	      $document.unbind('keydown', keybindFilter);
	    }
	  };

	  var closeDropdown = function(evt) {
	    // This method may still be called during the same mouse event that
	    // unbound this event handler. So check openScope before proceeding.
	    if (!openScope) { return; }

	    if (evt && openScope.getAutoClose() === 'disabled')  { return ; }

	    var toggleElement = openScope.getToggleElement();
	    if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
	      return;
	    }

	    var dropdownElement = openScope.getDropdownElement();
	    if (evt && openScope.getAutoClose() === 'outsideClick' &&
	      dropdownElement && dropdownElement[0].contains(evt.target)) {
	      return;
	    }

	    openScope.isOpen = false;

	    if (!$rootScope.$$phase) {
	      openScope.$apply();
	    }
	  };

	  var keybindFilter = function(evt) {
	    if (evt.which === 27) {
	      openScope.focusToggleElement();
	      closeDropdown();
	    } else if (openScope.isKeynavEnabled() && /(38|40)/.test(evt.which) && openScope.isOpen) {
	      evt.preventDefault();
	      evt.stopPropagation();
	      openScope.focusDropdownEntry(evt.which);
	    }
	  };
	}])

	.controller('UibDropdownController', ['$scope', '$element', '$attrs', '$parse', 'uibDropdownConfig', 'uibDropdownService', '$animate', '$uibPosition', '$document', '$compile', '$templateRequest', function($scope, $element, $attrs, $parse, dropdownConfig, uibDropdownService, $animate, $position, $document, $compile, $templateRequest) {
	  var self = this,
	    scope = $scope.$new(), // create a child scope so we are not polluting original one
	    templateScope,
	    openClass = dropdownConfig.openClass,
	    getIsOpen,
	    setIsOpen = angular.noop,
	    toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop,
	    appendToBody = false,
	    keynavEnabled =false,
	    selectedOption = null;


	  $element.addClass('dropdown');

	  this.init = function() {
	    if ($attrs.isOpen) {
	      getIsOpen = $parse($attrs.isOpen);
	      setIsOpen = getIsOpen.assign;

	      $scope.$watch(getIsOpen, function(value) {
	        scope.isOpen = !!value;
	      });
	    }

	    appendToBody = angular.isDefined($attrs.dropdownAppendToBody);
	    keynavEnabled = angular.isDefined($attrs.uibKeyboardNav);

	    if (appendToBody && self.dropdownMenu) {
	      $document.find('body').append(self.dropdownMenu);
	      $element.on('$destroy', function handleDestroyEvent() {
	        self.dropdownMenu.remove();
	      });
	    }
	  };

	  this.toggle = function(open) {
	    return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
	  };

	  // Allow other directives to watch status
	  this.isOpen = function() {
	    return scope.isOpen;
	  };

	  scope.getToggleElement = function() {
	    return self.toggleElement;
	  };

	  scope.getAutoClose = function() {
	    return $attrs.autoClose || 'always'; //or 'outsideClick' or 'disabled'
	  };

	  scope.getElement = function() {
	    return $element;
	  };

	  scope.isKeynavEnabled = function() {
	    return keynavEnabled;
	  };

	  scope.focusDropdownEntry = function(keyCode) {
	    var elems = self.dropdownMenu ? //If append to body is used.
	      (angular.element(self.dropdownMenu).find('a')) :
	      (angular.element($element).find('ul').eq(0).find('a'));

	    switch (keyCode) {
	      case (40): {
	        if (!angular.isNumber(self.selectedOption)) {
	          self.selectedOption = 0;
	        } else {
	          self.selectedOption = (self.selectedOption === elems.length - 1 ?
	            self.selectedOption :
	            self.selectedOption + 1);
	        }
	        break;
	      }
	      case (38): {
	        if (!angular.isNumber(self.selectedOption)) {
	          self.selectedOption = elems.length - 1;
	        } else {
	          self.selectedOption = self.selectedOption === 0 ?
	            0 : self.selectedOption - 1;
	        }
	        break;
	      }
	    }
	    elems[self.selectedOption].focus();
	  };

	  scope.getDropdownElement = function() {
	    return self.dropdownMenu;
	  };

	  scope.focusToggleElement = function() {
	    if (self.toggleElement) {
	      self.toggleElement[0].focus();
	    }
	  };

	  scope.$watch('isOpen', function(isOpen, wasOpen) {
	    if (appendToBody && self.dropdownMenu) {
	      var pos = $position.positionElements($element, self.dropdownMenu, 'bottom-left', true);
	      var css = {
	        top: pos.top + 'px',
	        display: isOpen ? 'block' : 'none'
	      };

	      var rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');
	      if (!rightalign) {
	        css.left = pos.left + 'px';
	        css.right = 'auto';
	      } else {
	        css.left = 'auto';
	        css.right = (window.innerWidth - (pos.left + $element.prop('offsetWidth'))) + 'px';
	      }

	      self.dropdownMenu.css(css);
	    }

	    $animate[isOpen ? 'addClass' : 'removeClass']($element, openClass).then(function() {
	      if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
	        toggleInvoker($scope, { open: !!isOpen });
	      }
	    });

	    if (isOpen) {
	      if (self.dropdownMenuTemplateUrl) {
	        $templateRequest(self.dropdownMenuTemplateUrl).then(function(tplContent) {
	          templateScope = scope.$new();
	          $compile(tplContent.trim())(templateScope, function(dropdownElement) {
	            var newEl = dropdownElement;
	            self.dropdownMenu.replaceWith(newEl);
	            self.dropdownMenu = newEl;
	          });
	        });
	      }

	      scope.focusToggleElement();
	      uibDropdownService.open(scope);
	    } else {
	      if (self.dropdownMenuTemplateUrl) {
	        if (templateScope) {
	          templateScope.$destroy();
	        }
	        var newEl = angular.element('<ul class="dropdown-menu"></ul>');
	        self.dropdownMenu.replaceWith(newEl);
	        self.dropdownMenu = newEl;
	      }

	      uibDropdownService.close(scope);
	      self.selectedOption = null;
	    }

	    if (angular.isFunction(setIsOpen)) {
	      setIsOpen($scope, isOpen);
	    }
	  });

	  $scope.$on('$locationChangeSuccess', function() {
	    if (scope.getAutoClose() !== 'disabled') {
	      scope.isOpen = false;
	    }
	  });

	  var offDestroy = $scope.$on('$destroy', function() {
	    scope.$destroy();
	  });
	  scope.$on('$destroy', offDestroy);
	}])

	.directive('uibDropdown', function() {
	  return {
	    controller: 'UibDropdownController',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      dropdownCtrl.init();
	    }
	  };
	})

	.directive('uibDropdownMenu', function() {
	  return {
	    restrict: 'AC',
	    require: '?^uibDropdown',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      if (!dropdownCtrl || angular.isDefined(attrs.dropdownNested)) {
	        return;
	      }

	      element.addClass('dropdown-menu');

	      var tplUrl = attrs.templateUrl;
	      if (tplUrl) {
	        dropdownCtrl.dropdownMenuTemplateUrl = tplUrl;
	      }

	      if (!dropdownCtrl.dropdownMenu) {
	        dropdownCtrl.dropdownMenu = element;
	      }
	    }
	  };
	})

	.directive('uibKeyboardNav', function() {
	  return {
	    restrict: 'A',
	    require: '?^uibDropdown',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      element.bind('keydown', function(e) {
	        if ([38, 40].indexOf(e.which) !== -1) {
	          e.preventDefault();
	          e.stopPropagation();

	          var elems = dropdownCtrl.dropdownMenu.find('a');

	          switch (e.which) {
	            case (40): { // Down
	              if (!angular.isNumber(dropdownCtrl.selectedOption)) {
	                dropdownCtrl.selectedOption = 0;
	              } else {
	                dropdownCtrl.selectedOption = dropdownCtrl.selectedOption === elems.length -1 ?
	                  dropdownCtrl.selectedOption : dropdownCtrl.selectedOption + 1;
	              }
	              break;
	            }
	            case (38): { // Up
	              if (!angular.isNumber(dropdownCtrl.selectedOption)) {
	                dropdownCtrl.selectedOption = elems.length - 1;
	              } else {
	                dropdownCtrl.selectedOption = dropdownCtrl.selectedOption === 0 ?
	                  0 : dropdownCtrl.selectedOption - 1;
	              }
	              break;
	            }
	          }
	          elems[dropdownCtrl.selectedOption].focus();
	        }
	      });
	    }
	  };
	})

	.directive('uibDropdownToggle', function() {
	  return {
	    require: '?^uibDropdown',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      if (!dropdownCtrl) {
	        return;
	      }

	      element.addClass('dropdown-toggle');

	      dropdownCtrl.toggleElement = element;

	      var toggleDropdown = function(event) {
	        event.preventDefault();

	        if (!element.hasClass('disabled') && !attrs.disabled) {
	          scope.$apply(function() {
	            dropdownCtrl.toggle();
	          });
	        }
	      };

	      element.bind('click', toggleDropdown);

	      // WAI-ARIA
	      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
	      scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
	        element.attr('aria-expanded', !!isOpen);
	      });

	      scope.$on('$destroy', function() {
	        element.unbind('click', toggleDropdown);
	      });
	    }
	  };
	});

	/* Deprecated dropdown below */

	angular.module('ui.bootstrap.dropdown')

	.value('$dropdownSuppressWarning', false)

	.service('dropdownService', ['$log', '$dropdownSuppressWarning', 'uibDropdownService', function($log, $dropdownSuppressWarning, uibDropdownService) {
	  if (!$dropdownSuppressWarning) {
	    $log.warn('dropdownService is now deprecated. Use uibDropdownService instead.');
	  }

	  angular.extend(this, uibDropdownService);
	}])

	.controller('DropdownController', ['$scope', '$element', '$attrs', '$parse', 'uibDropdownConfig', 'uibDropdownService', '$animate', '$uibPosition', '$document', '$compile', '$templateRequest', '$log', '$dropdownSuppressWarning', function($scope, $element, $attrs, $parse, dropdownConfig, uibDropdownService, $animate, $position, $document, $compile, $templateRequest, $log, $dropdownSuppressWarning) {
	  if (!$dropdownSuppressWarning) {
	    $log.warn('DropdownController is now deprecated. Use UibDropdownController instead.');
	  }

	  var self = this,
	    scope = $scope.$new(), // create a child scope so we are not polluting original one
	    templateScope,
	    openClass = dropdownConfig.openClass,
	    getIsOpen,
	    setIsOpen = angular.noop,
	    toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop,
	    appendToBody = false,
	    keynavEnabled =false,
	    selectedOption = null;


	  $element.addClass('dropdown');

	  this.init = function() {
	    if ($attrs.isOpen) {
	      getIsOpen = $parse($attrs.isOpen);
	      setIsOpen = getIsOpen.assign;

	      $scope.$watch(getIsOpen, function(value) {
	        scope.isOpen = !!value;
	      });
	    }

	    appendToBody = angular.isDefined($attrs.dropdownAppendToBody);
	    keynavEnabled = angular.isDefined($attrs.uibKeyboardNav);

	    if (appendToBody && self.dropdownMenu) {
	      $document.find('body').append(self.dropdownMenu);
	      $element.on('$destroy', function handleDestroyEvent() {
	        self.dropdownMenu.remove();
	      });
	    }
	  };

	  this.toggle = function(open) {
	    return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
	  };

	  // Allow other directives to watch status
	  this.isOpen = function() {
	    return scope.isOpen;
	  };

	  scope.getToggleElement = function() {
	    return self.toggleElement;
	  };

	  scope.getAutoClose = function() {
	    return $attrs.autoClose || 'always'; //or 'outsideClick' or 'disabled'
	  };

	  scope.getElement = function() {
	    return $element;
	  };

	  scope.isKeynavEnabled = function() {
	    return keynavEnabled;
	  };

	  scope.focusDropdownEntry = function(keyCode) {
	    var elems = self.dropdownMenu ? //If append to body is used.
	      (angular.element(self.dropdownMenu).find('a')) :
	      (angular.element($element).find('ul').eq(0).find('a'));

	    switch (keyCode) {
	      case (40): {
	        if (!angular.isNumber(self.selectedOption)) {
	          self.selectedOption = 0;
	        } else {
	          self.selectedOption = (self.selectedOption === elems.length -1 ?
	            self.selectedOption :
	          self.selectedOption + 1);
	        }
	        break;
	      }
	      case (38): {
	        if (!angular.isNumber(self.selectedOption)) {
	          self.selectedOption = elems.length - 1;
	        } else {
	          self.selectedOption = self.selectedOption === 0 ?
	            0 : self.selectedOption - 1;
	        }
	        break;
	      }
	    }
	    elems[self.selectedOption].focus();
	  };

	  scope.getDropdownElement = function() {
	    return self.dropdownMenu;
	  };

	  scope.focusToggleElement = function() {
	    if (self.toggleElement) {
	      self.toggleElement[0].focus();
	    }
	  };

	  scope.$watch('isOpen', function(isOpen, wasOpen) {
	    if (appendToBody && self.dropdownMenu) {
	      var pos = $position.positionElements($element, self.dropdownMenu, 'bottom-left', true);
	      var css = {
	        top: pos.top + 'px',
	        display: isOpen ? 'block' : 'none'
	      };

	      var rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');
	      if (!rightalign) {
	        css.left = pos.left + 'px';
	        css.right = 'auto';
	      } else {
	        css.left = 'auto';
	        css.right = (window.innerWidth - (pos.left + $element.prop('offsetWidth'))) + 'px';
	      }

	      self.dropdownMenu.css(css);
	    }

	    $animate[isOpen ? 'addClass' : 'removeClass']($element, openClass).then(function() {
	      if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
	        toggleInvoker($scope, { open: !!isOpen });
	      }
	    });

	    if (isOpen) {
	      if (self.dropdownMenuTemplateUrl) {
	        $templateRequest(self.dropdownMenuTemplateUrl).then(function(tplContent) {
	          templateScope = scope.$new();
	          $compile(tplContent.trim())(templateScope, function(dropdownElement) {
	            var newEl = dropdownElement;
	            self.dropdownMenu.replaceWith(newEl);
	            self.dropdownMenu = newEl;
	          });
	        });
	      }

	      scope.focusToggleElement();
	      uibDropdownService.open(scope);
	    } else {
	      if (self.dropdownMenuTemplateUrl) {
	        if (templateScope) {
	          templateScope.$destroy();
	        }
	        var newEl = angular.element('<ul class="dropdown-menu"></ul>');
	        self.dropdownMenu.replaceWith(newEl);
	        self.dropdownMenu = newEl;
	      }

	      uibDropdownService.close(scope);
	      self.selectedOption = null;
	    }

	    if (angular.isFunction(setIsOpen)) {
	      setIsOpen($scope, isOpen);
	    }
	  });

	  $scope.$on('$locationChangeSuccess', function() {
	    if (scope.getAutoClose() !== 'disabled') {
	      scope.isOpen = false;
	    }
	  });

	  var offDestroy = $scope.$on('$destroy', function() {
	    scope.$destroy();
	  });
	  scope.$on('$destroy', offDestroy);
	}])

	.directive('dropdown', ['$log', '$dropdownSuppressWarning', function($log, $dropdownSuppressWarning) {
	  return {
	    controller: 'DropdownController',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      if (!$dropdownSuppressWarning) {
	        $log.warn('dropdown is now deprecated. Use uib-dropdown instead.');
	      }

	      dropdownCtrl.init();
	    }
	  };
	}])

	.directive('dropdownMenu', ['$log', '$dropdownSuppressWarning', function($log, $dropdownSuppressWarning) {
	  return {
	    restrict: 'AC',
	    require: '?^dropdown',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      if (!dropdownCtrl || angular.isDefined(attrs.dropdownNested)) {
	        return;
	      }

	      if (!$dropdownSuppressWarning) {
	        $log.warn('dropdown-menu is now deprecated. Use uib-dropdown-menu instead.');
	      }

	      element.addClass('dropdown-menu');

	      var tplUrl = attrs.templateUrl;
	      if (tplUrl) {
	        dropdownCtrl.dropdownMenuTemplateUrl = tplUrl;
	      }

	      if (!dropdownCtrl.dropdownMenu) {
	        dropdownCtrl.dropdownMenu = element;
	      }
	    }
	  };
	}])

	.directive('keyboardNav', ['$log', '$dropdownSuppressWarning', function($log, $dropdownSuppressWarning) {
	  return {
	    restrict: 'A',
	    require: '?^dropdown',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      if (!$dropdownSuppressWarning) {
	        $log.warn('keyboard-nav is now deprecated. Use uib-keyboard-nav instead.');
	      }

	      element.bind('keydown', function(e) {
	        if ([38, 40].indexOf(e.which) !== -1) {
	          e.preventDefault();
	          e.stopPropagation();

	          var elems = dropdownCtrl.dropdownMenu.find('a');

	          switch (e.which) {
	            case (40): { // Down
	              if (!angular.isNumber(dropdownCtrl.selectedOption)) {
	                dropdownCtrl.selectedOption = 0;
	              } else {
	                dropdownCtrl.selectedOption = dropdownCtrl.selectedOption === elems.length -1 ?
	                  dropdownCtrl.selectedOption : dropdownCtrl.selectedOption + 1;
	              }
	              break;
	            }
	            case (38): { // Up
	              if (!angular.isNumber(dropdownCtrl.selectedOption)) {
	                dropdownCtrl.selectedOption = elems.length - 1;
	              } else {
	                dropdownCtrl.selectedOption = dropdownCtrl.selectedOption === 0 ?
	                  0 : dropdownCtrl.selectedOption - 1;
	              }
	              break;
	            }
	          }
	          elems[dropdownCtrl.selectedOption].focus();
	        }
	      });
	    }
	  };
	}])

	.directive('dropdownToggle', ['$log', '$dropdownSuppressWarning', function($log, $dropdownSuppressWarning) {
	  return {
	    require: '?^dropdown',
	    link: function(scope, element, attrs, dropdownCtrl) {
	      if (!$dropdownSuppressWarning) {
	        $log.warn('dropdown-toggle is now deprecated. Use uib-dropdown-toggle instead.');
	      }

	      if (!dropdownCtrl) {
	        return;
	      }

	      element.addClass('dropdown-toggle');

	      dropdownCtrl.toggleElement = element;

	      var toggleDropdown = function(event) {
	        event.preventDefault();

	        if (!element.hasClass('disabled') && !attrs.disabled) {
	          scope.$apply(function() {
	            dropdownCtrl.toggle();
	          });
	        }
	      };

	      element.bind('click', toggleDropdown);

	      // WAI-ARIA
	      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
	      scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
	        element.attr('aria-expanded', !!isOpen);
	      });

	      scope.$on('$destroy', function() {
	        element.unbind('click', toggleDropdown);
	      });
	    }
	  };
	}]);

	angular.module('ui.bootstrap.stackedMap', [])
	/**
	 * A helper, internal data structure that acts as a map but also allows getting / removing
	 * elements in the LIFO order
	 */
	  .factory('$$stackedMap', function() {
	    return {
	      createNew: function() {
	        var stack = [];

	        return {
	          add: function(key, value) {
	            stack.push({
	              key: key,
	              value: value
	            });
	          },
	          get: function(key) {
	            for (var i = 0; i < stack.length; i++) {
	              if (key == stack[i].key) {
	                return stack[i];
	              }
	            }
	          },
	          keys: function() {
	            var keys = [];
	            for (var i = 0; i < stack.length; i++) {
	              keys.push(stack[i].key);
	            }
	            return keys;
	          },
	          top: function() {
	            return stack[stack.length - 1];
	          },
	          remove: function(key) {
	            var idx = -1;
	            for (var i = 0; i < stack.length; i++) {
	              if (key == stack[i].key) {
	                idx = i;
	                break;
	              }
	            }
	            return stack.splice(idx, 1)[0];
	          },
	          removeTop: function() {
	            return stack.splice(stack.length - 1, 1)[0];
	          },
	          length: function() {
	            return stack.length;
	          }
	        };
	      }
	    };
	  });
	angular.module('ui.bootstrap.modal', ['ui.bootstrap.stackedMap'])
	/**
	 * A helper, internal data structure that stores all references attached to key
	 */
	  .factory('$$multiMap', function() {
	    return {
	      createNew: function() {
	        var map = {};

	        return {
	          entries: function() {
	            return Object.keys(map).map(function(key) {
	              return {
	                key: key,
	                value: map[key]
	              };
	            });
	          },
	          get: function(key) {
	            return map[key];
	          },
	          hasKey: function(key) {
	            return !!map[key];
	          },
	          keys: function() {
	            return Object.keys(map);
	          },
	          put: function(key, value) {
	            if (!map[key]) {
	              map[key] = [];
	            }

	            map[key].push(value);
	          },
	          remove: function(key, value) {
	            var values = map[key];

	            if (!values) {
	              return;
	            }

	            var idx = values.indexOf(value);

	            if (idx !== -1) {
	              values.splice(idx, 1);
	            }

	            if (!values.length) {
	              delete map[key];
	            }
	          }
	        };
	      }
	    };
	  })

	/**
	 * A helper directive for the $modal service. It creates a backdrop element.
	 */
	  .directive('uibModalBackdrop', [
	           '$animate', '$injector', '$uibModalStack',
	  function($animate ,  $injector,   $modalStack) {
	    var $animateCss = null;

	    if ($injector.has('$animateCss')) {
	      $animateCss = $injector.get('$animateCss');
	    }

	    return {
	      replace: true,
	      templateUrl: 'template/modal/backdrop.html',
	      compile: function(tElement, tAttrs) {
	        tElement.addClass(tAttrs.backdropClass);
	        return linkFn;
	      }
	    };

	    function linkFn(scope, element, attrs) {
	      // Temporary fix for prefixing
	      element.addClass('modal-backdrop');

	      if (attrs.modalInClass) {
	        if ($animateCss) {
	          $animateCss(element, {
	            addClass: attrs.modalInClass
	          }).start();
	        } else {
	          $animate.addClass(element, attrs.modalInClass);
	        }

	        scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
	          var done = setIsAsync();
	          if ($animateCss) {
	            $animateCss(element, {
	              removeClass: attrs.modalInClass
	            }).start().then(done);
	          } else {
	            $animate.removeClass(element, attrs.modalInClass).then(done);
	          }
	        });
	      }
	    }
	  }])

	  .directive('uibModalWindow', [
	           '$uibModalStack', '$q', '$animate', '$injector',
	  function($modalStack ,  $q ,  $animate,   $injector) {
	    var $animateCss = null;

	    if ($injector.has('$animateCss')) {
	      $animateCss = $injector.get('$animateCss');
	    }

	    return {
	      scope: {
	        index: '@'
	      },
	      replace: true,
	      transclude: true,
	      templateUrl: function(tElement, tAttrs) {
	        return tAttrs.templateUrl || 'template/modal/window.html';
	      },
	      link: function(scope, element, attrs) {
	        element.addClass(attrs.windowClass || '');
	        element.addClass(attrs.windowTopClass || '');
	        scope.size = attrs.size;

	        scope.close = function(evt) {
	          var modal = $modalStack.getTop();
	          if (modal && modal.value.backdrop && modal.value.backdrop !== 'static' && (evt.target === evt.currentTarget)) {
	            evt.preventDefault();
	            evt.stopPropagation();
	            $modalStack.dismiss(modal.key, 'backdrop click');
	          }
	        };

	        // moved from template to fix issue #2280
	        element.on('click', scope.close);

	        // This property is only added to the scope for the purpose of detecting when this directive is rendered.
	        // We can detect that by using this property in the template associated with this directive and then use
	        // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
	        scope.$isRendered = true;

	        // Deferred object that will be resolved when this modal is render.
	        var modalRenderDeferObj = $q.defer();
	        // Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
	        // In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
	        attrs.$observe('modalRender', function(value) {
	          if (value == 'true') {
	            modalRenderDeferObj.resolve();
	          }
	        });

	        modalRenderDeferObj.promise.then(function() {
	          var animationPromise = null;

	          if (attrs.modalInClass) {
	            if ($animateCss) {
	              animationPromise = $animateCss(element, {
	                addClass: attrs.modalInClass
	              }).start();
	            } else {
	              animationPromise = $animate.addClass(element, attrs.modalInClass);
	            }

	            scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
	              var done = setIsAsync();
	              if ($animateCss) {
	                $animateCss(element, {
	                  removeClass: attrs.modalInClass
	                }).start().then(done);
	              } else {
	                $animate.removeClass(element, attrs.modalInClass).then(done);
	              }
	            });
	          }


	          $q.when(animationPromise).then(function() {
	            var inputWithAutofocus = element[0].querySelector('[autofocus]');
	            /**
	             * Auto-focusing of a freshly-opened modal element causes any child elements
	             * with the autofocus attribute to lose focus. This is an issue on touch
	             * based devices which will show and then hide the onscreen keyboard.
	             * Attempts to refocus the autofocus element via JavaScript will not reopen
	             * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
	             * the modal element if the modal does not contain an autofocus element.
	             */
	            if (inputWithAutofocus) {
	              inputWithAutofocus.focus();
	            } else {
	              element[0].focus();
	            }
	          });

	          // Notify {@link $modalStack} that modal is rendered.
	          var modal = $modalStack.getTop();
	          if (modal) {
	            $modalStack.modalRendered(modal.key);
	          }
	        });
	      }
	    };
	  }])

	  .directive('uibModalAnimationClass', function() {
	    return {
	      compile: function(tElement, tAttrs) {
	        if (tAttrs.modalAnimation) {
	          tElement.addClass(tAttrs.uibModalAnimationClass);
	        }
	      }
	    };
	  })

	  .directive('uibModalTransclude', function() {
	    return {
	      link: function($scope, $element, $attrs, controller, $transclude) {
	        $transclude($scope.$parent, function(clone) {
	          $element.empty();
	          $element.append(clone);
	        });
	      }
	    };
	  })

	  .factory('$uibModalStack', [
	             '$animate', '$timeout', '$document', '$compile', '$rootScope',
	             '$q',
	             '$injector',
	             '$$multiMap',
	             '$$stackedMap',
	    function($animate ,  $timeout ,  $document ,  $compile ,  $rootScope ,
	              $q,
	              $injector,
	              $$multiMap,
	              $$stackedMap) {
	      var $animateCss = null;

	      if ($injector.has('$animateCss')) {
	        $animateCss = $injector.get('$animateCss');
	      }

	      var OPENED_MODAL_CLASS = 'modal-open';

	      var backdropDomEl, backdropScope;
	      var openedWindows = $$stackedMap.createNew();
	      var openedClasses = $$multiMap.createNew();
	      var $modalStack = {
	        NOW_CLOSING_EVENT: 'modal.stack.now-closing'
	      };

	      //Modal focus behavior
	      var focusableElementList;
	      var focusIndex = 0;
	      var tababbleSelector = 'a[href], area[href], input:not([disabled]), ' +
	        'button:not([disabled]),select:not([disabled]), textarea:not([disabled]), ' +
	        'iframe, object, embed, *[tabindex], *[contenteditable=true]';

	      function backdropIndex() {
	        var topBackdropIndex = -1;
	        var opened = openedWindows.keys();
	        for (var i = 0; i < opened.length; i++) {
	          if (openedWindows.get(opened[i]).value.backdrop) {
	            topBackdropIndex = i;
	          }
	        }
	        return topBackdropIndex;
	      }

	      $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
	        if (backdropScope) {
	          backdropScope.index = newBackdropIndex;
	        }
	      });

	      function removeModalWindow(modalInstance, elementToReceiveFocus) {
	        var body = $document.find('body').eq(0);
	        var modalWindow = openedWindows.get(modalInstance).value;

	        //clean up the stack
	        openedWindows.remove(modalInstance);

	        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, function() {
	          var modalBodyClass = modalWindow.openedClass || OPENED_MODAL_CLASS;
	          openedClasses.remove(modalBodyClass, modalInstance);
	          body.toggleClass(modalBodyClass, openedClasses.hasKey(modalBodyClass));
	          toggleTopWindowClass(true);
	        });
	        checkRemoveBackdrop();

	        //move focus to specified element if available, or else to body
	        if (elementToReceiveFocus && elementToReceiveFocus.focus) {
	          elementToReceiveFocus.focus();
	        } else {
	          body.focus();
	        }
	      }

	      // Add or remove "windowTopClass" from the top window in the stack
	      function toggleTopWindowClass(toggleSwitch) {
	        var modalWindow;

	        if (openedWindows.length() > 0) {
	          modalWindow = openedWindows.top().value;
	          modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass || '', toggleSwitch);
	        }
	      }

	      function checkRemoveBackdrop() {
	        //remove backdrop if no longer needed
	        if (backdropDomEl && backdropIndex() == -1) {
	          var backdropScopeRef = backdropScope;
	          removeAfterAnimate(backdropDomEl, backdropScope, function() {
	            backdropScopeRef = null;
	          });
	          backdropDomEl = undefined;
	          backdropScope = undefined;
	        }
	      }

	      function removeAfterAnimate(domEl, scope, done) {
	        var asyncDeferred;
	        var asyncPromise = null;
	        var setIsAsync = function() {
	          if (!asyncDeferred) {
	            asyncDeferred = $q.defer();
	            asyncPromise = asyncDeferred.promise;
	          }

	          return function asyncDone() {
	            asyncDeferred.resolve();
	          };
	        };
	        scope.$broadcast($modalStack.NOW_CLOSING_EVENT, setIsAsync);

	        // Note that it's intentional that asyncPromise might be null.
	        // That's when setIsAsync has not been called during the
	        // NOW_CLOSING_EVENT broadcast.
	        return $q.when(asyncPromise).then(afterAnimating);

	        function afterAnimating() {
	          if (afterAnimating.done) {
	            return;
	          }
	          afterAnimating.done = true;

	          if ($animateCss) {
	            $animateCss(domEl, {
	              event: 'leave'
	            }).start().then(function() {
	              domEl.remove();
	            });
	          } else {
	            $animate.leave(domEl);
	          }
	          scope.$destroy();
	          if (done) {
	            done();
	          }
	        }
	      }

	      $document.bind('keydown', function(evt) {
	        if (evt.isDefaultPrevented()) {
	          return evt;
	        }

	        var modal = openedWindows.top();
	        if (modal && modal.value.keyboard) {
	          switch (evt.which) {
	            case 27: {
	              evt.preventDefault();
	              $rootScope.$apply(function() {
	                $modalStack.dismiss(modal.key, 'escape key press');
	              });
	              break;
	            }
	            case 9: {
	              $modalStack.loadFocusElementList(modal);
	              var focusChanged = false;
	              if (evt.shiftKey) {
	                if ($modalStack.isFocusInFirstItem(evt)) {
	                  focusChanged = $modalStack.focusLastFocusableElement();
	                }
	              } else {
	                if ($modalStack.isFocusInLastItem(evt)) {
	                  focusChanged = $modalStack.focusFirstFocusableElement();
	                }
	              }

	              if (focusChanged) {
	                evt.preventDefault();
	                evt.stopPropagation();
	              }
	              break;
	            }
	          }
	        }
	      });

	      $modalStack.open = function(modalInstance, modal) {
	        var modalOpener = $document[0].activeElement,
	          modalBodyClass = modal.openedClass || OPENED_MODAL_CLASS;

	        toggleTopWindowClass(false);

	        openedWindows.add(modalInstance, {
	          deferred: modal.deferred,
	          renderDeferred: modal.renderDeferred,
	          modalScope: modal.scope,
	          backdrop: modal.backdrop,
	          keyboard: modal.keyboard,
	          openedClass: modal.openedClass,
	          windowTopClass: modal.windowTopClass
	        });

	        openedClasses.put(modalBodyClass, modalInstance);

	        var body = $document.find('body').eq(0),
	            currBackdropIndex = backdropIndex();

	        if (currBackdropIndex >= 0 && !backdropDomEl) {
	          backdropScope = $rootScope.$new(true);
	          backdropScope.index = currBackdropIndex;
	          var angularBackgroundDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
	          angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
	          if (modal.animation) {
	            angularBackgroundDomEl.attr('modal-animation', 'true');
	          }
	          backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
	          body.append(backdropDomEl);
	        }

	        var angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
	        angularDomEl.attr({
	          'template-url': modal.windowTemplateUrl,
	          'window-class': modal.windowClass,
	          'window-top-class': modal.windowTopClass,
	          'size': modal.size,
	          'index': openedWindows.length() - 1,
	          'animate': 'animate'
	        }).html(modal.content);
	        if (modal.animation) {
	          angularDomEl.attr('modal-animation', 'true');
	        }

	        var modalDomEl = $compile(angularDomEl)(modal.scope);
	        openedWindows.top().value.modalDomEl = modalDomEl;
	        openedWindows.top().value.modalOpener = modalOpener;
	        body.append(modalDomEl);
	        body.addClass(modalBodyClass);

	        $modalStack.clearFocusListCache();
	      };

	      function broadcastClosing(modalWindow, resultOrReason, closing) {
	        return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
	      }

	      $modalStack.close = function(modalInstance, result) {
	        var modalWindow = openedWindows.get(modalInstance);
	        if (modalWindow && broadcastClosing(modalWindow, result, true)) {
	          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
	          modalWindow.value.deferred.resolve(result);
	          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
	          return true;
	        }
	        return !modalWindow;
	      };

	      $modalStack.dismiss = function(modalInstance, reason) {
	        var modalWindow = openedWindows.get(modalInstance);
	        if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
	          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
	          modalWindow.value.deferred.reject(reason);
	          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
	          return true;
	        }
	        return !modalWindow;
	      };

	      $modalStack.dismissAll = function(reason) {
	        var topModal = this.getTop();
	        while (topModal && this.dismiss(topModal.key, reason)) {
	          topModal = this.getTop();
	        }
	      };

	      $modalStack.getTop = function() {
	        return openedWindows.top();
	      };

	      $modalStack.modalRendered = function(modalInstance) {
	        var modalWindow = openedWindows.get(modalInstance);
	        if (modalWindow) {
	          modalWindow.value.renderDeferred.resolve();
	        }
	      };

	      $modalStack.focusFirstFocusableElement = function() {
	        if (focusableElementList.length > 0) {
	          focusableElementList[0].focus();
	          return true;
	        }
	        return false;
	      };
	      $modalStack.focusLastFocusableElement = function() {
	        if (focusableElementList.length > 0) {
	          focusableElementList[focusableElementList.length - 1].focus();
	          return true;
	        }
	        return false;
	      };

	      $modalStack.isFocusInFirstItem = function(evt) {
	        if (focusableElementList.length > 0) {
	          return (evt.target || evt.srcElement) == focusableElementList[0];
	        }
	        return false;
	      };

	      $modalStack.isFocusInLastItem = function(evt) {
	        if (focusableElementList.length > 0) {
	          return (evt.target || evt.srcElement) == focusableElementList[focusableElementList.length - 1];
	        }
	        return false;
	      };

	      $modalStack.clearFocusListCache = function() {
	        focusableElementList = [];
	        focusIndex = 0;
	      };

	      $modalStack.loadFocusElementList = function(modalWindow) {
	        if (focusableElementList === undefined || !focusableElementList.length) {
	          if (modalWindow) {
	            var modalDomE1 = modalWindow.value.modalDomEl;
	            if (modalDomE1 && modalDomE1.length) {
	              focusableElementList = modalDomE1[0].querySelectorAll(tababbleSelector);
	            }
	          }
	        }
	      };

	      return $modalStack;
	    }])

	  .provider('$uibModal', function() {
	    var $modalProvider = {
	      options: {
	        animation: true,
	        backdrop: true, //can also be false or 'static'
	        keyboard: true
	      },
	      $get: ['$injector', '$rootScope', '$q', '$templateRequest', '$controller', '$uibModalStack', '$modalSuppressWarning', '$log',
	        function ($injector, $rootScope, $q, $templateRequest, $controller, $modalStack, $modalSuppressWarning, $log) {
	          var $modal = {};

	          function getTemplatePromise(options) {
	            return options.template ? $q.when(options.template) :
	              $templateRequest(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);
	          }

	          function getResolvePromises(resolves) {
	            var promisesArr = [];
	            angular.forEach(resolves, function(value) {
	              if (angular.isFunction(value) || angular.isArray(value)) {
	                promisesArr.push($q.when($injector.invoke(value)));
	              } else if (angular.isString(value)) {
	                promisesArr.push($q.when($injector.get(value)));
	              } else {
	                promisesArr.push($q.when(value));
	              }
	            });
	            return promisesArr;
	          }

	          var promiseChain = null;
	          $modal.getPromiseChain = function() {
	            return promiseChain;
	          };

	          $modal.open = function(modalOptions) {
	            var modalResultDeferred = $q.defer();
	            var modalOpenedDeferred = $q.defer();
	            var modalRenderDeferred = $q.defer();

	            //prepare an instance of a modal to be injected into controllers and returned to a caller
	            var modalInstance = {
	              result: modalResultDeferred.promise,
	              opened: modalOpenedDeferred.promise,
	              rendered: modalRenderDeferred.promise,
	              close: function (result) {
	                return $modalStack.close(modalInstance, result);
	              },
	              dismiss: function (reason) {
	                return $modalStack.dismiss(modalInstance, reason);
	              }
	            };

	            //merge and clean up options
	            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
	            modalOptions.resolve = modalOptions.resolve || {};

	            //verify options
	            if (!modalOptions.template && !modalOptions.templateUrl) {
	              throw new Error('One of template or templateUrl options is required.');
	            }

	            var templateAndResolvePromise =
	              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));

	            function resolveWithTemplate() {
	              return templateAndResolvePromise;
	            }

	            // Wait for the resolution of the existing promise chain.
	            // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
	            // Then add to $modalStack and resolve opened.
	            // Finally clean up the chain variable if no subsequent modal has overwritten it.
	            var samePromise;
	            samePromise = promiseChain = $q.all([promiseChain])
	              .then(resolveWithTemplate, resolveWithTemplate)
	              .then(function resolveSuccess(tplAndVars) {

	                var modalScope = (modalOptions.scope || $rootScope).$new();
	                modalScope.$close = modalInstance.close;
	                modalScope.$dismiss = modalInstance.dismiss;

	                modalScope.$on('$destroy', function() {
	                  if (!modalScope.$$uibDestructionScheduled) {
	                    modalScope.$dismiss('$uibUnscheduledDestruction');
	                  }
	                });

	                var ctrlInstance, ctrlLocals = {};
	                var resolveIter = 1;

	                //controllers
	                if (modalOptions.controller) {
	                  ctrlLocals.$scope = modalScope;
	                  ctrlLocals.$uibModalInstance = modalInstance;
	                  Object.defineProperty(ctrlLocals, '$modalInstance', {
	                    get: function() {
	                      if (!$modalSuppressWarning) {
	                        $log.warn('$modalInstance is now deprecated. Use $uibModalInstance instead.');
	                      }

	                      return modalInstance;
	                    }
	                  });
	                  angular.forEach(modalOptions.resolve, function(value, key) {
	                    ctrlLocals[key] = tplAndVars[resolveIter++];
	                  });

	                  ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
	                  if (modalOptions.controllerAs) {
	                    if (modalOptions.bindToController) {
	                      angular.extend(ctrlInstance, modalScope);
	                    }

	                    modalScope[modalOptions.controllerAs] = ctrlInstance;
	                  }
	                }

	                $modalStack.open(modalInstance, {
	                  scope: modalScope,
	                  deferred: modalResultDeferred,
	                  renderDeferred: modalRenderDeferred,
	                  content: tplAndVars[0],
	                  animation: modalOptions.animation,
	                  backdrop: modalOptions.backdrop,
	                  keyboard: modalOptions.keyboard,
	                  backdropClass: modalOptions.backdropClass,
	                  windowTopClass: modalOptions.windowTopClass,
	                  windowClass: modalOptions.windowClass,
	                  windowTemplateUrl: modalOptions.windowTemplateUrl,
	                  size: modalOptions.size,
	                  openedClass: modalOptions.openedClass
	                });
	                modalOpenedDeferred.resolve(true);

	            }, function resolveError(reason) {
	              modalOpenedDeferred.reject(reason);
	              modalResultDeferred.reject(reason);
	            })
	            .finally(function() {
	              if (promiseChain === samePromise) {
	                promiseChain = null;
	              }
	            });

	            return modalInstance;
	          };

	          return $modal;
	        }
	      ]
	    };

	    return $modalProvider;
	  });

	/* deprecated modal below */

	angular.module('ui.bootstrap.modal')

	  .value('$modalSuppressWarning', false)

	  /**
	   * A helper directive for the $modal service. It creates a backdrop element.
	   */
	  .directive('modalBackdrop', [
	    '$animate', '$injector', '$modalStack', '$log', '$modalSuppressWarning',
	    function($animate ,  $injector,   $modalStack, $log, $modalSuppressWarning) {
	      var $animateCss = null;

	      if ($injector.has('$animateCss')) {
	        $animateCss = $injector.get('$animateCss');
	      }

	      return {
	        replace: true,
	        templateUrl: 'template/modal/backdrop.html',
	        compile: function(tElement, tAttrs) {
	          tElement.addClass(tAttrs.backdropClass);
	          return linkFn;
	        }
	      };

	      function linkFn(scope, element, attrs) {
	        if (!$modalSuppressWarning) {
	          $log.warn('modal-backdrop is now deprecated. Use uib-modal-backdrop instead.');
	        }
	        element.addClass('modal-backdrop');

	        if (attrs.modalInClass) {
	          if ($animateCss) {
	            $animateCss(element, {
	              addClass: attrs.modalInClass
	            }).start();
	          } else {
	            $animate.addClass(element, attrs.modalInClass);
	          }

	          scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
	            var done = setIsAsync();
	            if ($animateCss) {
	              $animateCss(element, {
	                removeClass: attrs.modalInClass
	              }).start().then(done);
	            } else {
	              $animate.removeClass(element, attrs.modalInClass).then(done);
	            }
	          });
	        }
	      }
	    }])

	  .directive('modalWindow', [
	    '$modalStack', '$q', '$animate', '$injector', '$log', '$modalSuppressWarning',
	    function($modalStack ,  $q ,  $animate,   $injector, $log, $modalSuppressWarning) {
	      var $animateCss = null;

	      if ($injector.has('$animateCss')) {
	        $animateCss = $injector.get('$animateCss');
	      }

	      return {
	        scope: {
	          index: '@'
	        },
	        replace: true,
	        transclude: true,
	        templateUrl: function(tElement, tAttrs) {
	          return tAttrs.templateUrl || 'template/modal/window.html';
	        },
	        link: function(scope, element, attrs) {
	          if (!$modalSuppressWarning) {
	            $log.warn('modal-window is now deprecated. Use uib-modal-window instead.');
	          }
	          element.addClass(attrs.windowClass || '');
	          element.addClass(attrs.windowTopClass || '');
	          scope.size = attrs.size;

	          scope.close = function(evt) {
	            var modal = $modalStack.getTop();
	            if (modal && modal.value.backdrop && modal.value.backdrop !== 'static' && (evt.target === evt.currentTarget)) {
	              evt.preventDefault();
	              evt.stopPropagation();
	              $modalStack.dismiss(modal.key, 'backdrop click');
	            }
	          };

	          // moved from template to fix issue #2280
	          element.on('click', scope.close);

	          // This property is only added to the scope for the purpose of detecting when this directive is rendered.
	          // We can detect that by using this property in the template associated with this directive and then use
	          // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
	          scope.$isRendered = true;

	          // Deferred object that will be resolved when this modal is render.
	          var modalRenderDeferObj = $q.defer();
	          // Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
	          // In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
	          attrs.$observe('modalRender', function(value) {
	            if (value == 'true') {
	              modalRenderDeferObj.resolve();
	            }
	          });

	          modalRenderDeferObj.promise.then(function() {
	            var animationPromise = null;

	            if (attrs.modalInClass) {
	              if ($animateCss) {
	                animationPromise = $animateCss(element, {
	                  addClass: attrs.modalInClass
	                }).start();
	              } else {
	                animationPromise = $animate.addClass(element, attrs.modalInClass);
	              }

	              scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
	                var done = setIsAsync();
	                if ($animateCss) {
	                  $animateCss(element, {
	                    removeClass: attrs.modalInClass
	                  }).start().then(done);
	                } else {
	                  $animate.removeClass(element, attrs.modalInClass).then(done);
	                }
	              });
	            }


	            $q.when(animationPromise).then(function() {
	              var inputWithAutofocus = element[0].querySelector('[autofocus]');
	              /**
	               * Auto-focusing of a freshly-opened modal element causes any child elements
	               * with the autofocus attribute to lose focus. This is an issue on touch
	               * based devices which will show and then hide the onscreen keyboard.
	               * Attempts to refocus the autofocus element via JavaScript will not reopen
	               * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
	               * the modal element if the modal does not contain an autofocus element.
	               */
	              if (inputWithAutofocus) {
	                inputWithAutofocus.focus();
	              } else {
	                element[0].focus();
	              }
	            });

	            // Notify {@link $modalStack} that modal is rendered.
	            var modal = $modalStack.getTop();
	            if (modal) {
	              $modalStack.modalRendered(modal.key);
	            }
	          });
	        }
	      };
	    }])

	  .directive('modalAnimationClass', [
	    '$log', '$modalSuppressWarning',
	    function ($log, $modalSuppressWarning) {
	      return {
	        compile: function(tElement, tAttrs) {
	          if (!$modalSuppressWarning) {
	            $log.warn('modal-animation-class is now deprecated. Use uib-modal-animation-class instead.');
	          }
	          if (tAttrs.modalAnimation) {
	            tElement.addClass(tAttrs.modalAnimationClass);
	          }
	        }
	      };
	    }])

	  .directive('modalTransclude', [
	    '$log', '$modalSuppressWarning',
	    function ($log, $modalSuppressWarning) {
	    return {
	      link: function($scope, $element, $attrs, controller, $transclude) {
	        if (!$modalSuppressWarning) {
	          $log.warn('modal-transclude is now deprecated. Use uib-modal-transclude instead.');
	        }
	        $transclude($scope.$parent, function(clone) {
	          $element.empty();
	          $element.append(clone);
	        });
	      }
	    };
	  }])

	  .service('$modalStack', [
	    '$animate', '$timeout', '$document', '$compile', '$rootScope',
	    '$q',
	    '$injector',
	    '$$multiMap',
	    '$$stackedMap',
	    '$uibModalStack',
	    '$log',
	    '$modalSuppressWarning',
	    function($animate ,  $timeout ,  $document ,  $compile ,  $rootScope ,
	             $q,
	             $injector,
	             $$multiMap,
	             $$stackedMap,
	             $uibModalStack,
	             $log,
	             $modalSuppressWarning) {
	      if (!$modalSuppressWarning) {
	        $log.warn('$modalStack is now deprecated. Use $uibModalStack instead.');
	      }

	      angular.extend(this, $uibModalStack);
	    }])

	  .provider('$modal', ['$uibModalProvider', function($uibModalProvider) {
	    angular.extend(this, $uibModalProvider);

	    this.$get = ['$injector', '$log', '$modalSuppressWarning',
	      function ($injector, $log, $modalSuppressWarning) {
	        if (!$modalSuppressWarning) {
	          $log.warn('$modal is now deprecated. Use $uibModal instead.');
	        }

	        return $injector.invoke($uibModalProvider.$get);
	      }];
	  }]);

	angular.module('ui.bootstrap.pagination', [])
	.controller('UibPaginationController', ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
	  var self = this,
	      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
	      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

	  this.init = function(ngModelCtrl_, config) {
	    ngModelCtrl = ngModelCtrl_;
	    this.config = config;

	    ngModelCtrl.$render = function() {
	      self.render();
	    };

	    if ($attrs.itemsPerPage) {
	      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
	        self.itemsPerPage = parseInt(value, 10);
	        $scope.totalPages = self.calculateTotalPages();
	      });
	    } else {
	      this.itemsPerPage = config.itemsPerPage;
	    }

	    $scope.$watch('totalItems', function() {
	      $scope.totalPages = self.calculateTotalPages();
	    });

	    $scope.$watch('totalPages', function(value) {
	      setNumPages($scope.$parent, value); // Readonly variable

	      if ( $scope.page > value ) {
	        $scope.selectPage(value);
	      } else {
	        ngModelCtrl.$render();
	      }
	    });
	  };

	  this.calculateTotalPages = function() {
	    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
	    return Math.max(totalPages || 0, 1);
	  };

	  this.render = function() {
	    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
	  };

	  $scope.selectPage = function(page, evt) {
	    if (evt) {
	      evt.preventDefault();
	    }

	    var clickAllowed = !$scope.ngDisabled || !evt;
	    if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
	      if (evt && evt.target) {
	        evt.target.blur();
	      }
	      ngModelCtrl.$setViewValue(page);
	      ngModelCtrl.$render();
	    }
	  };

	  $scope.getText = function(key) {
	    return $scope[key + 'Text'] || self.config[key + 'Text'];
	  };

	  $scope.noPrevious = function() {
	    return $scope.page === 1;
	  };

	  $scope.noNext = function() {
	    return $scope.page === $scope.totalPages;
	  };
	}])

	.constant('uibPaginationConfig', {
	  itemsPerPage: 10,
	  boundaryLinks: false,
	  directionLinks: true,
	  firstText: 'First',
	  previousText: 'Previous',
	  nextText: 'Next',
	  lastText: 'Last',
	  rotate: true
	})

	.directive('uibPagination', ['$parse', 'uibPaginationConfig', function($parse, paginationConfig) {
	  return {
	    restrict: 'EA',
	    scope: {
	      totalItems: '=',
	      firstText: '@',
	      previousText: '@',
	      nextText: '@',
	      lastText: '@',
	      ngDisabled:'='
	    },
	    require: ['uibPagination', '?ngModel'],
	    controller: 'UibPaginationController',
	    controllerAs: 'pagination',
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/pagination/pagination.html';
	    },
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (!ngModelCtrl) {
	         return; // do nothing if no ng-model
	      }

	      // Setup configuration parameters
	      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
	          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
	      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
	      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

	      paginationCtrl.init(ngModelCtrl, paginationConfig);

	      if (attrs.maxSize) {
	        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
	          maxSize = parseInt(value, 10);
	          paginationCtrl.render();
	        });
	      }

	      // Create page object used in template
	      function makePage(number, text, isActive) {
	        return {
	          number: number,
	          text: text,
	          active: isActive
	        };
	      }

	      function getPages(currentPage, totalPages) {
	        var pages = [];

	        // Default page limits
	        var startPage = 1, endPage = totalPages;
	        var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

	        // recompute if maxSize
	        if (isMaxSized) {
	          if (rotate) {
	            // Current page is displayed in the middle of the visible ones
	            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
	            endPage   = startPage + maxSize - 1;

	            // Adjust if limit is exceeded
	            if (endPage > totalPages) {
	              endPage   = totalPages;
	              startPage = endPage - maxSize + 1;
	            }
	          } else {
	            // Visible pages are paginated with maxSize
	            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

	            // Adjust last page if limit is exceeded
	            endPage = Math.min(startPage + maxSize - 1, totalPages);
	          }
	        }

	        // Add page number links
	        for (var number = startPage; number <= endPage; number++) {
	          var page = makePage(number, number, number === currentPage);
	          pages.push(page);
	        }

	        // Add links to move between page sets
	        if (isMaxSized && ! rotate) {
	          if (startPage > 1) {
	            var previousPageSet = makePage(startPage - 1, '...', false);
	            pages.unshift(previousPageSet);
	          }

	          if (endPage < totalPages) {
	            var nextPageSet = makePage(endPage + 1, '...', false);
	            pages.push(nextPageSet);
	          }
	        }

	        return pages;
	      }

	      var originalRender = paginationCtrl.render;
	      paginationCtrl.render = function() {
	        originalRender();
	        if (scope.page > 0 && scope.page <= scope.totalPages) {
	          scope.pages = getPages(scope.page, scope.totalPages);
	        }
	      };
	    }
	  };
	}])

	.constant('uibPagerConfig', {
	  itemsPerPage: 10,
	  previousText: '« Previous',
	  nextText: 'Next »',
	  align: true
	})

	.directive('uibPager', ['uibPagerConfig', function(pagerConfig) {
	  return {
	    restrict: 'EA',
	    scope: {
	      totalItems: '=',
	      previousText: '@',
	      nextText: '@',
	      ngDisabled: '='
	    },
	    require: ['uibPager', '?ngModel'],
	    controller: 'UibPaginationController',
	    controllerAs: 'pagination',
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/pagination/pager.html';
	    },
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (!ngModelCtrl) {
	         return; // do nothing if no ng-model
	      }

	      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
	      paginationCtrl.init(ngModelCtrl, pagerConfig);
	    }
	  };
	}]);

	/* Deprecated Pagination Below */

	angular.module('ui.bootstrap.pagination')
	.value('$paginationSuppressWarning', false)
	.controller('PaginationController', ['$scope', '$attrs', '$parse', '$log', '$paginationSuppressWarning', function($scope, $attrs, $parse, $log, $paginationSuppressWarning) {
	  if (!$paginationSuppressWarning) {
	    $log.warn('PaginationController is now deprecated. Use UibPaginationController instead.');
	  }

	  var self = this,
	    ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
	    setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

	  this.init = function(ngModelCtrl_, config) {
	    ngModelCtrl = ngModelCtrl_;
	    this.config = config;

	    ngModelCtrl.$render = function() {
	      self.render();
	    };

	    if ($attrs.itemsPerPage) {
	      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
	        self.itemsPerPage = parseInt(value, 10);
	        $scope.totalPages = self.calculateTotalPages();
	      });
	    } else {
	      this.itemsPerPage = config.itemsPerPage;
	    }

	    $scope.$watch('totalItems', function() {
	      $scope.totalPages = self.calculateTotalPages();
	    });

	    $scope.$watch('totalPages', function(value) {
	      setNumPages($scope.$parent, value); // Readonly variable

	      if ( $scope.page > value ) {
	        $scope.selectPage(value);
	      } else {
	        ngModelCtrl.$render();
	      }
	    });
	  };

	  this.calculateTotalPages = function() {
	    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
	    return Math.max(totalPages || 0, 1);
	  };

	  this.render = function() {
	    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
	  };

	  $scope.selectPage = function(page, evt) {
	    if (evt) {
	      evt.preventDefault();
	    }

	    var clickAllowed = !$scope.ngDisabled || !evt;
	    if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
	      if (evt && evt.target) {
	        evt.target.blur();
	      }
	      ngModelCtrl.$setViewValue(page);
	      ngModelCtrl.$render();
	    }
	  };

	  $scope.getText = function(key) {
	    return $scope[key + 'Text'] || self.config[key + 'Text'];
	  };

	  $scope.noPrevious = function() {
	    return $scope.page === 1;
	  };

	  $scope.noNext = function() {
	    return $scope.page === $scope.totalPages;
	  };
	}])
	.directive('pagination', ['$parse', 'uibPaginationConfig', '$log', '$paginationSuppressWarning', function($parse, paginationConfig, $log, $paginationSuppressWarning) {
	  return {
	    restrict: 'EA',
	    scope: {
	      totalItems: '=',
	      firstText: '@',
	      previousText: '@',
	      nextText: '@',
	      lastText: '@',
	      ngDisabled:'='
	    },
	    require: ['pagination', '?ngModel'],
	    controller: 'PaginationController',
	    controllerAs: 'pagination',
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/pagination/pagination.html';
	    },
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      if (!$paginationSuppressWarning) {
	        $log.warn('pagination is now deprecated. Use uib-pagination instead.');
	      }
	      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (!ngModelCtrl) {
	         return; // do nothing if no ng-model
	      }

	      // Setup configuration parameters
	      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
	          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
	      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
	      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

	      paginationCtrl.init(ngModelCtrl, paginationConfig);

	      if (attrs.maxSize) {
	        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
	          maxSize = parseInt(value, 10);
	          paginationCtrl.render();
	        });
	      }

	      // Create page object used in template
	      function makePage(number, text, isActive) {
	        return {
	          number: number,
	          text: text,
	          active: isActive
	        };
	      }

	      function getPages(currentPage, totalPages) {
	        var pages = [];

	        // Default page limits
	        var startPage = 1, endPage = totalPages;
	        var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

	        // recompute if maxSize
	        if (isMaxSized) {
	          if (rotate) {
	            // Current page is displayed in the middle of the visible ones
	            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
	            endPage   = startPage + maxSize - 1;

	            // Adjust if limit is exceeded
	            if (endPage > totalPages) {
	              endPage   = totalPages;
	              startPage = endPage - maxSize + 1;
	            }
	          } else {
	            // Visible pages are paginated with maxSize
	            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

	            // Adjust last page if limit is exceeded
	            endPage = Math.min(startPage + maxSize - 1, totalPages);
	          }
	        }

	        // Add page number links
	        for (var number = startPage; number <= endPage; number++) {
	          var page = makePage(number, number, number === currentPage);
	          pages.push(page);
	        }

	        // Add links to move between page sets
	        if (isMaxSized && ! rotate) {
	          if (startPage > 1) {
	            var previousPageSet = makePage(startPage - 1, '...', false);
	            pages.unshift(previousPageSet);
	          }

	          if (endPage < totalPages) {
	            var nextPageSet = makePage(endPage + 1, '...', false);
	            pages.push(nextPageSet);
	          }
	        }

	        return pages;
	      }

	      var originalRender = paginationCtrl.render;
	      paginationCtrl.render = function() {
	        originalRender();
	        if (scope.page > 0 && scope.page <= scope.totalPages) {
	          scope.pages = getPages(scope.page, scope.totalPages);
	        }
	      };
	    }
	  };
	}])

	.directive('pager', ['uibPagerConfig', '$log', '$paginationSuppressWarning', function(pagerConfig, $log, $paginationSuppressWarning) {
	  return {
	    restrict: 'EA',
	    scope: {
	      totalItems: '=',
	      previousText: '@',
	      nextText: '@',
	      ngDisabled: '='
	    },
	    require: ['pager', '?ngModel'],
	    controller: 'PaginationController',
	    controllerAs: 'pagination',
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/pagination/pager.html';
	    },
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      if (!$paginationSuppressWarning) {
	        $log.warn('pager is now deprecated. Use uib-pager instead.');
	      }
	      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (!ngModelCtrl) {
	         return; // do nothing if no ng-model
	      }

	      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
	      paginationCtrl.init(ngModelCtrl, pagerConfig);
	    }
	  };
	}]);

	/**
	 * The following features are still outstanding: animation as a
	 * function, placement as a function, inside, support for more triggers than
	 * just mouse enter/leave, html tooltips, and selector delegation.
	 */
	angular.module('ui.bootstrap.tooltip', ['ui.bootstrap.position', 'ui.bootstrap.stackedMap'])

	/**
	 * The $tooltip service creates tooltip- and popover-like directives as well as
	 * houses global options for them.
	 */
	.provider('$uibTooltip', function() {
	  // The default options tooltip and popover.
	  var defaultOptions = {
	    placement: 'top',
	    animation: true,
	    popupDelay: 0,
	    popupCloseDelay: 0,
	    useContentExp: false
	  };

	  // Default hide triggers for each show trigger
	  var triggerMap = {
	    'mouseenter': 'mouseleave',
	    'click': 'click',
	    'focus': 'blur',
	    'none': ''
	  };

	  // The options specified to the provider globally.
	  var globalOptions = {};

	  /**
	   * `options({})` allows global configuration of all tooltips in the
	   * application.
	   *
	   *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
	   *     // place tooltips left instead of top by default
	   *     $tooltipProvider.options( { placement: 'left' } );
	   *   });
	   */
		this.options = function(value) {
			angular.extend(globalOptions, value);
		};

	  /**
	   * This allows you to extend the set of trigger mappings available. E.g.:
	   *
	   *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
	   */
	  this.setTriggers = function setTriggers(triggers) {
	    angular.extend(triggerMap, triggers);
	  };

	  /**
	   * This is a helper function for translating camel-case to snake-case.
	   */
	  function snake_case(name) {
	    var regexp = /[A-Z]/g;
	    var separator = '-';
	    return name.replace(regexp, function(letter, pos) {
	      return (pos ? separator : '') + letter.toLowerCase();
	    });
	  }

	  /**
	   * Returns the actual instance of the $tooltip service.
	   * TODO support multiple triggers
	   */
	  this.$get = ['$window', '$compile', '$timeout', '$document', '$uibPosition', '$interpolate', '$rootScope', '$parse', '$$stackedMap', function($window, $compile, $timeout, $document, $position, $interpolate, $rootScope, $parse, $$stackedMap) {
	    var openedTooltips = $$stackedMap.createNew();
	    $document.on('keypress', function(e) {
	      if (e.which === 27) {
	        var last = openedTooltips.top();
	        if (last) {
	          last.value.close();
	          openedTooltips.removeTop();
	          last = null;
	        }
	      }
	    });

	    return function $tooltip(ttType, prefix, defaultTriggerShow, options) {
	      options = angular.extend({}, defaultOptions, globalOptions, options);

	      /**
	       * Returns an object of show and hide triggers.
	       *
	       * If a trigger is supplied,
	       * it is used to show the tooltip; otherwise, it will use the `trigger`
	       * option passed to the `$tooltipProvider.options` method; else it will
	       * default to the trigger supplied to this directive factory.
	       *
	       * The hide trigger is based on the show trigger. If the `trigger` option
	       * was passed to the `$tooltipProvider.options` method, it will use the
	       * mapped trigger from `triggerMap` or the passed trigger if the map is
	       * undefined; otherwise, it uses the `triggerMap` value of the show
	       * trigger; else it will just use the show trigger.
	       */
	      function getTriggers(trigger) {
	        var show = (trigger || options.trigger || defaultTriggerShow).split(' ');
	        var hide = show.map(function(trigger) {
	          return triggerMap[trigger] || trigger;
	        });
	        return {
	          show: show,
	          hide: hide
	        };
	      }

	      var directiveName = snake_case(ttType);

	      var startSym = $interpolate.startSymbol();
	      var endSym = $interpolate.endSymbol();
	      var template =
	        '<div '+ directiveName + '-popup '+
	          'title="' + startSym + 'title' + endSym + '" '+
	          (options.useContentExp ?
	            'content-exp="contentExp()" ' :
	            'content="' + startSym + 'content' + endSym + '" ') +
	          'placement="' + startSym + 'placement' + endSym + '" '+
	          'popup-class="' + startSym + 'popupClass' + endSym + '" '+
	          'animation="animation" ' +
	          'is-open="isOpen"' +
	          'origin-scope="origScope" ' +
	          'style="visibility: hidden; display: block; top: -9999px; left: -9999px;"' +
	          '>' +
	        '</div>';

	      return {
	        compile: function(tElem, tAttrs) {
	          var tooltipLinker = $compile(template);

	          return function link(scope, element, attrs, tooltipCtrl) {
	            var tooltip;
	            var tooltipLinkedScope;
	            var transitionTimeout;
	            var showTimeout;
	            var hideTimeout;
	            var positionTimeout;
	            var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
	            var triggers = getTriggers(undefined);
	            var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
	            var ttScope = scope.$new(true);
	            var repositionScheduled = false;
	            var isOpenParse = angular.isDefined(attrs[prefix + 'IsOpen']) ? $parse(attrs[prefix + 'IsOpen']) : false;
	            var contentParse = options.useContentExp ? $parse(attrs[ttType]) : false;
	            var observers = [];

	            var positionTooltip = function() {
	              // check if tooltip exists and is not empty
	              if (!tooltip || !tooltip.html()) { return; }

	              if (!positionTimeout) {
	                positionTimeout = $timeout(function() {
	                  // Reset the positioning.
	                  tooltip.css({ top: 0, left: 0 });

	                  // Now set the calculated positioning.
	                  var ttCss = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
	                  ttCss.top += 'px';
	                  ttCss.left += 'px';
	                  ttCss.visibility = 'visible';
	                  tooltip.css(ttCss);

	                  positionTimeout = null;
	                }, 0, false);
	              }
	            };

	            // Set up the correct scope to allow transclusion later
	            ttScope.origScope = scope;

	            // By default, the tooltip is not open.
	            // TODO add ability to start tooltip opened
	            ttScope.isOpen = false;
	            openedTooltips.add(ttScope, {
	              close: hide
	            });

	            function toggleTooltipBind() {
	              if (!ttScope.isOpen) {
	                showTooltipBind();
	              } else {
	                hideTooltipBind();
	              }
	            }

	            // Show the tooltip with delay if specified, otherwise show it immediately
	            function showTooltipBind() {
	              if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
	                return;
	              }

	              cancelHide();
	              prepareTooltip();

	              if (ttScope.popupDelay) {
	                // Do nothing if the tooltip was already scheduled to pop-up.
	                // This happens if show is triggered multiple times before any hide is triggered.
	                if (!showTimeout) {
	                  showTimeout = $timeout(show, ttScope.popupDelay, false);
	                }
	              } else {
	                show();
	              }
	            }

	            function hideTooltipBind() {
	              cancelShow();

	              if (ttScope.popupCloseDelay) {
	                if (!hideTimeout) {
	                  hideTimeout = $timeout(hide, ttScope.popupCloseDelay, false);
	                }
	              } else {
	                hide();
	              }
	            }

	            // Show the tooltip popup element.
	            function show() {
	              cancelShow();
	              cancelHide();

	              // Don't show empty tooltips.
	              if (!ttScope.content) {
	                return angular.noop;
	              }

	              createTooltip();

	              // And show the tooltip.
	              ttScope.$evalAsync(function() {
	                ttScope.isOpen = true;
	                assignIsOpen(true);
	                positionTooltip();
	              });
	            }

	            function cancelShow() {
	              if (showTimeout) {
	                $timeout.cancel(showTimeout);
	                showTimeout = null;
	              }

	              if (positionTimeout) {
	                $timeout.cancel(positionTimeout);
	                positionTimeout = null;
	              }
	            }

	            // Hide the tooltip popup element.
	            function hide() {
	              cancelShow();
	              cancelHide();

	              if (!ttScope) {
	                return;
	              }

	              // First things first: we don't show it anymore.
	              ttScope.$evalAsync(function() {
	                ttScope.isOpen = false;
	                assignIsOpen(false);
	                // And now we remove it from the DOM. However, if we have animation, we
	                // need to wait for it to expire beforehand.
	                // FIXME: this is a placeholder for a port of the transitions library.
	                // The fade transition in TWBS is 150ms.
	                if (ttScope.animation) {
	                  if (!transitionTimeout) {
	                    transitionTimeout = $timeout(removeTooltip, 150, false);
	                  }
	                } else {
	                  removeTooltip();
	                }
	              });
	            }

	            function cancelHide() {
	              if (hideTimeout) {
	                $timeout.cancel(hideTimeout);
	                hideTimeout = null;
	              }
	              if (transitionTimeout) {
	                $timeout.cancel(transitionTimeout);
	                transitionTimeout = null;
	              }
	            }

	            function createTooltip() {
	              // There can only be one tooltip element per directive shown at once.
	              if (tooltip) {
	                return;
	              }

	              tooltipLinkedScope = ttScope.$new();
	              tooltip = tooltipLinker(tooltipLinkedScope, function(tooltip) {
	                if (appendToBody) {
	                  $document.find('body').append(tooltip);
	                } else {
	                  element.after(tooltip);
	                }
	              });

	              prepObservers();
	            }

	            function removeTooltip() {
	              unregisterObservers();

	              transitionTimeout = null;
	              if (tooltip) {
	                tooltip.remove();
	                tooltip = null;
	              }
	              if (tooltipLinkedScope) {
	                tooltipLinkedScope.$destroy();
	                tooltipLinkedScope = null;
	              }
	            }

	            /**
	             * Set the inital scope values. Once
	             * the tooltip is created, the observers
	             * will be added to keep things in synch.
	             */
	            function prepareTooltip() {
	              ttScope.title = attrs[prefix + 'Title'];
	              if (contentParse) {
	                ttScope.content = contentParse(scope);
	              } else {
	                ttScope.content = attrs[ttType];
	              }

	              ttScope.popupClass = attrs[prefix + 'Class'];
	              ttScope.placement = angular.isDefined(attrs[prefix + 'Placement']) ? attrs[prefix + 'Placement'] : options.placement;

	              var delay = parseInt(attrs[prefix + 'PopupDelay'], 10);
	              var closeDelay = parseInt(attrs[prefix + 'PopupCloseDelay'], 10);
	              ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
	              ttScope.popupCloseDelay = !isNaN(closeDelay) ? closeDelay : options.popupCloseDelay;
	            }

	            function assignIsOpen(isOpen) {
	              if (isOpenParse && angular.isFunction(isOpenParse.assign)) {
	                isOpenParse.assign(scope, isOpen);
	              }
	            }

	            ttScope.contentExp = function() {
	              return ttScope.content;
	            };

	            /**
	             * Observe the relevant attributes.
	             */
	            attrs.$observe('disabled', function(val) {
	              if (val) {
	                cancelShow();
	              }

	              if (val && ttScope.isOpen) {
	                hide();
	              }
	            });

	            if (isOpenParse) {
	              scope.$watch(isOpenParse, function(val) {
	                /*jshint -W018 */
	                if (ttScope && !val === ttScope.isOpen) {
	                  toggleTooltipBind();
	                }
	                /*jshint +W018 */
	              });
	            }

	            function prepObservers() {
	              observers.length = 0;

	              if (contentParse) {
	                observers.push(
	                  scope.$watch(contentParse, function(val) {
	                    ttScope.content = val;
	                    if (!val && ttScope.isOpen) {
	                      hide();
	                    }
	                  })
	                );

	                observers.push(
	                  tooltipLinkedScope.$watch(function() {
	                    if (!repositionScheduled) {
	                      repositionScheduled = true;
	                      tooltipLinkedScope.$$postDigest(function() {
	                        repositionScheduled = false;
	                        if (ttScope && ttScope.isOpen) {
	                          positionTooltip();
	                        }
	                      });
	                    }
	                  })
	                );
	              } else {
	                observers.push(
	                  attrs.$observe(ttType, function(val) {
	                    ttScope.content = val;
	                    if (!val && ttScope.isOpen) {
	                      hide();
	                    } else {
	                      positionTooltip();
	                    }
	                  })
	                );
	              }

	              observers.push(
	                attrs.$observe(prefix + 'Title', function(val) {
	                  ttScope.title = val;
	                  if (ttScope.isOpen) {
	                    positionTooltip();
	                  }
	                })
	              );

	              observers.push(
	                attrs.$observe(prefix + 'Placement', function(val) {
	                  ttScope.placement = val ? val : options.placement;
	                  if (ttScope.isOpen) {
	                    positionTooltip();
	                  }
	                })
	              );
	            }

	            function unregisterObservers() {
	              if (observers.length) {
	                angular.forEach(observers, function(observer) {
	                  observer();
	                });
	                observers.length = 0;
	              }
	            }

	            var unregisterTriggers = function() {
	              triggers.show.forEach(function(trigger) {
	                element.unbind(trigger, showTooltipBind);
	              });
	              triggers.hide.forEach(function(trigger) {
	                trigger.split(' ').forEach(function(hideTrigger) {
	                  element[0].removeEventListener(hideTrigger, hideTooltipBind);
	                });
	              });
	            };

	            function prepTriggers() {
	              var val = attrs[prefix + 'Trigger'];
	              unregisterTriggers();

	              triggers = getTriggers(val);

	              if (triggers.show !== 'none') {
	                triggers.show.forEach(function(trigger, idx) {
	                  // Using raw addEventListener due to jqLite/jQuery bug - #4060
	                  if (trigger === triggers.hide[idx]) {
	                    element[0].addEventListener(trigger, toggleTooltipBind);
	                  } else if (trigger) {
	                    element[0].addEventListener(trigger, showTooltipBind);
	                    triggers.hide[idx].split(' ').forEach(function(trigger) {
	                      element[0].addEventListener(trigger, hideTooltipBind);
	                    });
	                  }

	                  element.on('keypress', function(e) {
	                    if (e.which === 27) {
	                      hideTooltipBind();
	                    }
	                  });
	                });
	              }
	            }

	            prepTriggers();

	            var animation = scope.$eval(attrs[prefix + 'Animation']);
	            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

	            var appendToBodyVal = scope.$eval(attrs[prefix + 'AppendToBody']);
	            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

	            // if a tooltip is attached to <body> we need to remove it on
	            // location change as its parent scope will probably not be destroyed
	            // by the change.
	            if (appendToBody) {
	              scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess() {
	                if (ttScope.isOpen) {
	                  hide();
	                }
	              });
	            }

	            // Make sure tooltip is destroyed and removed.
	            scope.$on('$destroy', function onDestroyTooltip() {
	              cancelShow();
	              cancelHide();
	              unregisterTriggers();
	              removeTooltip();
	              openedTooltips.remove(ttScope);
	              ttScope = null;
	            });
	          };
	        }
	      };
	    };
	  }];
	})

	// This is mostly ngInclude code but with a custom scope
	.directive('uibTooltipTemplateTransclude', [
	         '$animate', '$sce', '$compile', '$templateRequest',
	function ($animate ,  $sce ,  $compile ,  $templateRequest) {
	  return {
	    link: function(scope, elem, attrs) {
	      var origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);

	      var changeCounter = 0,
	        currentScope,
	        previousElement,
	        currentElement;

	      var cleanupLastIncludeContent = function() {
	        if (previousElement) {
	          previousElement.remove();
	          previousElement = null;
	        }

	        if (currentScope) {
	          currentScope.$destroy();
	          currentScope = null;
	        }

	        if (currentElement) {
	          $animate.leave(currentElement).then(function() {
	            previousElement = null;
	          });
	          previousElement = currentElement;
	          currentElement = null;
	        }
	      };

	      scope.$watch($sce.parseAsResourceUrl(attrs.uibTooltipTemplateTransclude), function(src) {
	        var thisChangeId = ++changeCounter;

	        if (src) {
	          //set the 2nd param to true to ignore the template request error so that the inner
	          //contents and scope can be cleaned up.
	          $templateRequest(src, true).then(function(response) {
	            if (thisChangeId !== changeCounter) { return; }
	            var newScope = origScope.$new();
	            var template = response;

	            var clone = $compile(template)(newScope, function(clone) {
	              cleanupLastIncludeContent();
	              $animate.enter(clone, elem);
	            });

	            currentScope = newScope;
	            currentElement = clone;

	            currentScope.$emit('$includeContentLoaded', src);
	          }, function() {
	            if (thisChangeId === changeCounter) {
	              cleanupLastIncludeContent();
	              scope.$emit('$includeContentError', src);
	            }
	          });
	          scope.$emit('$includeContentRequested', src);
	        } else {
	          cleanupLastIncludeContent();
	        }
	      });

	      scope.$on('$destroy', cleanupLastIncludeContent);
	    }
	  };
	}])

	/**
	 * Note that it's intentional that these classes are *not* applied through $animate.
	 * They must not be animated as they're expected to be present on the tooltip on
	 * initialization.
	 */
	.directive('uibTooltipClasses', function() {
	  return {
	    restrict: 'A',
	    link: function(scope, element, attrs) {
	      if (scope.placement) {
	        element.addClass(scope.placement);
	      }

	      if (scope.popupClass) {
	        element.addClass(scope.popupClass);
	      }

	      if (scope.animation()) {
	        element.addClass(attrs.tooltipAnimationClass);
	      }
	    }
	  };
	})

	.directive('uibTooltipPopup', function() {
	  return {
	    replace: true,
	    scope: { content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/tooltip/tooltip-popup.html',
	    link: function(scope, element) {
	      element.addClass('tooltip');
	    }
	  };
	})

	.directive('uibTooltip', [ '$uibTooltip', function($uibTooltip) {
	  return $uibTooltip('uibTooltip', 'tooltip', 'mouseenter');
	}])

	.directive('uibTooltipTemplatePopup', function() {
	  return {
	    replace: true,
	    scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
	      originScope: '&' },
	    templateUrl: 'template/tooltip/tooltip-template-popup.html',
	    link: function(scope, element) {
	      element.addClass('tooltip');
	    }
	  };
	})

	.directive('uibTooltipTemplate', ['$uibTooltip', function($uibTooltip) {
	  return $uibTooltip('uibTooltipTemplate', 'tooltip', 'mouseenter', {
	    useContentExp: true
	  });
	}])

	.directive('uibTooltipHtmlPopup', function() {
	  return {
	    replace: true,
	    scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/tooltip/tooltip-html-popup.html',
	    link: function(scope, element) {
	      element.addClass('tooltip');
	    }
	  };
	})

	.directive('uibTooltipHtml', ['$uibTooltip', function($uibTooltip) {
	  return $uibTooltip('uibTooltipHtml', 'tooltip', 'mouseenter', {
	    useContentExp: true
	  });
	}]);

	/* Deprecated tooltip below */

	angular.module('ui.bootstrap.tooltip')

	.value('$tooltipSuppressWarning', false)

	.provider('$tooltip', ['$uibTooltipProvider', function($uibTooltipProvider) {
	  angular.extend(this, $uibTooltipProvider);

	  this.$get = ['$log', '$tooltipSuppressWarning', '$injector', function($log, $tooltipSuppressWarning, $injector) {
	    if (!$tooltipSuppressWarning) {
	      $log.warn('$tooltip is now deprecated. Use $uibTooltip instead.');
	    }

	    return $injector.invoke($uibTooltipProvider.$get);
	  }];
	}])

	// This is mostly ngInclude code but with a custom scope
	.directive('tooltipTemplateTransclude', [
	         '$animate', '$sce', '$compile', '$templateRequest', '$log', '$tooltipSuppressWarning',
	function ($animate ,  $sce ,  $compile ,  $templateRequest,   $log,   $tooltipSuppressWarning) {
	  return {
	    link: function(scope, elem, attrs) {
	      if (!$tooltipSuppressWarning) {
	        $log.warn('tooltip-template-transclude is now deprecated. Use uib-tooltip-template-transclude instead.');
	      }

	      var origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);

	      var changeCounter = 0,
	        currentScope,
	        previousElement,
	        currentElement;

	      var cleanupLastIncludeContent = function() {
	        if (previousElement) {
	          previousElement.remove();
	          previousElement = null;
	        }
	        if (currentScope) {
	          currentScope.$destroy();
	          currentScope = null;
	        }
	        if (currentElement) {
	          $animate.leave(currentElement).then(function() {
	            previousElement = null;
	          });
	          previousElement = currentElement;
	          currentElement = null;
	        }
	      };

	      scope.$watch($sce.parseAsResourceUrl(attrs.tooltipTemplateTransclude), function(src) {
	        var thisChangeId = ++changeCounter;

	        if (src) {
	          //set the 2nd param to true to ignore the template request error so that the inner
	          //contents and scope can be cleaned up.
	          $templateRequest(src, true).then(function(response) {
	            if (thisChangeId !== changeCounter) { return; }
	            var newScope = origScope.$new();
	            var template = response;

	            var clone = $compile(template)(newScope, function(clone) {
	              cleanupLastIncludeContent();
	              $animate.enter(clone, elem);
	            });

	            currentScope = newScope;
	            currentElement = clone;

	            currentScope.$emit('$includeContentLoaded', src);
	          }, function() {
	            if (thisChangeId === changeCounter) {
	              cleanupLastIncludeContent();
	              scope.$emit('$includeContentError', src);
	            }
	          });
	          scope.$emit('$includeContentRequested', src);
	        } else {
	          cleanupLastIncludeContent();
	        }
	      });

	      scope.$on('$destroy', cleanupLastIncludeContent);
	    }
	  };
	}])

	.directive('tooltipClasses', ['$log', '$tooltipSuppressWarning', function($log, $tooltipSuppressWarning) {
	  return {
	    restrict: 'A',
	    link: function(scope, element, attrs) {
	      if (!$tooltipSuppressWarning) {
	        $log.warn('tooltip-classes is now deprecated. Use uib-tooltip-classes instead.');
	      }

	      if (scope.placement) {
	        element.addClass(scope.placement);
	      }
	      if (scope.popupClass) {
	        element.addClass(scope.popupClass);
	      }
	      if (scope.animation()) {
	        element.addClass(attrs.tooltipAnimationClass);
	      }
	    }
	  };
	}])

	.directive('tooltipPopup', ['$log', '$tooltipSuppressWarning', function($log, $tooltipSuppressWarning) {
	  return {
	    replace: true,
	    scope: { content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/tooltip/tooltip-popup.html',
	    link: function(scope, element) {
	      if (!$tooltipSuppressWarning) {
	        $log.warn('tooltip-popup is now deprecated. Use uib-tooltip-popup instead.');
	      }

	      element.addClass('tooltip');
	    }
	  };
	}])

	.directive('tooltip', ['$tooltip', function($tooltip) {
	  return $tooltip('tooltip', 'tooltip', 'mouseenter');
	}])

	.directive('tooltipTemplatePopup', ['$log', '$tooltipSuppressWarning', function($log, $tooltipSuppressWarning) {
	  return {
	    replace: true,
	    scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
	      originScope: '&' },
	    templateUrl: 'template/tooltip/tooltip-template-popup.html',
	    link: function(scope, element) {
	      if (!$tooltipSuppressWarning) {
	        $log.warn('tooltip-template-popup is now deprecated. Use uib-tooltip-template-popup instead.');
	      }

	      element.addClass('tooltip');
	    }
	  };
	}])

	.directive('tooltipTemplate', ['$tooltip', function($tooltip) {
	  return $tooltip('tooltipTemplate', 'tooltip', 'mouseenter', {
	    useContentExp: true
	  });
	}])

	.directive('tooltipHtmlPopup', ['$log', '$tooltipSuppressWarning', function($log, $tooltipSuppressWarning) {
	  return {
	    replace: true,
	    scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/tooltip/tooltip-html-popup.html',
	    link: function(scope, element) {
	      if (!$tooltipSuppressWarning) {
	        $log.warn('tooltip-html-popup is now deprecated. Use uib-tooltip-html-popup instead.');
	      }

	      element.addClass('tooltip');
	    }
	  };
	}])

	.directive('tooltipHtml', ['$tooltip', function($tooltip) {
	  return $tooltip('tooltipHtml', 'tooltip', 'mouseenter', {
	    useContentExp: true
	  });
	}]);

	/**
	 * The following features are still outstanding: popup delay, animation as a
	 * function, placement as a function, inside, support for more triggers than
	 * just mouse enter/leave, and selector delegatation.
	 */
	angular.module('ui.bootstrap.popover', ['ui.bootstrap.tooltip'])

	.directive('uibPopoverTemplatePopup', function() {
	  return {
	    replace: true,
	    scope: { title: '@', contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
	      originScope: '&' },
	    templateUrl: 'template/popover/popover-template.html',
	    link: function(scope, element) {
	      element.addClass('popover');
	    }
	  };
	})

	.directive('uibPopoverTemplate', ['$uibTooltip', function($uibTooltip) {
	  return $uibTooltip('uibPopoverTemplate', 'popover', 'click', {
	    useContentExp: true
	  });
	}])

	.directive('uibPopoverHtmlPopup', function() {
	  return {
	    replace: true,
	    scope: { contentExp: '&', title: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/popover/popover-html.html',
	    link: function(scope, element) {
	      element.addClass('popover');
	    }
	  };
	})

	.directive('uibPopoverHtml', ['$uibTooltip', function($uibTooltip) {
	  return $uibTooltip('uibPopoverHtml', 'popover', 'click', {
	    useContentExp: true
	  });
	}])

	.directive('uibPopoverPopup', function() {
	  return {
	    replace: true,
	    scope: { title: '@', content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/popover/popover.html',
	    link: function(scope, element) {
	      element.addClass('popover');
	    }
	  };
	})

	.directive('uibPopover', ['$uibTooltip', function($uibTooltip) {
	  return $uibTooltip('uibPopover', 'popover', 'click');
	}]);

	/* Deprecated popover below */

	angular.module('ui.bootstrap.popover')

	.value('$popoverSuppressWarning', false)

	.directive('popoverTemplatePopup', ['$log', '$popoverSuppressWarning', function($log, $popoverSuppressWarning) {
	  return {
	    replace: true,
	    scope: { title: '@', contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
	      originScope: '&' },
	    templateUrl: 'template/popover/popover-template.html',
	    link: function(scope, element) {
	      if (!$popoverSuppressWarning) {
	        $log.warn('popover-template-popup is now deprecated. Use uib-popover-template-popup instead.');
	      }

	      element.addClass('popover');
	    }
	  };
	}])

	.directive('popoverTemplate', ['$tooltip', function($tooltip) {
	  return $tooltip('popoverTemplate', 'popover', 'click', {
	    useContentExp: true
	  });
	}])

	.directive('popoverHtmlPopup', ['$log', '$popoverSuppressWarning', function($log, $popoverSuppressWarning) {
	  return {
	    replace: true,
	    scope: { contentExp: '&', title: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/popover/popover-html.html',
	    link: function(scope, element) {
	      if (!$popoverSuppressWarning) {
	        $log.warn('popover-html-popup is now deprecated. Use uib-popover-html-popup instead.');
	      }

	      element.addClass('popover');
	    }
	  };
	}])

	.directive('popoverHtml', ['$tooltip', function($tooltip) {
	  return $tooltip('popoverHtml', 'popover', 'click', {
	    useContentExp: true
	  });
	}])

	.directive('popoverPopup', ['$log', '$popoverSuppressWarning', function($log, $popoverSuppressWarning) {
	  return {
	    replace: true,
	    scope: { title: '@', content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
	    templateUrl: 'template/popover/popover.html',
	    link: function(scope, element) {
	      if (!$popoverSuppressWarning) {
	        $log.warn('popover-popup is now deprecated. Use uib-popover-popup instead.');
	      }

	      element.addClass('popover');
	    }
	  };
	}])

	.directive('popover', ['$tooltip', function($tooltip) {

	  return $tooltip('popover', 'popover', 'click');
	}]);

	angular.module('ui.bootstrap.progressbar', [])

	.constant('uibProgressConfig', {
	  animate: true,
	  max: 100
	})

	.controller('UibProgressController', ['$scope', '$attrs', 'uibProgressConfig', function($scope, $attrs, progressConfig) {
	  var self = this,
	      animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

	  this.bars = [];
	  $scope.max = angular.isDefined($scope.max) ? $scope.max : progressConfig.max;

	  this.addBar = function(bar, element, attrs) {
	    if (!animate) {
	      element.css({'transition': 'none'});
	    }

	    this.bars.push(bar);

	    bar.max = $scope.max;
	    bar.title = attrs && angular.isDefined(attrs.title) ? attrs.title : 'progressbar';

	    bar.$watch('value', function(value) {
	      bar.recalculatePercentage();
	    });

	    bar.recalculatePercentage = function() {
	      var totalPercentage = self.bars.reduce(function(total, bar) {
	        bar.percent = +(100 * bar.value / bar.max).toFixed(2);
	        return total + bar.percent;
	      }, 0);

	      if (totalPercentage > 100) {
	        bar.percent -= totalPercentage - 100;
	      }
	    };

	    bar.$on('$destroy', function() {
	      element = null;
	      self.removeBar(bar);
	    });
	  };

	  this.removeBar = function(bar) {
	    this.bars.splice(this.bars.indexOf(bar), 1);
	    this.bars.forEach(function (bar) {
	      bar.recalculatePercentage();
	    });
	  };

	  $scope.$watch('max', function(max) {
	    self.bars.forEach(function(bar) {
	      bar.max = $scope.max;
	      bar.recalculatePercentage();
	    });
	  });
	}])

	.directive('uibProgress', function() {
	  return {
	    replace: true,
	    transclude: true,
	    controller: 'UibProgressController',
	    require: 'uibProgress',
	    scope: {
	      max: '=?'
	    },
	    templateUrl: 'template/progressbar/progress.html'
	  };
	})

	.directive('uibBar', function() {
	  return {
	    replace: true,
	    transclude: true,
	    require: '^uibProgress',
	    scope: {
	      value: '=',
	      type: '@'
	    },
	    templateUrl: 'template/progressbar/bar.html',
	    link: function(scope, element, attrs, progressCtrl) {
	      progressCtrl.addBar(scope, element, attrs);
	    }
	  };
	})

	.directive('uibProgressbar', function() {
	  return {
	    replace: true,
	    transclude: true,
	    controller: 'UibProgressController',
	    scope: {
	      value: '=',
	      max: '=?',
	      type: '@'
	    },
	    templateUrl: 'template/progressbar/progressbar.html',
	    link: function(scope, element, attrs, progressCtrl) {
	      progressCtrl.addBar(scope, angular.element(element.children()[0]), {title: attrs.title});
	    }
	  };
	});

	/* Deprecated progressbar below */

	angular.module('ui.bootstrap.progressbar')

	.value('$progressSuppressWarning', false)

	.controller('ProgressController', ['$scope', '$attrs', 'uibProgressConfig', '$log', '$progressSuppressWarning', function($scope, $attrs, progressConfig, $log, $progressSuppressWarning) {
	  if (!$progressSuppressWarning) {
	    $log.warn('ProgressController is now deprecated. Use UibProgressController instead.');
	  }

	  var self = this,
	    animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

	  this.bars = [];
	  $scope.max = angular.isDefined($scope.max) ? $scope.max : progressConfig.max;

	  this.addBar = function(bar, element, attrs) {
	    if (!animate) {
	      element.css({'transition': 'none'});
	    }

	    this.bars.push(bar);

	    bar.max = $scope.max;
	    bar.title = attrs && angular.isDefined(attrs.title) ? attrs.title : 'progressbar';

	    bar.$watch('value', function(value) {
	      bar.recalculatePercentage();
	    });

	    bar.recalculatePercentage = function() {
	      bar.percent = +(100 * bar.value / bar.max).toFixed(2);

	      var totalPercentage = self.bars.reduce(function(total, bar) {
	        return total + bar.percent;
	      }, 0);

	      if (totalPercentage > 100) {
	        bar.percent -= totalPercentage - 100;
	      }
	    };

	    bar.$on('$destroy', function() {
	      element = null;
	      self.removeBar(bar);
	    });
	  };

	  this.removeBar = function(bar) {
	    this.bars.splice(this.bars.indexOf(bar), 1);
	  };

	  $scope.$watch('max', function(max) {
	    self.bars.forEach(function(bar) {
	      bar.max = $scope.max;
	      bar.recalculatePercentage();
	    });
	  });
	}])

	.directive('progress', ['$log', '$progressSuppressWarning', function($log, $progressSuppressWarning) {
	  return {
	    replace: true,
	    transclude: true,
	    controller: 'ProgressController',
	    require: 'progress',
	    scope: {
	      max: '=?',
	      title: '@?'
	    },
	    templateUrl: 'template/progressbar/progress.html',
	    link: function() {
	      if (!$progressSuppressWarning) {
	        $log.warn('progress is now deprecated. Use uib-progress instead.');
	      }
	    }
	  };
	}])

	.directive('bar', ['$log', '$progressSuppressWarning', function($log, $progressSuppressWarning) {
	  return {
	    replace: true,
	    transclude: true,
	    require: '^progress',
	    scope: {
	      value: '=',
	      type: '@'
	    },
	    templateUrl: 'template/progressbar/bar.html',
	    link: function(scope, element, attrs, progressCtrl) {
	      if (!$progressSuppressWarning) {
	        $log.warn('bar is now deprecated. Use uib-bar instead.');
	      }
	      progressCtrl.addBar(scope, element);
	    }
	  };
	}])

	.directive('progressbar', ['$log', '$progressSuppressWarning', function($log, $progressSuppressWarning) {
	  return {
	    replace: true,
	    transclude: true,
	    controller: 'ProgressController',
	    scope: {
	      value: '=',
	      max: '=?',
	      type: '@'
	    },
	    templateUrl: 'template/progressbar/progressbar.html',
	    link: function(scope, element, attrs, progressCtrl) {
	      if (!$progressSuppressWarning) {
	        $log.warn('progressbar is now deprecated. Use uib-progressbar instead.');
	      }
	      progressCtrl.addBar(scope, angular.element(element.children()[0]), {title: attrs.title});
	    }
	  };
	}]);

	angular.module('ui.bootstrap.rating', [])

	.constant('uibRatingConfig', {
	  max: 5,
	  stateOn: null,
	  stateOff: null,
	  titles : ['one', 'two', 'three', 'four', 'five']
	})

	.controller('UibRatingController', ['$scope', '$attrs', 'uibRatingConfig', function($scope, $attrs, ratingConfig) {
	  var ngModelCtrl  = { $setViewValue: angular.noop };

	  this.init = function(ngModelCtrl_) {
	    ngModelCtrl = ngModelCtrl_;
	    ngModelCtrl.$render = this.render;

	    ngModelCtrl.$formatters.push(function(value) {
	      if (angular.isNumber(value) && value << 0 !== value) {
	        value = Math.round(value);
	      }
	      return value;
	    });

	    this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
	    this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;
	    var tmpTitles = angular.isDefined($attrs.titles)  ? $scope.$parent.$eval($attrs.titles) : ratingConfig.titles ;
	    this.titles = angular.isArray(tmpTitles) && tmpTitles.length > 0 ?
	      tmpTitles : ratingConfig.titles;

	    var ratingStates = angular.isDefined($attrs.ratingStates) ?
	      $scope.$parent.$eval($attrs.ratingStates) :
	      new Array(angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max);
	    $scope.range = this.buildTemplateObjects(ratingStates);
	  };

	  this.buildTemplateObjects = function(states) {
	    for (var i = 0, n = states.length; i < n; i++) {
	      states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff, title: this.getTitle(i) }, states[i]);
	    }
	    return states;
	  };

	  this.getTitle = function(index) {
	    if (index >= this.titles.length) {
	      return index + 1;
	    } else {
	      return this.titles[index];
	    }
	  };

	  $scope.rate = function(value) {
	    if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
	      ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue === value ? 0 : value);
	      ngModelCtrl.$render();
	    }
	  };

	  $scope.enter = function(value) {
	    if (!$scope.readonly) {
	      $scope.value = value;
	    }
	    $scope.onHover({value: value});
	  };

	  $scope.reset = function() {
	    $scope.value = ngModelCtrl.$viewValue;
	    $scope.onLeave();
	  };

	  $scope.onKeydown = function(evt) {
	    if (/(37|38|39|40)/.test(evt.which)) {
	      evt.preventDefault();
	      evt.stopPropagation();
	      $scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1));
	    }
	  };

	  this.render = function() {
	    $scope.value = ngModelCtrl.$viewValue;
	  };
	}])

	.directive('uibRating', function() {
	  return {
	    require: ['uibRating', 'ngModel'],
	    scope: {
	      readonly: '=?',
	      onHover: '&',
	      onLeave: '&'
	    },
	    controller: 'UibRatingController',
	    templateUrl: 'template/rating/rating.html',
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
	      ratingCtrl.init(ngModelCtrl);
	    }
	  };
	});

	/* Deprecated rating below */

	angular.module('ui.bootstrap.rating')

	.value('$ratingSuppressWarning', false)

	.controller('RatingController', ['$scope', '$attrs', '$controller', '$log', '$ratingSuppressWarning', function($scope, $attrs, $controller, $log, $ratingSuppressWarning) {
	  if (!$ratingSuppressWarning) {
	    $log.warn('RatingController is now deprecated. Use UibRatingController instead.');
	  }

	  angular.extend(this, $controller('UibRatingController', {
	    $scope: $scope,
	    $attrs: $attrs
	  }));
	}])

	.directive('rating', ['$log', '$ratingSuppressWarning', function($log, $ratingSuppressWarning) {
	  return {
	    require: ['rating', 'ngModel'],
	    scope: {
	      readonly: '=?',
	      onHover: '&',
	      onLeave: '&'
	    },
	    controller: 'RatingController',
	    templateUrl: 'template/rating/rating.html',
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      if (!$ratingSuppressWarning) {
	        $log.warn('rating is now deprecated. Use uib-rating instead.');
	      }
	      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
	      ratingCtrl.init(ngModelCtrl);
	    }
	  };
	}]);


	/**
	 * @ngdoc overview
	 * @name ui.bootstrap.tabs
	 *
	 * @description
	 * AngularJS version of the tabs directive.
	 */

	angular.module('ui.bootstrap.tabs', [])

	.controller('UibTabsetController', ['$scope', function ($scope) {
	  var ctrl = this,
	      tabs = ctrl.tabs = $scope.tabs = [];

	  ctrl.select = function(selectedTab) {
	    angular.forEach(tabs, function(tab) {
	      if (tab.active && tab !== selectedTab) {
	        tab.active = false;
	        tab.onDeselect();
	        selectedTab.selectCalled = false;
	      }
	    });
	    selectedTab.active = true;
	    // only call select if it has not already been called
	    if (!selectedTab.selectCalled) {
	      selectedTab.onSelect();
	      selectedTab.selectCalled = true;
	    }
	  };

	  ctrl.addTab = function addTab(tab) {
	    tabs.push(tab);
	    // we can't run the select function on the first tab
	    // since that would select it twice
	    if (tabs.length === 1 && tab.active !== false) {
	      tab.active = true;
	    } else if (tab.active) {
	      ctrl.select(tab);
	    } else {
	      tab.active = false;
	    }
	  };

	  ctrl.removeTab = function removeTab(tab) {
	    var index = tabs.indexOf(tab);
	    //Select a new tab if the tab to be removed is selected and not destroyed
	    if (tab.active && tabs.length > 1 && !destroyed) {
	      //If this is the last tab, select the previous tab. else, the next tab.
	      var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
	      ctrl.select(tabs[newActiveIndex]);
	    }
	    tabs.splice(index, 1);
	  };

	  var destroyed;
	  $scope.$on('$destroy', function() {
	    destroyed = true;
	  });
	}])

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.tabs.directive:tabset
	 * @restrict EA
	 *
	 * @description
	 * Tabset is the outer container for the tabs directive
	 *
	 * @param {boolean=} vertical Whether or not to use vertical styling for the tabs.
	 * @param {boolean=} justified Whether or not to use justified styling for the tabs.
	 *
	 * @example
	<example module="ui.bootstrap">
	  <file name="index.html">
	    <uib-tabset>
	      <uib-tab heading="Tab 1"><b>First</b> Content!</uib-tab>
	      <uib-tab heading="Tab 2"><i>Second</i> Content!</uib-tab>
	    </uib-tabset>
	    <hr />
	    <uib-tabset vertical="true">
	      <uib-tab heading="Vertical Tab 1"><b>First</b> Vertical Content!</uib-tab>
	      <uib-tab heading="Vertical Tab 2"><i>Second</i> Vertical Content!</uib-tab>
	    </uib-tabset>
	    <uib-tabset justified="true">
	      <uib-tab heading="Justified Tab 1"><b>First</b> Justified Content!</uib-tab>
	      <uib-tab heading="Justified Tab 2"><i>Second</i> Justified Content!</uib-tab>
	    </uib-tabset>
	  </file>
	</example>
	 */
	.directive('uibTabset', function() {
	  return {
	    restrict: 'EA',
	    transclude: true,
	    replace: true,
	    scope: {
	      type: '@'
	    },
	    controller: 'UibTabsetController',
	    templateUrl: 'template/tabs/tabset.html',
	    link: function(scope, element, attrs) {
	      scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
	      scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
	    }
	  };
	})

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.tabs.directive:tab
	 * @restrict EA
	 *
	 * @param {string=} heading The visible heading, or title, of the tab. Set HTML headings with {@link ui.bootstrap.tabs.directive:tabHeading tabHeading}.
	 * @param {string=} select An expression to evaluate when the tab is selected.
	 * @param {boolean=} active A binding, telling whether or not this tab is selected.
	 * @param {boolean=} disabled A binding, telling whether or not this tab is disabled.
	 *
	 * @description
	 * Creates a tab with a heading and content. Must be placed within a {@link ui.bootstrap.tabs.directive:tabset tabset}.
	 *
	 * @example
	<example module="ui.bootstrap">
	  <file name="index.html">
	    <div ng-controller="TabsDemoCtrl">
	      <button class="btn btn-small" ng-click="items[0].active = true">
	        Select item 1, using active binding
	      </button>
	      <button class="btn btn-small" ng-click="items[1].disabled = !items[1].disabled">
	        Enable/disable item 2, using disabled binding
	      </button>
	      <br />
	      <uib-tabset>
	        <uib-tab heading="Tab 1">First Tab</uib-tab>
	        <uib-tab select="alertMe()">
	          <uib-tab-heading><i class="icon-bell"></i> Alert me!</tab-heading>
	          Second Tab, with alert callback and html heading!
	        </uib-tab>
	        <uib-tab ng-repeat="item in items"
	          heading="{{item.title}}"
	          disabled="item.disabled"
	          active="item.active">
	          {{item.content}}
	        </uib-tab>
	      </uib-tabset>
	    </div>
	  </file>
	  <file name="script.js">
	    function TabsDemoCtrl($scope) {
	      $scope.items = [
	        { title:"Dynamic Title 1", content:"Dynamic Item 0" },
	        { title:"Dynamic Title 2", content:"Dynamic Item 1", disabled: true }
	      ];

	      $scope.alertMe = function() {
	        setTimeout(function() {
	          alert("You've selected the alert tab!");
	        });
	      };
	    };
	  </file>
	</example>
	 */

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.tabs.directive:tabHeading
	 * @restrict EA
	 *
	 * @description
	 * Creates an HTML heading for a {@link ui.bootstrap.tabs.directive:tab tab}. Must be placed as a child of a tab element.
	 *
	 * @example
	<example module="ui.bootstrap">
	  <file name="index.html">
	    <uib-tabset>
	      <uib-tab>
	        <uib-tab-heading><b>HTML</b> in my titles?!</tab-heading>
	        And some content, too!
	      </uib-tab>
	      <uib-tab>
	        <uib-tab-heading><i class="icon-heart"></i> Icon heading?!?</tab-heading>
	        That's right.
	      </uib-tab>
	    </uib-tabset>
	  </file>
	</example>
	 */
	.directive('uibTab', ['$parse', function($parse) {
	  return {
	    require: '^uibTabset',
	    restrict: 'EA',
	    replace: true,
	    templateUrl: 'template/tabs/tab.html',
	    transclude: true,
	    scope: {
	      active: '=?',
	      heading: '@',
	      onSelect: '&select', //This callback is called in contentHeadingTransclude
	                          //once it inserts the tab's content into the dom
	      onDeselect: '&deselect'
	    },
	    controller: function() {
	      //Empty controller so other directives can require being 'under' a tab
	    },
	    link: function(scope, elm, attrs, tabsetCtrl, transclude) {
	      scope.$watch('active', function(active) {
	        if (active) {
	          tabsetCtrl.select(scope);
	        }
	      });

	      scope.disabled = false;
	      if (attrs.disable) {
	        scope.$parent.$watch($parse(attrs.disable), function(value) {
	          scope.disabled = !! value;
	        });
	      }

	      scope.select = function() {
	        if (!scope.disabled) {
	          scope.active = true;
	        }
	      };

	      tabsetCtrl.addTab(scope);
	      scope.$on('$destroy', function() {
	        tabsetCtrl.removeTab(scope);
	      });

	      //We need to transclude later, once the content container is ready.
	      //when this link happens, we're inside a tab heading.
	      scope.$transcludeFn = transclude;
	    }
	  };
	}])

	.directive('uibTabHeadingTransclude', function() {
	  return {
	    restrict: 'A',
	    require: ['?^uibTab', '?^tab'], // TODO: change to '^uibTab' after deprecation removal
	    link: function(scope, elm) {
	      scope.$watch('headingElement', function updateHeadingElement(heading) {
	        if (heading) {
	          elm.html('');
	          elm.append(heading);
	        }
	      });
	    }
	  };
	})

	.directive('uibTabContentTransclude', function() {
	  return {
	    restrict: 'A',
	    require: ['?^uibTabset', '?^tabset'], // TODO: change to '^uibTabset' after deprecation removal
	    link: function(scope, elm, attrs) {
	      var tab = scope.$eval(attrs.uibTabContentTransclude);

	      //Now our tab is ready to be transcluded: both the tab heading area
	      //and the tab content area are loaded.  Transclude 'em both.
	      tab.$transcludeFn(tab.$parent, function(contents) {
	        angular.forEach(contents, function(node) {
	          if (isTabHeading(node)) {
	            //Let tabHeadingTransclude know.
	            tab.headingElement = node;
	          } else {
	            elm.append(node);
	          }
	        });
	      });
	    }
	  };

	  function isTabHeading(node) {
	    return node.tagName && (
	      node.hasAttribute('tab-heading') || // TODO: remove after deprecation removal
	      node.hasAttribute('data-tab-heading') || // TODO: remove after deprecation removal
	      node.hasAttribute('x-tab-heading') || // TODO: remove after deprecation removal
	      node.hasAttribute('uib-tab-heading') ||
	      node.hasAttribute('data-uib-tab-heading') ||
	      node.hasAttribute('x-uib-tab-heading') ||
	      node.tagName.toLowerCase() === 'tab-heading' || // TODO: remove after deprecation removal
	      node.tagName.toLowerCase() === 'data-tab-heading' || // TODO: remove after deprecation removal
	      node.tagName.toLowerCase() === 'x-tab-heading' || // TODO: remove after deprecation removal
	      node.tagName.toLowerCase() === 'uib-tab-heading' ||
	      node.tagName.toLowerCase() === 'data-uib-tab-heading' ||
	      node.tagName.toLowerCase() === 'x-uib-tab-heading'
	    );
	  }
	});

	/* deprecated tabs below */

	angular.module('ui.bootstrap.tabs')

	  .value('$tabsSuppressWarning', false)

	  .controller('TabsetController', ['$scope', '$controller', '$log', '$tabsSuppressWarning', function($scope, $controller, $log, $tabsSuppressWarning) {
	    if (!$tabsSuppressWarning) {
	      $log.warn('TabsetController is now deprecated. Use UibTabsetController instead.');
	    }

	    angular.extend(this, $controller('UibTabsetController', {
	      $scope: $scope
	    }));
	  }])

	  .directive('tabset', ['$log', '$tabsSuppressWarning', function($log, $tabsSuppressWarning) {
	    return {
	      restrict: 'EA',
	      transclude: true,
	      replace: true,
	      scope: {
	        type: '@'
	      },
	      controller: 'TabsetController',
	      templateUrl: 'template/tabs/tabset.html',
	      link: function(scope, element, attrs) {

	        if (!$tabsSuppressWarning) {
	          $log.warn('tabset is now deprecated. Use uib-tabset instead.');
	        }
	        scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
	        scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
	      }
	    };
	  }])

	  .directive('tab', ['$parse', '$log', '$tabsSuppressWarning', function($parse, $log, $tabsSuppressWarning) {
	    return {
	      require: '^tabset',
	      restrict: 'EA',
	      replace: true,
	      templateUrl: 'template/tabs/tab.html',
	      transclude: true,
	      scope: {
	        active: '=?',
	        heading: '@',
	        onSelect: '&select', //This callback is called in contentHeadingTransclude
	        //once it inserts the tab's content into the dom
	        onDeselect: '&deselect'
	      },
	      controller: function() {
	        //Empty controller so other directives can require being 'under' a tab
	      },
	      link: function(scope, elm, attrs, tabsetCtrl, transclude) {
	        if (!$tabsSuppressWarning) {
	          $log.warn('tab is now deprecated. Use uib-tab instead.');
	        }

	        scope.$watch('active', function(active) {
	          if (active) {
	            tabsetCtrl.select(scope);
	          }
	        });

	        scope.disabled = false;
	        if (attrs.disable) {
	          scope.$parent.$watch($parse(attrs.disable), function(value) {
	            scope.disabled = !!value;
	          });
	        }

	        scope.select = function() {
	          if (!scope.disabled) {
	            scope.active = true;
	          }
	        };

	        tabsetCtrl.addTab(scope);
	        scope.$on('$destroy', function() {
	          tabsetCtrl.removeTab(scope);
	        });

	        //We need to transclude later, once the content container is ready.
	        //when this link happens, we're inside a tab heading.
	        scope.$transcludeFn = transclude;
	      }
	    };
	  }])

	  .directive('tabHeadingTransclude', ['$log', '$tabsSuppressWarning', function($log, $tabsSuppressWarning) {
	    return {
	      restrict: 'A',
	      require: '^tab',
	      link: function(scope, elm) {
	        if (!$tabsSuppressWarning) {
	          $log.warn('tab-heading-transclude is now deprecated. Use uib-tab-heading-transclude instead.');
	        }

	        scope.$watch('headingElement', function updateHeadingElement(heading) {
	          if (heading) {
	            elm.html('');
	            elm.append(heading);
	          }
	        });
	      }
	    };
	  }])

	  .directive('tabContentTransclude', ['$log', '$tabsSuppressWarning', function($log, $tabsSuppressWarning) {
	    return {
	      restrict: 'A',
	      require: '^tabset',
	      link: function(scope, elm, attrs) {
	        if (!$tabsSuppressWarning) {
	          $log.warn('tab-content-transclude is now deprecated. Use uib-tab-content-transclude instead.');
	        }

	        var tab = scope.$eval(attrs.tabContentTransclude);

	        //Now our tab is ready to be transcluded: both the tab heading area
	        //and the tab content area are loaded.  Transclude 'em both.
	        tab.$transcludeFn(tab.$parent, function(contents) {
	          angular.forEach(contents, function(node) {
	            if (isTabHeading(node)) {
	              //Let tabHeadingTransclude know.
	              tab.headingElement = node;
	            }
	            else {
	              elm.append(node);
	            }
	          });
	        });
	      }
	    };

	    function isTabHeading(node) {
	      return node.tagName && (
	          node.hasAttribute('tab-heading') ||
	          node.hasAttribute('data-tab-heading') ||
	          node.hasAttribute('x-tab-heading') ||
	          node.tagName.toLowerCase() === 'tab-heading' ||
	          node.tagName.toLowerCase() === 'data-tab-heading' ||
	          node.tagName.toLowerCase() === 'x-tab-heading'
	        );
	    }
	  }]);

	angular.module('ui.bootstrap.timepicker', [])

	.constant('uibTimepickerConfig', {
	  hourStep: 1,
	  minuteStep: 1,
	  showMeridian: true,
	  meridians: null,
	  readonlyInput: false,
	  mousewheel: true,
	  arrowkeys: true,
	  showSpinners: true
	})

	.controller('UibTimepickerController', ['$scope', '$element', '$attrs', '$parse', '$log', '$locale', 'uibTimepickerConfig', function($scope, $element, $attrs, $parse, $log, $locale, timepickerConfig) {
	  var selected = new Date(),
	      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
	      meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

	  $scope.tabindex = angular.isDefined($attrs.tabindex) ? $attrs.tabindex : 0;
	  $element.removeAttr('tabindex');

	  this.init = function(ngModelCtrl_, inputs) {
	    ngModelCtrl = ngModelCtrl_;
	    ngModelCtrl.$render = this.render;

	    ngModelCtrl.$formatters.unshift(function(modelValue) {
	      return modelValue ? new Date(modelValue) : null;
	    });

	    var hoursInputEl = inputs.eq(0),
	        minutesInputEl = inputs.eq(1);

	    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;
	    if (mousewheel) {
	      this.setupMousewheelEvents(hoursInputEl, minutesInputEl);
	    }

	    var arrowkeys = angular.isDefined($attrs.arrowkeys) ? $scope.$parent.$eval($attrs.arrowkeys) : timepickerConfig.arrowkeys;
	    if (arrowkeys) {
	      this.setupArrowkeyEvents(hoursInputEl, minutesInputEl);
	    }

	    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
	    this.setupInputEvents(hoursInputEl, minutesInputEl);
	  };

	  var hourStep = timepickerConfig.hourStep;
	  if ($attrs.hourStep) {
	    $scope.$parent.$watch($parse($attrs.hourStep), function(value) {
	      hourStep = parseInt(value, 10);
	    });
	  }

	  var minuteStep = timepickerConfig.minuteStep;
	  if ($attrs.minuteStep) {
	    $scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
	      minuteStep = parseInt(value, 10);
	    });
	  }

	  var min;
	  $scope.$parent.$watch($parse($attrs.min), function(value) {
	    var dt = new Date(value);
	    min = isNaN(dt) ? undefined : dt;
	  });

	  var max;
	  $scope.$parent.$watch($parse($attrs.max), function(value) {
	    var dt = new Date(value);
	    max = isNaN(dt) ? undefined : dt;
	  });

	  $scope.noIncrementHours = function() {
	    var incrementedSelected = addMinutes(selected, hourStep * 60);
	    return incrementedSelected > max ||
	      (incrementedSelected < selected && incrementedSelected < min);
	  };

	  $scope.noDecrementHours = function() {
	    var decrementedSelected = addMinutes(selected, -hourStep * 60);
	    return decrementedSelected < min ||
	      (decrementedSelected > selected && decrementedSelected > max);
	  };

	  $scope.noIncrementMinutes = function() {
	    var incrementedSelected = addMinutes(selected, minuteStep);
	    return incrementedSelected > max ||
	      (incrementedSelected < selected && incrementedSelected < min);
	  };

	  $scope.noDecrementMinutes = function() {
	    var decrementedSelected = addMinutes(selected, -minuteStep);
	    return decrementedSelected < min ||
	      (decrementedSelected > selected && decrementedSelected > max);
	  };

	  $scope.noToggleMeridian = function() {
	    if (selected.getHours() < 13) {
	      return addMinutes(selected, 12 * 60) > max;
	    } else {
	      return addMinutes(selected, -12 * 60) < min;
	    }
	  };

	  // 12H / 24H mode
	  $scope.showMeridian = timepickerConfig.showMeridian;
	  if ($attrs.showMeridian) {
	    $scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
	      $scope.showMeridian = !!value;

	      if (ngModelCtrl.$error.time) {
	        // Evaluate from template
	        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
	        if (angular.isDefined(hours) && angular.isDefined(minutes)) {
	          selected.setHours(hours);
	          refresh();
	        }
	      } else {
	        updateTemplate();
	      }
	    });
	  }

	  // Get $scope.hours in 24H mode if valid
	  function getHoursFromTemplate() {
	    var hours = parseInt($scope.hours, 10);
	    var valid = $scope.showMeridian ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
	    if (!valid) {
	      return undefined;
	    }

	    if ($scope.showMeridian) {
	      if (hours === 12) {
	        hours = 0;
	      }
	      if ($scope.meridian === meridians[1]) {
	        hours = hours + 12;
	      }
	    }
	    return hours;
	  }

	  function getMinutesFromTemplate() {
	    var minutes = parseInt($scope.minutes, 10);
	    return (minutes >= 0 && minutes < 60) ? minutes : undefined;
	  }

	  function pad(value) {
	    return (angular.isDefined(value) && value.toString().length < 2) ? '0' + value : value.toString();
	  }

	  // Respond on mousewheel spin
	  this.setupMousewheelEvents = function(hoursInputEl, minutesInputEl) {
	    var isScrollingUp = function(e) {
	      if (e.originalEvent) {
	        e = e.originalEvent;
	      }
	      //pick correct delta variable depending on event
	      var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
	      return (e.detail || delta > 0);
	    };

	    hoursInputEl.bind('mousewheel wheel', function(e) {
	      $scope.$apply(isScrollingUp(e) ? $scope.incrementHours() : $scope.decrementHours());
	      e.preventDefault();
	    });

	    minutesInputEl.bind('mousewheel wheel', function(e) {
	      $scope.$apply(isScrollingUp(e) ? $scope.incrementMinutes() : $scope.decrementMinutes());
	      e.preventDefault();
	    });

	  };

	  // Respond on up/down arrowkeys
	  this.setupArrowkeyEvents = function(hoursInputEl, minutesInputEl) {
	    hoursInputEl.bind('keydown', function(e) {
	      if (e.which === 38) { // up
	        e.preventDefault();
	        $scope.incrementHours();
	        $scope.$apply();
	      } else if (e.which === 40) { // down
	        e.preventDefault();
	        $scope.decrementHours();
	        $scope.$apply();
	      }
	    });

	    minutesInputEl.bind('keydown', function(e) {
	      if (e.which === 38) { // up
	        e.preventDefault();
	        $scope.incrementMinutes();
	        $scope.$apply();
	      } else if (e.which === 40) { // down
	        e.preventDefault();
	        $scope.decrementMinutes();
	        $scope.$apply();
	      }
	    });
	  };

	  this.setupInputEvents = function(hoursInputEl, minutesInputEl) {
	    if ($scope.readonlyInput) {
	      $scope.updateHours = angular.noop;
	      $scope.updateMinutes = angular.noop;
	      return;
	    }

	    var invalidate = function(invalidHours, invalidMinutes) {
	      ngModelCtrl.$setViewValue(null);
	      ngModelCtrl.$setValidity('time', false);
	      if (angular.isDefined(invalidHours)) {
	        $scope.invalidHours = invalidHours;
	      }
	      if (angular.isDefined(invalidMinutes)) {
	        $scope.invalidMinutes = invalidMinutes;
	      }
	    };

	    $scope.updateHours = function() {
	      var hours = getHoursFromTemplate(),
	        minutes = getMinutesFromTemplate();

	      if (angular.isDefined(hours) && angular.isDefined(minutes)) {
	        selected.setHours(hours);
	        if (selected < min || selected > max) {
	          invalidate(true);
	        } else {
	          refresh('h');
	        }
	      } else {
	        invalidate(true);
	      }
	    };

	    hoursInputEl.bind('blur', function(e) {
	      if (!$scope.invalidHours && $scope.hours < 10) {
	        $scope.$apply(function() {
	          $scope.hours = pad($scope.hours);
	        });
	      }
	    });

	    $scope.updateMinutes = function() {
	      var minutes = getMinutesFromTemplate(),
	        hours = getHoursFromTemplate();

	      if (angular.isDefined(minutes) && angular.isDefined(hours)) {
	        selected.setMinutes(minutes);
	        if (selected < min || selected > max) {
	          invalidate(undefined, true);
	        } else {
	          refresh('m');
	        }
	      } else {
	        invalidate(undefined, true);
	      }
	    };

	    minutesInputEl.bind('blur', function(e) {
	      if (!$scope.invalidMinutes && $scope.minutes < 10) {
	        $scope.$apply(function() {
	          $scope.minutes = pad($scope.minutes);
	        });
	      }
	    });

	  };

	  this.render = function() {
	    var date = ngModelCtrl.$viewValue;

	    if (isNaN(date)) {
	      ngModelCtrl.$setValidity('time', false);
	      $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
	    } else {
	      if (date) {
	        selected = date;
	      }

	      if (selected < min || selected > max) {
	        ngModelCtrl.$setValidity('time', false);
	        $scope.invalidHours = true;
	        $scope.invalidMinutes = true;
	      } else {
	        makeValid();
	      }
	      updateTemplate();
	    }
	  };

	  // Call internally when we know that model is valid.
	  function refresh(keyboardChange) {
	    makeValid();
	    ngModelCtrl.$setViewValue(new Date(selected));
	    updateTemplate(keyboardChange);
	  }

	  function makeValid() {
	    ngModelCtrl.$setValidity('time', true);
	    $scope.invalidHours = false;
	    $scope.invalidMinutes = false;
	  }

	  function updateTemplate(keyboardChange) {
	    var hours = selected.getHours(), minutes = selected.getMinutes();

	    if ($scope.showMeridian) {
	      hours = (hours === 0 || hours === 12) ? 12 : hours % 12; // Convert 24 to 12 hour system
	    }

	    $scope.hours = keyboardChange === 'h' ? hours : pad(hours);
	    if (keyboardChange !== 'm') {
	      $scope.minutes = pad(minutes);
	    }
	    $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
	  }

	  function addMinutes(date, minutes) {
	    var dt = new Date(date.getTime() + minutes * 60000);
	    var newDate = new Date(date);
	    newDate.setHours(dt.getHours(), dt.getMinutes());
	    return newDate;
	  }

	  function addMinutesToSelected(minutes) {
	    selected = addMinutes(selected, minutes);
	    refresh();
	  }

	  $scope.showSpinners = angular.isDefined($attrs.showSpinners) ?
	    $scope.$parent.$eval($attrs.showSpinners) : timepickerConfig.showSpinners;

	  $scope.incrementHours = function() {
	    if (!$scope.noIncrementHours()) {
	      addMinutesToSelected(hourStep * 60);
	    }
	  };

	  $scope.decrementHours = function() {
	    if (!$scope.noDecrementHours()) {
	      addMinutesToSelected(-hourStep * 60);
	    }
	  };

	  $scope.incrementMinutes = function() {
	    if (!$scope.noIncrementMinutes()) {
	      addMinutesToSelected(minuteStep);
	    }
	  };

	  $scope.decrementMinutes = function() {
	    if (!$scope.noDecrementMinutes()) {
	      addMinutesToSelected(-minuteStep);
	    }
	  };

	  $scope.toggleMeridian = function() {
	    if (!$scope.noToggleMeridian()) {
	      addMinutesToSelected(12 * 60 * (selected.getHours() < 12 ? 1 : -1));
	    }
	  };
	}])

	.directive('uibTimepicker', function() {
	  return {
	    restrict: 'EA',
	    require: ['uibTimepicker', '?^ngModel'],
	    controller: 'UibTimepickerController',
	    controllerAs: 'timepicker',
	    replace: true,
	    scope: {},
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/timepicker/timepicker.html';
	    },
	    link: function(scope, element, attrs, ctrls) {
	      var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (ngModelCtrl) {
	        timepickerCtrl.init(ngModelCtrl, element.find('input'));
	      }
	    }
	  };
	});

	/* Deprecated timepicker below */

	angular.module('ui.bootstrap.timepicker')

	.value('$timepickerSuppressWarning', false)

	.controller('TimepickerController', ['$scope', '$element', '$attrs', '$controller', '$log', '$timepickerSuppressWarning', function($scope, $element, $attrs, $controller, $log, $timepickerSuppressWarning) {
	  if (!$timepickerSuppressWarning) {
	    $log.warn('TimepickerController is now deprecated. Use UibTimepickerController instead.');
	  }

	  angular.extend(this, $controller('UibTimepickerController', {
	    $scope: $scope,
	    $element: $element,
	    $attrs: $attrs
	  }));
	}])

	.directive('timepicker', ['$log', '$timepickerSuppressWarning', function($log, $timepickerSuppressWarning) {
	  return {
	    restrict: 'EA',
	    require: ['timepicker', '?^ngModel'],
	    controller: 'TimepickerController',
	    controllerAs: 'timepicker',
	    replace: true,
	    scope: {},
	    templateUrl: function(element, attrs) {
	      return attrs.templateUrl || 'template/timepicker/timepicker.html';
	    },
	    link: function(scope, element, attrs, ctrls) {
	      if (!$timepickerSuppressWarning) {
	        $log.warn('timepicker is now deprecated. Use uib-timepicker instead.');
	      }
	      var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (ngModelCtrl) {
	        timepickerCtrl.init(ngModelCtrl, element.find('input'));
	      }
	    }
	  };
	}]);

	angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position'])

	/**
	 * A helper service that can parse typeahead's syntax (string provided by users)
	 * Extracted to a separate service for ease of unit testing
	 */
	  .factory('uibTypeaheadParser', ['$parse', function($parse) {
	    //                      00000111000000000000022200000000000000003333333333333330000000000044000
	    var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
	    return {
	      parse: function(input) {
	        var match = input.match(TYPEAHEAD_REGEXP);
	        if (!match) {
	          throw new Error(
	            'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
	              ' but got "' + input + '".');
	        }

	        return {
	          itemName: match[3],
	          source: $parse(match[4]),
	          viewMapper: $parse(match[2] || match[1]),
	          modelMapper: $parse(match[1])
	        };
	      }
	    };
	  }])

	  .controller('UibTypeaheadController', ['$scope', '$element', '$attrs', '$compile', '$parse', '$q', '$timeout', '$document', '$window', '$rootScope', '$uibPosition', 'uibTypeaheadParser',
	    function(originalScope, element, attrs, $compile, $parse, $q, $timeout, $document, $window, $rootScope, $position, typeaheadParser) {
	    var HOT_KEYS = [9, 13, 27, 38, 40];
	    var eventDebounceTime = 200;
	    var modelCtrl, ngModelOptions;
	    //SUPPORTED ATTRIBUTES (OPTIONS)

	    //minimal no of characters that needs to be entered before typeahead kicks-in
	    var minLength = originalScope.$eval(attrs.typeaheadMinLength);
	    if (!minLength && minLength !== 0) {
	      minLength = 1;
	    }

	    //minimal wait time after last character typed before typeahead kicks-in
	    var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

	    //should it restrict model values to the ones selected from the popup only?
	    var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

	    //binding to a variable that indicates if matches are being retrieved asynchronously
	    var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

	    //a callback executed when a match is selected
	    var onSelectCallback = $parse(attrs.typeaheadOnSelect);

	    //should it select highlighted popup value when losing focus?
	    var isSelectOnBlur = angular.isDefined(attrs.typeaheadSelectOnBlur) ? originalScope.$eval(attrs.typeaheadSelectOnBlur) : false;

	    //binding to a variable that indicates if there were no results after the query is completed
	    var isNoResultsSetter = $parse(attrs.typeaheadNoResults).assign || angular.noop;

	    var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

	    var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

	    var appendToElementId =  attrs.typeaheadAppendToElementId || false;

	    var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

	    //If input matches an item of the list exactly, select it automatically
	    var selectOnExact = attrs.typeaheadSelectOnExact ? originalScope.$eval(attrs.typeaheadSelectOnExact) : false;

	    //INTERNAL VARIABLES

	    //model setter executed upon match selection
	    var parsedModel = $parse(attrs.ngModel);
	    var invokeModelSetter = $parse(attrs.ngModel + '($$$p)');
	    var $setModelValue = function(scope, newValue) {
	      if (angular.isFunction(parsedModel(originalScope)) &&
	        ngModelOptions && ngModelOptions.$options && ngModelOptions.$options.getterSetter) {
	        return invokeModelSetter(scope, {$$$p: newValue});
	      } else {
	        return parsedModel.assign(scope, newValue);
	      }
	    };

	    //expressions used by typeahead
	    var parserResult = typeaheadParser.parse(attrs.uibTypeahead);

	    var hasFocus;

	    //Used to avoid bug in iOS webview where iOS keyboard does not fire
	    //mousedown & mouseup events
	    //Issue #3699
	    var selected;

	    //create a child scope for the typeahead directive so we are not polluting original scope
	    //with typeahead-specific data (matches, query etc.)
	    var scope = originalScope.$new();
	    var offDestroy = originalScope.$on('$destroy', function() {
	      scope.$destroy();
	    });
	    scope.$on('$destroy', offDestroy);

	    // WAI-ARIA
	    var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
	    element.attr({
	      'aria-autocomplete': 'list',
	      'aria-expanded': false,
	      'aria-owns': popupId
	    });

	    //pop-up element used to display matches
	    var popUpEl = angular.element('<div uib-typeahead-popup></div>');
	    popUpEl.attr({
	      id: popupId,
	      matches: 'matches',
	      active: 'activeIdx',
	      select: 'select(activeIdx)',
	      'move-in-progress': 'moveInProgress',
	      query: 'query',
	      position: 'position'
	    });
	    //custom item template
	    if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
	      popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
	    }

	    if (angular.isDefined(attrs.typeaheadPopupTemplateUrl)) {
	      popUpEl.attr('popup-template-url', attrs.typeaheadPopupTemplateUrl);
	    }

	    var resetMatches = function() {
	      scope.matches = [];
	      scope.activeIdx = -1;
	      element.attr('aria-expanded', false);
	    };

	    var getMatchId = function(index) {
	      return popupId + '-option-' + index;
	    };

	    // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
	    // This attribute is added or removed automatically when the `activeIdx` changes.
	    scope.$watch('activeIdx', function(index) {
	      if (index < 0) {
	        element.removeAttr('aria-activedescendant');
	      } else {
	        element.attr('aria-activedescendant', getMatchId(index));
	      }
	    });

	    var inputIsExactMatch = function(inputValue, index) {
	      if (scope.matches.length > index && inputValue) {
	        return inputValue.toUpperCase() === scope.matches[index].label.toUpperCase();
	      }

	      return false;
	    };

	    var getMatchesAsync = function(inputValue) {
	      var locals = {$viewValue: inputValue};
	      isLoadingSetter(originalScope, true);
	      isNoResultsSetter(originalScope, false);
	      $q.when(parserResult.source(originalScope, locals)).then(function(matches) {
	        //it might happen that several async queries were in progress if a user were typing fast
	        //but we are interested only in responses that correspond to the current view value
	        var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
	        if (onCurrentRequest && hasFocus) {
	          if (matches && matches.length > 0) {
	            scope.activeIdx = focusFirst ? 0 : -1;
	            isNoResultsSetter(originalScope, false);
	            scope.matches.length = 0;

	            //transform labels
	            for (var i = 0; i < matches.length; i++) {
	              locals[parserResult.itemName] = matches[i];
	              scope.matches.push({
	                id: getMatchId(i),
	                label: parserResult.viewMapper(scope, locals),
	                model: matches[i]
	              });
	            }

	            scope.query = inputValue;
	            //position pop-up with matches - we need to re-calculate its position each time we are opening a window
	            //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
	            //due to other elements being rendered
	            recalculatePosition();

	            element.attr('aria-expanded', true);

	            //Select the single remaining option if user input matches
	            if (selectOnExact && scope.matches.length === 1 && inputIsExactMatch(inputValue, 0)) {
	              scope.select(0);
	            }
	          } else {
	            resetMatches();
	            isNoResultsSetter(originalScope, true);
	          }
	        }
	        if (onCurrentRequest) {
	          isLoadingSetter(originalScope, false);
	        }
	      }, function() {
	        resetMatches();
	        isLoadingSetter(originalScope, false);
	        isNoResultsSetter(originalScope, true);
	      });
	    };

	    // bind events only if appendToBody params exist - performance feature
	    if (appendToBody) {
	      angular.element($window).bind('resize', fireRecalculating);
	      $document.find('body').bind('scroll', fireRecalculating);
	    }

	    // Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
	    var timeoutEventPromise;

	    // Default progress type
	    scope.moveInProgress = false;

	    function fireRecalculating() {
	      if (!scope.moveInProgress) {
	        scope.moveInProgress = true;
	        scope.$digest();
	      }

	      // Cancel previous timeout
	      if (timeoutEventPromise) {
	        $timeout.cancel(timeoutEventPromise);
	      }

	      // Debounced executing recalculate after events fired
	      timeoutEventPromise = $timeout(function() {
	        // if popup is visible
	        if (scope.matches.length) {
	          recalculatePosition();
	        }

	        scope.moveInProgress = false;
	      }, eventDebounceTime);
	    }

	    // recalculate actual position and set new values to scope
	    // after digest loop is popup in right position
	    function recalculatePosition() {
	      scope.position = appendToBody ? $position.offset(element) : $position.position(element);
	      scope.position.top += element.prop('offsetHeight');
	    }

	    //we need to propagate user's query so we can higlight matches
	    scope.query = undefined;

	    //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
	    var timeoutPromise;

	    var scheduleSearchWithTimeout = function(inputValue) {
	      timeoutPromise = $timeout(function() {
	        getMatchesAsync(inputValue);
	      }, waitTime);
	    };

	    var cancelPreviousTimeout = function() {
	      if (timeoutPromise) {
	        $timeout.cancel(timeoutPromise);
	      }
	    };

	    resetMatches();

	    scope.select = function(activeIdx) {
	      //called from within the $digest() cycle
	      var locals = {};
	      var model, item;

	      selected = true;
	      locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
	      model = parserResult.modelMapper(originalScope, locals);
	      $setModelValue(originalScope, model);
	      modelCtrl.$setValidity('editable', true);
	      modelCtrl.$setValidity('parse', true);

	      onSelectCallback(originalScope, {
	        $item: item,
	        $model: model,
	        $label: parserResult.viewMapper(originalScope, locals)
	      });

	      resetMatches();

	      //return focus to the input element if a match was selected via a mouse click event
	      // use timeout to avoid $rootScope:inprog error
	      if (scope.$eval(attrs.typeaheadFocusOnSelect) !== false) {
	        $timeout(function() { element[0].focus(); }, 0, false);
	      }
	    };

	    //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
	    element.bind('keydown', function(evt) {
	      //typeahead is open and an "interesting" key was pressed
	      if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
	        return;
	      }

	      // if there's nothing selected (i.e. focusFirst) and enter or tab is hit, clear the results
	      if (scope.activeIdx === -1 && (evt.which === 9 || evt.which === 13)) {
	        resetMatches();
	        scope.$digest();
	        return;
	      }

	      evt.preventDefault();

	      if (evt.which === 40) {
	        scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
	        scope.$digest();
	      } else if (evt.which === 38) {
	        scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
	        scope.$digest();
	      } else if (evt.which === 13 || evt.which === 9) {
	        scope.$apply(function () {
	          scope.select(scope.activeIdx);
	        });
	      } else if (evt.which === 27) {
	        evt.stopPropagation();

	        resetMatches();
	        scope.$digest();
	      }
	    });

	    element.bind('blur', function() {
	      if (isSelectOnBlur && scope.matches.length && scope.activeIdx !== -1 && !selected) {
	        selected = true;
	        scope.$apply(function() {
	          scope.select(scope.activeIdx);
	        });
	      }
	      hasFocus = false;
	      selected = false;
	    });

	    // Keep reference to click handler to unbind it.
	    var dismissClickHandler = function(evt) {
	      // Issue #3973
	      // Firefox treats right click as a click on document
	      if (element[0] !== evt.target && evt.which !== 3 && scope.matches.length !== 0) {
	        resetMatches();
	        if (!$rootScope.$$phase) {
	          scope.$digest();
	        }
	      }
	    };

	    $document.bind('click', dismissClickHandler);

	    originalScope.$on('$destroy', function() {
	      $document.unbind('click', dismissClickHandler);
	      if (appendToBody || appendToElementId) {
	        $popup.remove();
	      }

	      if (appendToBody) {
	        angular.element($window).unbind('resize', fireRecalculating);
	        $document.find('body').unbind('scroll', fireRecalculating);
	      }
	      // Prevent jQuery cache memory leak
	      popUpEl.remove();
	    });

	    var $popup = $compile(popUpEl)(scope);

	    if (appendToBody) {
	      $document.find('body').append($popup);
	    } else if (appendToElementId !== false) {
	      angular.element($document[0].getElementById(appendToElementId)).append($popup);
	    } else {
	      element.after($popup);
	    }

	    this.init = function(_modelCtrl, _ngModelOptions) {
	      modelCtrl = _modelCtrl;
	      ngModelOptions = _ngModelOptions;

	      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
	      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
	      modelCtrl.$parsers.unshift(function(inputValue) {
	        hasFocus = true;

	        if (minLength === 0 || inputValue && inputValue.length >= minLength) {
	          if (waitTime > 0) {
	            cancelPreviousTimeout();
	            scheduleSearchWithTimeout(inputValue);
	          } else {
	            getMatchesAsync(inputValue);
	          }
	        } else {
	          isLoadingSetter(originalScope, false);
	          cancelPreviousTimeout();
	          resetMatches();
	        }

	        if (isEditable) {
	          return inputValue;
	        } else {
	          if (!inputValue) {
	            // Reset in case user had typed something previously.
	            modelCtrl.$setValidity('editable', true);
	            return null;
	          } else {
	            modelCtrl.$setValidity('editable', false);
	            return undefined;
	          }
	        }
	      });

	      modelCtrl.$formatters.push(function(modelValue) {
	        var candidateViewValue, emptyViewValue;
	        var locals = {};

	        // The validity may be set to false via $parsers (see above) if
	        // the model is restricted to selected values. If the model
	        // is set manually it is considered to be valid.
	        if (!isEditable) {
	          modelCtrl.$setValidity('editable', true);
	        }

	        if (inputFormatter) {
	          locals.$model = modelValue;
	          return inputFormatter(originalScope, locals);
	        } else {
	          //it might happen that we don't have enough info to properly render input value
	          //we need to check for this situation and simply return model value if we can't apply custom formatting
	          locals[parserResult.itemName] = modelValue;
	          candidateViewValue = parserResult.viewMapper(originalScope, locals);
	          locals[parserResult.itemName] = undefined;
	          emptyViewValue = parserResult.viewMapper(originalScope, locals);

	          return candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue;
	        }
	      });
	    };
	  }])

	  .directive('uibTypeahead', function() {
	    return {
	      controller: 'UibTypeaheadController',
	      require: ['ngModel', '^?ngModelOptions', 'uibTypeahead'],
	      link: function(originalScope, element, attrs, ctrls) {
	        ctrls[2].init(ctrls[0], ctrls[1]);
	      }
	    };
	  })

	  .directive('uibTypeaheadPopup', function() {
	    return {
	      scope: {
	        matches: '=',
	        query: '=',
	        active: '=',
	        position: '&',
	        moveInProgress: '=',
	        select: '&'
	      },
	      replace: true,
	      templateUrl: function(element, attrs) {
	        return attrs.popupTemplateUrl || 'template/typeahead/typeahead-popup.html';
	      },
	      link: function(scope, element, attrs) {
	        scope.templateUrl = attrs.templateUrl;

	        scope.isOpen = function() {
	          return scope.matches.length > 0;
	        };

	        scope.isActive = function(matchIdx) {
	          return scope.active == matchIdx;
	        };

	        scope.selectActive = function(matchIdx) {
	          scope.active = matchIdx;
	        };

	        scope.selectMatch = function(activeIdx) {
	          scope.select({activeIdx:activeIdx});
	        };
	      }
	    };
	  })

	  .directive('uibTypeaheadMatch', ['$templateRequest', '$compile', '$parse', function($templateRequest, $compile, $parse) {
	    return {
	      scope: {
	        index: '=',
	        match: '=',
	        query: '='
	      },
	      link:function(scope, element, attrs) {
	        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
	        $templateRequest(tplUrl).then(function(tplContent) {
	          $compile(tplContent.trim())(scope, function(clonedElement) {
	            element.replaceWith(clonedElement);
	          });
	        });
	      }
	    };
	  }])

	  .filter('uibTypeaheadHighlight', ['$sce', '$injector', '$log', function($sce, $injector, $log) {
	    var isSanitizePresent;
	    isSanitizePresent = $injector.has('$sanitize');

	    function escapeRegexp(queryToEscape) {
	      // Regex: capture the whole query string and replace it with the string that will be used to match
	      // the results, for example if the capture is "a" the result will be \a
	      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	    }

	    function containsHtml(matchItem) {
	      return /<.*>/g.test(matchItem);
	    }

	    return function(matchItem, query) {
	      if (!isSanitizePresent && containsHtml(matchItem)) {
	        $log.warn('Unsafe use of typeahead please use ngSanitize'); // Warn the user about the danger
	      }
	      matchItem = query? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem; // Replaces the capture string with a the same string inside of a "strong" tag
	      if (!isSanitizePresent) {
	        matchItem = $sce.trustAsHtml(matchItem); // If $sanitize is not present we pack the string in a $sce object for the ng-bind-html directive
	      }
	      return matchItem;
	    };
	  }]);

	/* Deprecated typeahead below */
	  
	angular.module('ui.bootstrap.typeahead')
	  .value('$typeaheadSuppressWarning', false)
	  .service('typeaheadParser', ['$parse', 'uibTypeaheadParser', '$log', '$typeaheadSuppressWarning', function($parse, uibTypeaheadParser, $log, $typeaheadSuppressWarning) {
	    if (!$typeaheadSuppressWarning) {
	      $log.warn('typeaheadParser is now deprecated. Use uibTypeaheadParser instead.');
	    }

	    return uibTypeaheadParser;
	  }])

	  .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$window', '$rootScope', '$uibPosition', 'typeaheadParser', '$log', '$typeaheadSuppressWarning',
	    function($compile, $parse, $q, $timeout, $document, $window, $rootScope, $position, typeaheadParser, $log, $typeaheadSuppressWarning) {
	    var HOT_KEYS = [9, 13, 27, 38, 40];
	    var eventDebounceTime = 200;
	    return {
	      require: ['ngModel', '^?ngModelOptions'],
	      link: function(originalScope, element, attrs, ctrls) {
	        if (!$typeaheadSuppressWarning) {
	          $log.warn('typeahead is now deprecated. Use uib-typeahead instead.');
	        }
	        var modelCtrl = ctrls[0];
	        var ngModelOptions = ctrls[1];
	        //SUPPORTED ATTRIBUTES (OPTIONS)

	        //minimal no of characters that needs to be entered before typeahead kicks-in
	        var minLength = originalScope.$eval(attrs.typeaheadMinLength);
	        if (!minLength && minLength !== 0) {
	          minLength = 1;
	        }

	        //minimal wait time after last character typed before typeahead kicks-in
	        var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

	        //should it restrict model values to the ones selected from the popup only?
	        var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

	        //binding to a variable that indicates if matches are being retrieved asynchronously
	        var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

	        //a callback executed when a match is selected
	        var onSelectCallback = $parse(attrs.typeaheadOnSelect);

	        //should it select highlighted popup value when losing focus?
	        var isSelectOnBlur = angular.isDefined(attrs.typeaheadSelectOnBlur) ? originalScope.$eval(attrs.typeaheadSelectOnBlur) : false;

	        //binding to a variable that indicates if there were no results after the query is completed
	        var isNoResultsSetter = $parse(attrs.typeaheadNoResults).assign || angular.noop;

	        var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

	        var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

	        var appendToElementId =  attrs.typeaheadAppendToElementId || false;

	        var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

	        //If input matches an item of the list exactly, select it automatically
	        var selectOnExact = attrs.typeaheadSelectOnExact ? originalScope.$eval(attrs.typeaheadSelectOnExact) : false;

	        //INTERNAL VARIABLES

	        //model setter executed upon match selection
	        var parsedModel = $parse(attrs.ngModel);
	        var invokeModelSetter = $parse(attrs.ngModel + '($$$p)');
	        var $setModelValue = function(scope, newValue) {
	          if (angular.isFunction(parsedModel(originalScope)) &&
	            ngModelOptions && ngModelOptions.$options && ngModelOptions.$options.getterSetter) {
	            return invokeModelSetter(scope, {$$$p: newValue});
	          } else {
	            return parsedModel.assign(scope, newValue);
	          }
	        };

	        //expressions used by typeahead
	        var parserResult = typeaheadParser.parse(attrs.typeahead);

	        var hasFocus;

	        //Used to avoid bug in iOS webview where iOS keyboard does not fire
	        //mousedown & mouseup events
	        //Issue #3699
	        var selected;

	        //create a child scope for the typeahead directive so we are not polluting original scope
	        //with typeahead-specific data (matches, query etc.)
	        var scope = originalScope.$new();
	        var offDestroy = originalScope.$on('$destroy', function() {
				    scope.$destroy();
	        });
	        scope.$on('$destroy', offDestroy);

	        // WAI-ARIA
	        var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
	        element.attr({
	          'aria-autocomplete': 'list',
	          'aria-expanded': false,
	          'aria-owns': popupId
	        });

	        //pop-up element used to display matches
	        var popUpEl = angular.element('<div typeahead-popup></div>');
	        popUpEl.attr({
	          id: popupId,
	          matches: 'matches',
	          active: 'activeIdx',
	          select: 'select(activeIdx)',
	          'move-in-progress': 'moveInProgress',
	          query: 'query',
	          position: 'position'
	        });
	        //custom item template
	        if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
	          popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
	        }

	        if (angular.isDefined(attrs.typeaheadPopupTemplateUrl)) {
	          popUpEl.attr('popup-template-url', attrs.typeaheadPopupTemplateUrl);
	        }

	        var resetMatches = function() {
	          scope.matches = [];
	          scope.activeIdx = -1;
	          element.attr('aria-expanded', false);
	        };

	        var getMatchId = function(index) {
	          return popupId + '-option-' + index;
	        };

	        // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
	        // This attribute is added or removed automatically when the `activeIdx` changes.
	        scope.$watch('activeIdx', function(index) {
	          if (index < 0) {
	            element.removeAttr('aria-activedescendant');
	          } else {
	            element.attr('aria-activedescendant', getMatchId(index));
	          }
	        });

	        var inputIsExactMatch = function(inputValue, index) {
	          if (scope.matches.length > index && inputValue) {
	            return inputValue.toUpperCase() === scope.matches[index].label.toUpperCase();
	          }

	          return false;
	        };

	        var getMatchesAsync = function(inputValue) {
	          var locals = {$viewValue: inputValue};
	          isLoadingSetter(originalScope, true);
	          isNoResultsSetter(originalScope, false);
	          $q.when(parserResult.source(originalScope, locals)).then(function(matches) {
	            //it might happen that several async queries were in progress if a user were typing fast
	            //but we are interested only in responses that correspond to the current view value
	            var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
	            if (onCurrentRequest && hasFocus) {
	              if (matches && matches.length > 0) {
	                scope.activeIdx = focusFirst ? 0 : -1;
	                isNoResultsSetter(originalScope, false);
	                scope.matches.length = 0;

	                //transform labels
	                for (var i = 0; i < matches.length; i++) {
	                  locals[parserResult.itemName] = matches[i];
	                  scope.matches.push({
	                    id: getMatchId(i),
	                    label: parserResult.viewMapper(scope, locals),
	                    model: matches[i]
	                  });
	                }

	                scope.query = inputValue;
	                //position pop-up with matches - we need to re-calculate its position each time we are opening a window
	                //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
	                //due to other elements being rendered
	                recalculatePosition();

	                element.attr('aria-expanded', true);

	                //Select the single remaining option if user input matches
	                if (selectOnExact && scope.matches.length === 1 && inputIsExactMatch(inputValue, 0)) {
	                  scope.select(0);
	                }
	              } else {
	                resetMatches();
	                isNoResultsSetter(originalScope, true);
	              }
	            }
	            if (onCurrentRequest) {
	              isLoadingSetter(originalScope, false);
	            }
	          }, function() {
	            resetMatches();
	            isLoadingSetter(originalScope, false);
	            isNoResultsSetter(originalScope, true);
	          });
	        };

	        // bind events only if appendToBody params exist - performance feature
	        if (appendToBody) {
	          angular.element($window).bind('resize', fireRecalculating);
	          $document.find('body').bind('scroll', fireRecalculating);
	        }

	        // Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
	        var timeoutEventPromise;

	        // Default progress type
	        scope.moveInProgress = false;

	        function fireRecalculating() {
	          if (!scope.moveInProgress) {
	            scope.moveInProgress = true;
	            scope.$digest();
	          }

	          // Cancel previous timeout
	          if (timeoutEventPromise) {
	            $timeout.cancel(timeoutEventPromise);
	          }

	          // Debounced executing recalculate after events fired
	          timeoutEventPromise = $timeout(function() {
	            // if popup is visible
	            if (scope.matches.length) {
	              recalculatePosition();
	            }

	            scope.moveInProgress = false;
	          }, eventDebounceTime);
	        }

	        // recalculate actual position and set new values to scope
	        // after digest loop is popup in right position
	        function recalculatePosition() {
	          scope.position = appendToBody ? $position.offset(element) : $position.position(element);
	          scope.position.top += element.prop('offsetHeight');
	        }

	        resetMatches();

	        //we need to propagate user's query so we can higlight matches
	        scope.query = undefined;

	        //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
	        var timeoutPromise;

	        var scheduleSearchWithTimeout = function(inputValue) {
	          timeoutPromise = $timeout(function() {
	            getMatchesAsync(inputValue);
	          }, waitTime);
	        };

	        var cancelPreviousTimeout = function() {
	          if (timeoutPromise) {
	            $timeout.cancel(timeoutPromise);
	          }
	        };

	        //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
	        //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
	        modelCtrl.$parsers.unshift(function(inputValue) {
	          hasFocus = true;

	          if (minLength === 0 || inputValue && inputValue.length >= minLength) {
	            if (waitTime > 0) {
	              cancelPreviousTimeout();
	              scheduleSearchWithTimeout(inputValue);
	            } else {
	              getMatchesAsync(inputValue);
	            }
	          } else {
	            isLoadingSetter(originalScope, false);
	            cancelPreviousTimeout();
	            resetMatches();
	          }

	          if (isEditable) {
	            return inputValue;
	          } else {
	            if (!inputValue) {
	              // Reset in case user had typed something previously.
	              modelCtrl.$setValidity('editable', true);
	              return null;
	            } else {
	              modelCtrl.$setValidity('editable', false);
	              return undefined;
	            }
	          }
	        });

	        modelCtrl.$formatters.push(function(modelValue) {
	          var candidateViewValue, emptyViewValue;
	          var locals = {};

	          // The validity may be set to false via $parsers (see above) if
	          // the model is restricted to selected values. If the model
	          // is set manually it is considered to be valid.
	          if (!isEditable) {
	            modelCtrl.$setValidity('editable', true);
	          }

	          if (inputFormatter) {
	            locals.$model = modelValue;
	            return inputFormatter(originalScope, locals);
	          } else {
	            //it might happen that we don't have enough info to properly render input value
	            //we need to check for this situation and simply return model value if we can't apply custom formatting
	            locals[parserResult.itemName] = modelValue;
	            candidateViewValue = parserResult.viewMapper(originalScope, locals);
	            locals[parserResult.itemName] = undefined;
	            emptyViewValue = parserResult.viewMapper(originalScope, locals);

	            return candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue;
	          }
	        });

	        scope.select = function(activeIdx) {
	          //called from within the $digest() cycle
	          var locals = {};
	          var model, item;

	          selected = true;
	          locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
	          model = parserResult.modelMapper(originalScope, locals);
	          $setModelValue(originalScope, model);
	          modelCtrl.$setValidity('editable', true);
	          modelCtrl.$setValidity('parse', true);

	          onSelectCallback(originalScope, {
	            $item: item,
	            $model: model,
	            $label: parserResult.viewMapper(originalScope, locals)
	          });

	          resetMatches();

	          //return focus to the input element if a match was selected via a mouse click event
	          // use timeout to avoid $rootScope:inprog error
	          if (scope.$eval(attrs.typeaheadFocusOnSelect) !== false) {
	            $timeout(function() { element[0].focus(); }, 0, false);
	          }
	        };

	        //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
	        element.bind('keydown', function(evt) {
	          //typeahead is open and an "interesting" key was pressed
	          if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
	            return;
	          }

	          // if there's nothing selected (i.e. focusFirst) and enter or tab is hit, clear the results
	          if (scope.activeIdx === -1 && (evt.which === 9 || evt.which === 13)) {
	            resetMatches();
	            scope.$digest();
	            return;
	          }

	          evt.preventDefault();

	          if (evt.which === 40) {
	            scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
	            scope.$digest();
	          } else if (evt.which === 38) {
	            scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
	            scope.$digest();
	          } else if (evt.which === 13 || evt.which === 9) {
	            scope.$apply(function () {
	              scope.select(scope.activeIdx);
	            });
	          } else if (evt.which === 27) {
	            evt.stopPropagation();

	            resetMatches();
	            scope.$digest();
	          }
	        });

	        element.bind('blur', function() {
	          if (isSelectOnBlur && scope.matches.length && scope.activeIdx !== -1 && !selected) {
	            selected = true;
	            scope.$apply(function() {
	              scope.select(scope.activeIdx);
	            });
	          }
	          hasFocus = false;
	          selected = false;
	        });

	        // Keep reference to click handler to unbind it.
	        var dismissClickHandler = function(evt) {
	          // Issue #3973
	          // Firefox treats right click as a click on document
	          if (element[0] !== evt.target && evt.which !== 3 && scope.matches.length !== 0) {
	            resetMatches();
	            if (!$rootScope.$$phase) {
	              scope.$digest();
	            }
	          }
	        };

	        $document.bind('click', dismissClickHandler);

	        originalScope.$on('$destroy', function() {
	          $document.unbind('click', dismissClickHandler);
	          if (appendToBody || appendToElementId) {
	            $popup.remove();
	          }

	          if (appendToBody) {
	            angular.element($window).unbind('resize', fireRecalculating);
	            $document.find('body').unbind('scroll', fireRecalculating);
	          }
	          // Prevent jQuery cache memory leak
	          popUpEl.remove();
	        });

	        var $popup = $compile(popUpEl)(scope);

	        if (appendToBody) {
	          $document.find('body').append($popup);
	        } else if (appendToElementId !== false) {
	          angular.element($document[0].getElementById(appendToElementId)).append($popup);
	        } else {
	          element.after($popup);
	        }
	      }
	    };
	  }])
	  
	  .directive('typeaheadPopup', ['$typeaheadSuppressWarning', '$log', function($typeaheadSuppressWarning, $log) {
	    return {
	      scope: {
	        matches: '=',
	        query: '=',
	        active: '=',
	        position: '&',
	        moveInProgress: '=',
	        select: '&'
	      },
	      replace: true,
	      templateUrl: function(element, attrs) {
	        return attrs.popupTemplateUrl || 'template/typeahead/typeahead-popup.html';
	      },
	      link: function(scope, element, attrs) {
	        
	        if (!$typeaheadSuppressWarning) {
	          $log.warn('typeahead-popup is now deprecated. Use uib-typeahead-popup instead.');
	        }
	        scope.templateUrl = attrs.templateUrl;

	        scope.isOpen = function() {
	          return scope.matches.length > 0;
	        };

	        scope.isActive = function(matchIdx) {
	          return scope.active == matchIdx;
	        };

	        scope.selectActive = function(matchIdx) {
	          scope.active = matchIdx;
	        };

	        scope.selectMatch = function(activeIdx) {
	          scope.select({activeIdx:activeIdx});
	        };
	      }
	    };
	  }])
	  
	  .directive('typeaheadMatch', ['$templateRequest', '$compile', '$parse', '$typeaheadSuppressWarning', '$log', function($templateRequest, $compile, $parse, $typeaheadSuppressWarning, $log) {
	    return {
	      restrict: 'EA',
	      scope: {
	        index: '=',
	        match: '=',
	        query: '='
	      },
	      link:function(scope, element, attrs) {
	        if (!$typeaheadSuppressWarning) {
	          $log.warn('typeahead-match is now deprecated. Use uib-typeahead-match instead.');
	        }

	        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
	        $templateRequest(tplUrl).then(function(tplContent) {
	          $compile(tplContent.trim())(scope, function(clonedElement) {
	            element.replaceWith(clonedElement);
	          });
	        });
	      }
	    };
	  }])
	  
	  .filter('typeaheadHighlight', ['$sce', '$injector', '$log', '$typeaheadSuppressWarning', function($sce, $injector, $log, $typeaheadSuppressWarning) {
	    var isSanitizePresent;
	    isSanitizePresent = $injector.has('$sanitize');

	    function escapeRegexp(queryToEscape) {
	      // Regex: capture the whole query string and replace it with the string that will be used to match
	      // the results, for example if the capture is "a" the result will be \a
	      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	    }

	    function containsHtml(matchItem) {
	      return /<.*>/g.test(matchItem);
	    }

	    return function(matchItem, query) {
	      if (!$typeaheadSuppressWarning) {
	        $log.warn('typeaheadHighlight is now deprecated. Use uibTypeaheadHighlight instead.');
	      }

	      if (!isSanitizePresent && containsHtml(matchItem)) {
	        $log.warn('Unsafe use of typeahead please use ngSanitize'); // Warn the user about the danger
	      }

	      matchItem = query? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem; // Replaces the capture string with a the same string inside of a "strong" tag
	      if (!isSanitizePresent) {
	        matchItem = $sce.trustAsHtml(matchItem); // If $sanitize is not present we pack the string in a $sce object for the ng-bind-html directive
	      }

	      return matchItem;
	    };
	  }]);

	angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/accordion/accordion-group.html",
	    "<div class=\"panel {{panelClass || 'panel-default'}}\">\n" +
	    "  <div class=\"panel-heading\" ng-keypress=\"toggleOpen($event)\">\n" +
	    "    <h4 class=\"panel-title\">\n" +
	    "      <a href tabindex=\"0\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\" uib-accordion-transclude=\"heading\"><span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
	    "    </h4>\n" +
	    "  </div>\n" +
	    "  <div class=\"panel-collapse collapse\" uib-collapse=\"!isOpen\">\n" +
	    "	  <div class=\"panel-body\" ng-transclude></div>\n" +
	    "  </div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/accordion/accordion.html",
	    "<div class=\"panel-group\" ng-transclude></div>");
	}]);

	angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/alert/alert.html",
	    "<div class=\"alert\" ng-class=\"['alert-' + (type || 'warning'), closeable ? 'alert-dismissible' : null]\" role=\"alert\">\n" +
	    "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"close({$event: $event})\">\n" +
	    "        <span aria-hidden=\"true\">&times;</span>\n" +
	    "        <span class=\"sr-only\">Close</span>\n" +
	    "    </button>\n" +
	    "    <div ng-transclude></div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/carousel/carousel.html",
	    "<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\" ng-swipe-right=\"prev()\" ng-swipe-left=\"next()\">\n" +
	    "  <div class=\"carousel-inner\" ng-transclude></div>\n" +
	    "  <a role=\"button\" href class=\"left carousel-control\" ng-click=\"prev()\" ng-show=\"slides.length > 1\">\n" +
	    "    <span aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></span>\n" +
	    "    <span class=\"sr-only\">previous</span>\n" +
	    "  </a>\n" +
	    "  <a role=\"button\" href class=\"right carousel-control\" ng-click=\"next()\" ng-show=\"slides.length > 1\">\n" +
	    "    <span aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></span>\n" +
	    "    <span class=\"sr-only\">next</span>\n" +
	    "  </a>\n" +
	    "  <ol class=\"carousel-indicators\" ng-show=\"slides.length > 1\">\n" +
	    "    <li ng-repeat=\"slide in slides | orderBy:indexOfSlide track by $index\" ng-class=\"{ active: isActive(slide) }\" ng-click=\"select(slide)\">\n" +
	    "      <span class=\"sr-only\">slide {{ $index + 1 }} of {{ slides.length }}<span ng-if=\"isActive(slide)\">, currently active</span></span>\n" +
	    "    </li>\n" +
	    "  </ol>\n" +
	    "</div>");
	}]);

	angular.module("template/carousel/slide.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/carousel/slide.html",
	    "<div ng-class=\"{\n" +
	    "    'active': active\n" +
	    "  }\" class=\"item text-center\" ng-transclude></div>\n" +
	    "");
	}]);

	angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/datepicker.html",
	    "<div ng-switch=\"datepickerMode\" role=\"application\" ng-keydown=\"keydown($event)\">\n" +
	    "  <uib-daypicker ng-switch-when=\"day\" tabindex=\"0\"></uib-daypicker>\n" +
	    "  <uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\"></uib-monthpicker>\n" +
	    "  <uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\"></uib-yearpicker>\n" +
	    "</div>");
	}]);

	angular.module("template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/day.html",
	    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
	    "  <thead>\n" +
	    "    <tr>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
	    "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
	    "    </tr>\n" +
	    "    <tr>\n" +
	    "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
	    "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +
	    "    </tr>\n" +
	    "  </thead>\n" +
	    "  <tbody>\n" +
	    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
	    "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
	    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
	    "        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{'text-muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
	    "      </td>\n" +
	    "    </tr>\n" +
	    "  </tbody>\n" +
	    "</table>\n" +
	    "");
	}]);

	angular.module("template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/month.html",
	    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
	    "  <thead>\n" +
	    "    <tr>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
	    "      <th><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
	    "    </tr>\n" +
	    "  </thead>\n" +
	    "  <tbody>\n" +
	    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
	    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
	    "        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
	    "      </td>\n" +
	    "    </tr>\n" +
	    "  </tbody>\n" +
	    "</table>\n" +
	    "");
	}]);

	angular.module("template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/popup.html",
	    "<ul class=\"dropdown-menu\" dropdown-nested ng-if=\"isOpen\" style=\"display: block\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
	    "	<li ng-transclude></li>\n" +
	    "	<li ng-if=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n" +
	    "		<span class=\"btn-group pull-left\">\n" +
	    "			<button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"select('today')\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
	    "			<button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"select(null)\">{{ getText('clear') }}</button>\n" +
	    "		</span>\n" +
	    "		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
	    "	</li>\n" +
	    "</ul>\n" +
	    "");
	}]);

	angular.module("template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/year.html",
	    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
	    "  <thead>\n" +
	    "    <tr>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
	    "      <th colspan=\"3\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
	    "    </tr>\n" +
	    "  </thead>\n" +
	    "  <tbody>\n" +
	    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
	    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
	    "        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
	    "      </td>\n" +
	    "    </tr>\n" +
	    "  </tbody>\n" +
	    "</table>\n" +
	    "");
	}]);

	angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/modal/backdrop.html",
	    "<div uib-modal-animation-class=\"fade\"\n" +
	    "     modal-in-class=\"in\"\n" +
	    "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\"\n" +
	    "></div>\n" +
	    "");
	}]);

	angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/modal/window.html",
	    "<div modal-render=\"{{$isRendered}}\" tabindex=\"-1\" role=\"dialog\" class=\"modal\"\n" +
	    "    uib-modal-animation-class=\"fade\"\n" +
	    "    modal-in-class=\"in\"\n" +
	    "    ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\">\n" +
	    "    <div class=\"modal-dialog\" ng-class=\"size ? 'modal-' + size : ''\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/pagination/pager.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/pagination/pager.html",
	    "<ul class=\"pager\">\n" +
	    "  <li ng-class=\"{disabled: noPrevious()||ngDisabled, previous: align}\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
	    "  <li ng-class=\"{disabled: noNext()||ngDisabled, next: align}\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
	    "</ul>\n" +
	    "");
	}]);

	angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/pagination/pagination.html",
	    "<ul class=\"pagination\">\n" +
	    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a href ng-click=\"selectPage(1, $event)\">{{::getText('first')}}</a></li>\n" +
	    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
	    "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active,disabled: ngDisabled&&!page.active}\" class=\"pagination-page\"><a href ng-click=\"selectPage(page.number, $event)\">{{page.text}}</a></li>\n" +
	    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
	    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a href ng-click=\"selectPage(totalPages, $event)\">{{::getText('last')}}</a></li>\n" +
	    "</ul>\n" +
	    "");
	}]);

	angular.module("template/tooltip/tooltip-html-popup.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tooltip/tooltip-html-popup.html",
	    "<div\n" +
	    "  tooltip-animation-class=\"fade\"\n" +
	    "  uib-tooltip-classes\n" +
	    "  ng-class=\"{ in: isOpen() }\">\n" +
	    "  <div class=\"tooltip-arrow\"></div>\n" +
	    "  <div class=\"tooltip-inner\" ng-bind-html=\"contentExp()\"></div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tooltip/tooltip-popup.html",
	    "<div\n" +
	    "  tooltip-animation-class=\"fade\"\n" +
	    "  uib-tooltip-classes\n" +
	    "  ng-class=\"{ in: isOpen() }\">\n" +
	    "  <div class=\"tooltip-arrow\"></div>\n" +
	    "  <div class=\"tooltip-inner\" ng-bind=\"content\"></div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/tooltip/tooltip-template-popup.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tooltip/tooltip-template-popup.html",
	    "<div\n" +
	    "  tooltip-animation-class=\"fade\"\n" +
	    "  uib-tooltip-classes\n" +
	    "  ng-class=\"{ in: isOpen() }\">\n" +
	    "  <div class=\"tooltip-arrow\"></div>\n" +
	    "  <div class=\"tooltip-inner\"\n" +
	    "    uib-tooltip-template-transclude=\"contentExp()\"\n" +
	    "    tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/popover/popover-html.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/popover/popover-html.html",
	    "<div tooltip-animation-class=\"fade\"\n" +
	    "  uib-tooltip-classes\n" +
	    "  ng-class=\"{ in: isOpen() }\">\n" +
	    "  <div class=\"arrow\"></div>\n" +
	    "\n" +
	    "  <div class=\"popover-inner\">\n" +
	    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
	    "      <div class=\"popover-content\" ng-bind-html=\"contentExp()\"></div>\n" +
	    "  </div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/popover/popover-template.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/popover/popover-template.html",
	    "<div tooltip-animation-class=\"fade\"\n" +
	    "  uib-tooltip-classes\n" +
	    "  ng-class=\"{ in: isOpen() }\">\n" +
	    "  <div class=\"arrow\"></div>\n" +
	    "\n" +
	    "  <div class=\"popover-inner\">\n" +
	    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
	    "      <div class=\"popover-content\"\n" +
	    "        uib-tooltip-template-transclude=\"contentExp()\"\n" +
	    "        tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
	    "  </div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/popover/popover.html",
	    "<div tooltip-animation-class=\"fade\"\n" +
	    "  uib-tooltip-classes\n" +
	    "  ng-class=\"{ in: isOpen() }\">\n" +
	    "  <div class=\"arrow\"></div>\n" +
	    "\n" +
	    "  <div class=\"popover-inner\">\n" +
	    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
	    "      <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
	    "  </div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/progressbar/bar.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/progressbar/bar.html",
	    "<div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" aria-labelledby=\"{{::title}}\" style=\"min-width: 0;\" ng-transclude></div>\n" +
	    "");
	}]);

	angular.module("template/progressbar/progress.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/progressbar/progress.html",
	    "<div class=\"progress\" ng-transclude aria-labelledby=\"{{::title}}\"></div>");
	}]);

	angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/progressbar/progressbar.html",
	    "<div class=\"progress\">\n" +
	    "  <div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" aria-labelledby=\"{{::title}}\" style=\"min-width: 0;\" ng-transclude></div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/rating/rating.html",
	    "<span ng-mouseleave=\"reset()\" ng-keydown=\"onKeydown($event)\" tabindex=\"0\" role=\"slider\" aria-valuemin=\"0\" aria-valuemax=\"{{range.length}}\" aria-valuenow=\"{{value}}\">\n" +
	    "    <span ng-repeat-start=\"r in range track by $index\" class=\"sr-only\">({{ $index < value ? '*' : ' ' }})</span>\n" +
	    "    <i ng-repeat-end ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"glyphicon\" ng-class=\"$index < value && (r.stateOn || 'glyphicon-star') || (r.stateOff || 'glyphicon-star-empty')\" ng-attr-title=\"{{r.title}}\" aria-valuetext=\"{{r.title}}\"></i>\n" +
	    "</span>\n" +
	    "");
	}]);

	angular.module("template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tabs/tab.html",
	    "<li ng-class=\"{active: active, disabled: disabled}\">\n" +
	    "  <a href ng-click=\"select()\" uib-tab-heading-transclude>{{heading}}</a>\n" +
	    "</li>\n" +
	    "");
	}]);

	angular.module("template/tabs/tabset.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tabs/tabset.html",
	    "<div>\n" +
	    "  <ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
	    "  <div class=\"tab-content\">\n" +
	    "    <div class=\"tab-pane\" \n" +
	    "         ng-repeat=\"tab in tabs\" \n" +
	    "         ng-class=\"{active: tab.active}\"\n" +
	    "         uib-tab-content-transclude=\"tab\">\n" +
	    "    </div>\n" +
	    "  </div>\n" +
	    "</div>\n" +
	    "");
	}]);

	angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/timepicker/timepicker.html",
	    "<table>\n" +
	    "  <tbody>\n" +
	    "    <tr class=\"text-center\" ng-show=\"::showSpinners\">\n" +
	    "      <td><a ng-click=\"incrementHours()\" ng-class=\"{disabled: noIncrementHours()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementHours()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
	    "      <td>&nbsp;</td>\n" +
	    "      <td><a ng-click=\"incrementMinutes()\" ng-class=\"{disabled: noIncrementMinutes()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementMinutes()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
	    "      <td ng-show=\"showMeridian\"></td>\n" +
	    "    </tr>\n" +
	    "    <tr>\n" +
	    "      <td class=\"form-group\" ng-class=\"{'has-error': invalidHours}\">\n" +
	    "        <input style=\"width:50px;\" type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-readonly=\"::readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\">\n" +
	    "      </td>\n" +
	    "      <td>:</td>\n" +
	    "      <td class=\"form-group\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
	    "        <input style=\"width:50px;\" type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"::readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\">\n" +
	    "      </td>\n" +
	    "      <td ng-show=\"showMeridian\"><button type=\"button\" ng-class=\"{disabled: noToggleMeridian()}\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\" ng-disabled=\"noToggleMeridian()\" tabindex=\"{{::tabindex}}\">{{meridian}}</button></td>\n" +
	    "    </tr>\n" +
	    "    <tr class=\"text-center\" ng-show=\"::showSpinners\">\n" +
	    "      <td><a ng-click=\"decrementHours()\" ng-class=\"{disabled: noDecrementHours()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementHours()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
	    "      <td>&nbsp;</td>\n" +
	    "      <td><a ng-click=\"decrementMinutes()\" ng-class=\"{disabled: noDecrementMinutes()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementMinutes()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
	    "      <td ng-show=\"showMeridian\"></td>\n" +
	    "    </tr>\n" +
	    "  </tbody>\n" +
	    "</table>\n" +
	    "");
	}]);

	angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/typeahead/typeahead-match.html",
	    "<a href tabindex=\"-1\" ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"></a>\n" +
	    "");
	}]);

	angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/typeahead/typeahead-popup.html",
	    "<ul class=\"dropdown-menu\" ng-show=\"isOpen() && !moveInProgress\" ng-style=\"{top: position().top+'px', left: position().left+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
	    "    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{::match.id}}\">\n" +
	    "        <div uib-typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
	    "    </li>\n" +
	    "</ul>\n" +
	    "");
	}]);
	!angular.$$csp() && angular.element(document).find('head').prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>');

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(12);
	module.exports = 'ngResource';


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * @license AngularJS v1.4.8
	 * (c) 2010-2015 Google, Inc. http://angularjs.org
	 * License: MIT
	 */
	(function(window, angular, undefined) {'use strict';

	var $resourceMinErr = angular.$$minErr('$resource');

	// Helper functions and regex to lookup a dotted path on an object
	// stopping at undefined/null.  The path must be composed of ASCII
	// identifiers (just like $parse)
	var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;

	function isValidDottedPath(path) {
	  return (path != null && path !== '' && path !== 'hasOwnProperty' &&
	      MEMBER_NAME_REGEX.test('.' + path));
	}

	function lookupDottedPath(obj, path) {
	  if (!isValidDottedPath(path)) {
	    throw $resourceMinErr('badmember', 'Dotted member path "@{0}" is invalid.', path);
	  }
	  var keys = path.split('.');
	  for (var i = 0, ii = keys.length; i < ii && angular.isDefined(obj); i++) {
	    var key = keys[i];
	    obj = (obj !== null) ? obj[key] : undefined;
	  }
	  return obj;
	}

	/**
	 * Create a shallow copy of an object and clear other fields from the destination
	 */
	function shallowClearAndCopy(src, dst) {
	  dst = dst || {};

	  angular.forEach(dst, function(value, key) {
	    delete dst[key];
	  });

	  for (var key in src) {
	    if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
	      dst[key] = src[key];
	    }
	  }

	  return dst;
	}

	/**
	 * @ngdoc module
	 * @name ngResource
	 * @description
	 *
	 * # ngResource
	 *
	 * The `ngResource` module provides interaction support with RESTful services
	 * via the $resource service.
	 *
	 *
	 * <div doc-module-components="ngResource"></div>
	 *
	 * See {@link ngResource.$resource `$resource`} for usage.
	 */

	/**
	 * @ngdoc service
	 * @name $resource
	 * @requires $http
	 *
	 * @description
	 * A factory which creates a resource object that lets you interact with
	 * [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer) server-side data sources.
	 *
	 * The returned resource object has action methods which provide high-level behaviors without
	 * the need to interact with the low level {@link ng.$http $http} service.
	 *
	 * Requires the {@link ngResource `ngResource`} module to be installed.
	 *
	 * By default, trailing slashes will be stripped from the calculated URLs,
	 * which can pose problems with server backends that do not expect that
	 * behavior.  This can be disabled by configuring the `$resourceProvider` like
	 * this:
	 *
	 * ```js
	     app.config(['$resourceProvider', function($resourceProvider) {
	       // Don't strip trailing slashes from calculated URLs
	       $resourceProvider.defaults.stripTrailingSlashes = false;
	     }]);
	 * ```
	 *
	 * @param {string} url A parameterized URL template with parameters prefixed by `:` as in
	 *   `/user/:username`. If you are using a URL with a port number (e.g.
	 *   `http://example.com:8080/api`), it will be respected.
	 *
	 *   If you are using a url with a suffix, just add the suffix, like this:
	 *   `$resource('http://example.com/resource.json')` or `$resource('http://example.com/:id.json')`
	 *   or even `$resource('http://example.com/resource/:resource_id.:format')`
	 *   If the parameter before the suffix is empty, :resource_id in this case, then the `/.` will be
	 *   collapsed down to a single `.`.  If you need this sequence to appear and not collapse then you
	 *   can escape it with `/\.`.
	 *
	 * @param {Object=} paramDefaults Default values for `url` parameters. These can be overridden in
	 *   `actions` methods. If any of the parameter value is a function, it will be executed every time
	 *   when a param value needs to be obtained for a request (unless the param was overridden).
	 *
	 *   Each key value in the parameter object is first bound to url template if present and then any
	 *   excess keys are appended to the url search query after the `?`.
	 *
	 *   Given a template `/path/:verb` and parameter `{verb:'greet', salutation:'Hello'}` results in
	 *   URL `/path/greet?salutation=Hello`.
	 *
	 *   If the parameter value is prefixed with `@` then the value for that parameter will be extracted
	 *   from the corresponding property on the `data` object (provided when calling an action method).  For
	 *   example, if the `defaultParam` object is `{someParam: '@someProp'}` then the value of `someParam`
	 *   will be `data.someProp`.
	 *
	 * @param {Object.<Object>=} actions Hash with declaration of custom actions that should extend
	 *   the default set of resource actions. The declaration should be created in the format of {@link
	 *   ng.$http#usage $http.config}:
	 *
	 *       {action1: {method:?, params:?, isArray:?, headers:?, ...},
	 *        action2: {method:?, params:?, isArray:?, headers:?, ...},
	 *        ...}
	 *
	 *   Where:
	 *
	 *   - **`action`** – {string} – The name of action. This name becomes the name of the method on
	 *     your resource object.
	 *   - **`method`** – {string} – Case insensitive HTTP method (e.g. `GET`, `POST`, `PUT`,
	 *     `DELETE`, `JSONP`, etc).
	 *   - **`params`** – {Object=} – Optional set of pre-bound parameters for this action. If any of
	 *     the parameter value is a function, it will be executed every time when a param value needs to
	 *     be obtained for a request (unless the param was overridden).
	 *   - **`url`** – {string} – action specific `url` override. The url templating is supported just
	 *     like for the resource-level urls.
	 *   - **`isArray`** – {boolean=} – If true then the returned object for this action is an array,
	 *     see `returns` section.
	 *   - **`transformRequest`** –
	 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
	 *     transform function or an array of such functions. The transform function takes the http
	 *     request body and headers and returns its transformed (typically serialized) version.
	 *     By default, transformRequest will contain one function that checks if the request data is
	 *     an object and serializes to using `angular.toJson`. To prevent this behavior, set
	 *     `transformRequest` to an empty array: `transformRequest: []`
	 *   - **`transformResponse`** –
	 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
	 *     transform function or an array of such functions. The transform function takes the http
	 *     response body and headers and returns its transformed (typically deserialized) version.
	 *     By default, transformResponse will contain one function that checks if the response looks like
	 *     a JSON string and deserializes it using `angular.fromJson`. To prevent this behavior, set
	 *     `transformResponse` to an empty array: `transformResponse: []`
	 *   - **`cache`** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
	 *     GET request, otherwise if a cache instance built with
	 *     {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
	 *     caching.
	 *   - **`timeout`** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise} that
	 *     should abort the request when resolved.
	 *   - **`withCredentials`** - `{boolean}` - whether to set the `withCredentials` flag on the
	 *     XHR object. See
	 *     [requests with credentials](https://developer.mozilla.org/en/http_access_control#section_5)
	 *     for more information.
	 *   - **`responseType`** - `{string}` - see
	 *     [requestType](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType).
	 *   - **`interceptor`** - `{Object=}` - The interceptor object has two optional methods -
	 *     `response` and `responseError`. Both `response` and `responseError` interceptors get called
	 *     with `http response` object. See {@link ng.$http $http interceptors}.
	 *
	 * @param {Object} options Hash with custom settings that should extend the
	 *   default `$resourceProvider` behavior.  The only supported option is
	 *
	 *   Where:
	 *
	 *   - **`stripTrailingSlashes`** – {boolean} – If true then the trailing
	 *   slashes from any calculated URL will be stripped. (Defaults to true.)
	 *
	 * @returns {Object} A resource "class" object with methods for the default set of resource actions
	 *   optionally extended with custom `actions`. The default set contains these actions:
	 *   ```js
	 *   { 'get':    {method:'GET'},
	 *     'save':   {method:'POST'},
	 *     'query':  {method:'GET', isArray:true},
	 *     'remove': {method:'DELETE'},
	 *     'delete': {method:'DELETE'} };
	 *   ```
	 *
	 *   Calling these methods invoke an {@link ng.$http} with the specified http method,
	 *   destination and parameters. When the data is returned from the server then the object is an
	 *   instance of the resource class. The actions `save`, `remove` and `delete` are available on it
	 *   as  methods with the `$` prefix. This allows you to easily perform CRUD operations (create,
	 *   read, update, delete) on server-side data like this:
	 *   ```js
	 *   var User = $resource('/user/:userId', {userId:'@id'});
	 *   var user = User.get({userId:123}, function() {
	 *     user.abc = true;
	 *     user.$save();
	 *   });
	 *   ```
	 *
	 *   It is important to realize that invoking a $resource object method immediately returns an
	 *   empty reference (object or array depending on `isArray`). Once the data is returned from the
	 *   server the existing reference is populated with the actual data. This is a useful trick since
	 *   usually the resource is assigned to a model which is then rendered by the view. Having an empty
	 *   object results in no rendering, once the data arrives from the server then the object is
	 *   populated with the data and the view automatically re-renders itself showing the new data. This
	 *   means that in most cases one never has to write a callback function for the action methods.
	 *
	 *   The action methods on the class object or instance object can be invoked with the following
	 *   parameters:
	 *
	 *   - HTTP GET "class" actions: `Resource.action([parameters], [success], [error])`
	 *   - non-GET "class" actions: `Resource.action([parameters], postData, [success], [error])`
	 *   - non-GET instance actions:  `instance.$action([parameters], [success], [error])`
	 *
	 *
	 *   Success callback is called with (value, responseHeaders) arguments, where the value is
	 *   the populated resource instance or collection object. The error callback is called
	 *   with (httpResponse) argument.
	 *
	 *   Class actions return empty instance (with additional properties below).
	 *   Instance actions return promise of the action.
	 *
	 *   The Resource instances and collection have these additional properties:
	 *
	 *   - `$promise`: the {@link ng.$q promise} of the original server interaction that created this
	 *     instance or collection.
	 *
	 *     On success, the promise is resolved with the same resource instance or collection object,
	 *     updated with data from server. This makes it easy to use in
	 *     {@link ngRoute.$routeProvider resolve section of $routeProvider.when()} to defer view
	 *     rendering until the resource(s) are loaded.
	 *
	 *     On failure, the promise is resolved with the {@link ng.$http http response} object, without
	 *     the `resource` property.
	 *
	 *     If an interceptor object was provided, the promise will instead be resolved with the value
	 *     returned by the interceptor.
	 *
	 *   - `$resolved`: `true` after first server interaction is completed (either with success or
	 *      rejection), `false` before that. Knowing if the Resource has been resolved is useful in
	 *      data-binding.
	 *
	 * @example
	 *
	 * # Credit card resource
	 *
	 * ```js
	     // Define CreditCard class
	     var CreditCard = $resource('/user/:userId/card/:cardId',
	      {userId:123, cardId:'@id'}, {
	       charge: {method:'POST', params:{charge:true}}
	      });

	     // We can retrieve a collection from the server
	     var cards = CreditCard.query(function() {
	       // GET: /user/123/card
	       // server returns: [ {id:456, number:'1234', name:'Smith'} ];

	       var card = cards[0];
	       // each item is an instance of CreditCard
	       expect(card instanceof CreditCard).toEqual(true);
	       card.name = "J. Smith";
	       // non GET methods are mapped onto the instances
	       card.$save();
	       // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
	       // server returns: {id:456, number:'1234', name: 'J. Smith'};

	       // our custom method is mapped as well.
	       card.$charge({amount:9.99});
	       // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
	     });

	     // we can create an instance as well
	     var newCard = new CreditCard({number:'0123'});
	     newCard.name = "Mike Smith";
	     newCard.$save();
	     // POST: /user/123/card {number:'0123', name:'Mike Smith'}
	     // server returns: {id:789, number:'0123', name: 'Mike Smith'};
	     expect(newCard.id).toEqual(789);
	 * ```
	 *
	 * The object returned from this function execution is a resource "class" which has "static" method
	 * for each action in the definition.
	 *
	 * Calling these methods invoke `$http` on the `url` template with the given `method`, `params` and
	 * `headers`.
	 * When the data is returned from the server then the object is an instance of the resource type and
	 * all of the non-GET methods are available with `$` prefix. This allows you to easily support CRUD
	 * operations (create, read, update, delete) on server-side data.

	   ```js
	     var User = $resource('/user/:userId', {userId:'@id'});
	     User.get({userId:123}, function(user) {
	       user.abc = true;
	       user.$save();
	     });
	   ```
	 *
	 * It's worth noting that the success callback for `get`, `query` and other methods gets passed
	 * in the response that came from the server as well as $http header getter function, so one
	 * could rewrite the above example and get access to http headers as:
	 *
	   ```js
	     var User = $resource('/user/:userId', {userId:'@id'});
	     User.get({userId:123}, function(u, getResponseHeaders){
	       u.abc = true;
	       u.$save(function(u, putResponseHeaders) {
	         //u => saved user object
	         //putResponseHeaders => $http header getter
	       });
	     });
	   ```
	 *
	 * You can also access the raw `$http` promise via the `$promise` property on the object returned
	 *
	   ```
	     var User = $resource('/user/:userId', {userId:'@id'});
	     User.get({userId:123})
	         .$promise.then(function(user) {
	           $scope.user = user;
	         });
	   ```

	 * # Creating a custom 'PUT' request
	 * In this example we create a custom method on our resource to make a PUT request
	 * ```js
	 *    var app = angular.module('app', ['ngResource', 'ngRoute']);
	 *
	 *    // Some APIs expect a PUT request in the format URL/object/ID
	 *    // Here we are creating an 'update' method
	 *    app.factory('Notes', ['$resource', function($resource) {
	 *    return $resource('/notes/:id', null,
	 *        {
	 *            'update': { method:'PUT' }
	 *        });
	 *    }]);
	 *
	 *    // In our controller we get the ID from the URL using ngRoute and $routeParams
	 *    // We pass in $routeParams and our Notes factory along with $scope
	 *    app.controller('NotesCtrl', ['$scope', '$routeParams', 'Notes',
	                                      function($scope, $routeParams, Notes) {
	 *    // First get a note object from the factory
	 *    var note = Notes.get({ id:$routeParams.id });
	 *    $id = note.id;
	 *
	 *    // Now call update passing in the ID first then the object you are updating
	 *    Notes.update({ id:$id }, note);
	 *
	 *    // This will PUT /notes/ID with the note object in the request payload
	 *    }]);
	 * ```
	 */
	angular.module('ngResource', ['ng']).
	  provider('$resource', function() {
	    var PROTOCOL_AND_DOMAIN_REGEX = /^https?:\/\/[^\/]*/;
	    var provider = this;

	    this.defaults = {
	      // Strip slashes by default
	      stripTrailingSlashes: true,

	      // Default actions configuration
	      actions: {
	        'get': {method: 'GET'},
	        'save': {method: 'POST'},
	        'query': {method: 'GET', isArray: true},
	        'remove': {method: 'DELETE'},
	        'delete': {method: 'DELETE'}
	      }
	    };

	    this.$get = ['$http', '$q', function($http, $q) {

	      var noop = angular.noop,
	        forEach = angular.forEach,
	        extend = angular.extend,
	        copy = angular.copy,
	        isFunction = angular.isFunction;

	      /**
	       * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
	       * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
	       * (pchar) allowed in path segments:
	       *    segment       = *pchar
	       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
	       *    pct-encoded   = "%" HEXDIG HEXDIG
	       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
	       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
	       *                     / "*" / "+" / "," / ";" / "="
	       */
	      function encodeUriSegment(val) {
	        return encodeUriQuery(val, true).
	          replace(/%26/gi, '&').
	          replace(/%3D/gi, '=').
	          replace(/%2B/gi, '+');
	      }


	      /**
	       * This method is intended for encoding *key* or *value* parts of query component. We need a
	       * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
	       * have to be encoded per http://tools.ietf.org/html/rfc3986:
	       *    query       = *( pchar / "/" / "?" )
	       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
	       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
	       *    pct-encoded   = "%" HEXDIG HEXDIG
	       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
	       *                     / "*" / "+" / "," / ";" / "="
	       */
	      function encodeUriQuery(val, pctEncodeSpaces) {
	        return encodeURIComponent(val).
	          replace(/%40/gi, '@').
	          replace(/%3A/gi, ':').
	          replace(/%24/g, '$').
	          replace(/%2C/gi, ',').
	          replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
	      }

	      function Route(template, defaults) {
	        this.template = template;
	        this.defaults = extend({}, provider.defaults, defaults);
	        this.urlParams = {};
	      }

	      Route.prototype = {
	        setUrlParams: function(config, params, actionUrl) {
	          var self = this,
	            url = actionUrl || self.template,
	            val,
	            encodedVal,
	            protocolAndDomain = '';

	          var urlParams = self.urlParams = {};
	          forEach(url.split(/\W/), function(param) {
	            if (param === 'hasOwnProperty') {
	              throw $resourceMinErr('badname', "hasOwnProperty is not a valid parameter name.");
	            }
	            if (!(new RegExp("^\\d+$").test(param)) && param &&
	              (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
	              urlParams[param] = true;
	            }
	          });
	          url = url.replace(/\\:/g, ':');
	          url = url.replace(PROTOCOL_AND_DOMAIN_REGEX, function(match) {
	            protocolAndDomain = match;
	            return '';
	          });

	          params = params || {};
	          forEach(self.urlParams, function(_, urlParam) {
	            val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
	            if (angular.isDefined(val) && val !== null) {
	              encodedVal = encodeUriSegment(val);
	              url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function(match, p1) {
	                return encodedVal + p1;
	              });
	            } else {
	              url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match,
	                  leadingSlashes, tail) {
	                if (tail.charAt(0) == '/') {
	                  return tail;
	                } else {
	                  return leadingSlashes + tail;
	                }
	              });
	            }
	          });

	          // strip trailing slashes and set the url (unless this behavior is specifically disabled)
	          if (self.defaults.stripTrailingSlashes) {
	            url = url.replace(/\/+$/, '') || '/';
	          }

	          // then replace collapse `/.` if found in the last URL path segment before the query
	          // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
	          url = url.replace(/\/\.(?=\w+($|\?))/, '.');
	          // replace escaped `/\.` with `/.`
	          config.url = protocolAndDomain + url.replace(/\/\\\./, '/.');


	          // set params - delegate param encoding to $http
	          forEach(params, function(value, key) {
	            if (!self.urlParams[key]) {
	              config.params = config.params || {};
	              config.params[key] = value;
	            }
	          });
	        }
	      };


	      function resourceFactory(url, paramDefaults, actions, options) {
	        var route = new Route(url, options);

	        actions = extend({}, provider.defaults.actions, actions);

	        function extractParams(data, actionParams) {
	          var ids = {};
	          actionParams = extend({}, paramDefaults, actionParams);
	          forEach(actionParams, function(value, key) {
	            if (isFunction(value)) { value = value(); }
	            ids[key] = value && value.charAt && value.charAt(0) == '@' ?
	              lookupDottedPath(data, value.substr(1)) : value;
	          });
	          return ids;
	        }

	        function defaultResponseInterceptor(response) {
	          return response.resource;
	        }

	        function Resource(value) {
	          shallowClearAndCopy(value || {}, this);
	        }

	        Resource.prototype.toJSON = function() {
	          var data = extend({}, this);
	          delete data.$promise;
	          delete data.$resolved;
	          return data;
	        };

	        forEach(actions, function(action, name) {
	          var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);

	          Resource[name] = function(a1, a2, a3, a4) {
	            var params = {}, data, success, error;

	            /* jshint -W086 */ /* (purposefully fall through case statements) */
	            switch (arguments.length) {
	              case 4:
	                error = a4;
	                success = a3;
	              //fallthrough
	              case 3:
	              case 2:
	                if (isFunction(a2)) {
	                  if (isFunction(a1)) {
	                    success = a1;
	                    error = a2;
	                    break;
	                  }

	                  success = a2;
	                  error = a3;
	                  //fallthrough
	                } else {
	                  params = a1;
	                  data = a2;
	                  success = a3;
	                  break;
	                }
	              case 1:
	                if (isFunction(a1)) success = a1;
	                else if (hasBody) data = a1;
	                else params = a1;
	                break;
	              case 0: break;
	              default:
	                throw $resourceMinErr('badargs',
	                  "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
	                  arguments.length);
	            }
	            /* jshint +W086 */ /* (purposefully fall through case statements) */

	            var isInstanceCall = this instanceof Resource;
	            var value = isInstanceCall ? data : (action.isArray ? [] : new Resource(data));
	            var httpConfig = {};
	            var responseInterceptor = action.interceptor && action.interceptor.response ||
	              defaultResponseInterceptor;
	            var responseErrorInterceptor = action.interceptor && action.interceptor.responseError ||
	              undefined;

	            forEach(action, function(value, key) {
	              switch (key) {
	                default:
	                  httpConfig[key] = copy(value);
	                  break;
	                case 'params':
	                case 'isArray':
	                case 'interceptor':
	                  break;
	                case 'timeout':
	                  httpConfig[key] = value;
	                  break;
	              }
	            });

	            if (hasBody) httpConfig.data = data;
	            route.setUrlParams(httpConfig,
	              extend({}, extractParams(data, action.params || {}), params),
	              action.url);

	            var promise = $http(httpConfig).then(function(response) {
	              var data = response.data,
	                promise = value.$promise;

	              if (data) {
	                // Need to convert action.isArray to boolean in case it is undefined
	                // jshint -W018
	                if (angular.isArray(data) !== (!!action.isArray)) {
	                  throw $resourceMinErr('badcfg',
	                      'Error in resource configuration for action `{0}`. Expected response to ' +
	                      'contain an {1} but got an {2} (Request: {3} {4})', name, action.isArray ? 'array' : 'object',
	                    angular.isArray(data) ? 'array' : 'object', httpConfig.method, httpConfig.url);
	                }
	                // jshint +W018
	                if (action.isArray) {
	                  value.length = 0;
	                  forEach(data, function(item) {
	                    if (typeof item === "object") {
	                      value.push(new Resource(item));
	                    } else {
	                      // Valid JSON values may be string literals, and these should not be converted
	                      // into objects. These items will not have access to the Resource prototype
	                      // methods, but unfortunately there
	                      value.push(item);
	                    }
	                  });
	                } else {
	                  shallowClearAndCopy(data, value);
	                  value.$promise = promise;
	                }
	              }

	              value.$resolved = true;

	              response.resource = value;

	              return response;
	            }, function(response) {
	              value.$resolved = true;

	              (error || noop)(response);

	              return $q.reject(response);
	            });

	            promise = promise.then(
	              function(response) {
	                var value = responseInterceptor(response);
	                (success || noop)(value, response.headers);
	                return value;
	              },
	              responseErrorInterceptor);

	            if (!isInstanceCall) {
	              // we are creating instance / collection
	              // - set the initial promise
	              // - return the instance / collection
	              value.$promise = promise;
	              value.$resolved = false;

	              return value;
	            }

	            // instance call
	            return promise;
	          };


	          Resource.prototype['$' + name] = function(params, success, error) {
	            if (isFunction(params)) {
	              error = success; success = params; params = {};
	            }
	            var result = Resource[name].call(this, params, this, success, error);
	            return result.$promise || result;
	          };
	        });

	        Resource.bind = function(additionalParamDefaults) {
	          return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
	        };

	        return Resource;
	      }

	      return resourceFactory;
	    }];
	  });


	})(window, window.angular);


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * oclazyload - Load modules on demand (lazy load) with angularJS
	 * @version v1.0.8
	 * @link https://github.com/ocombe/ocLazyLoad
	 * @license MIT
	 * @author Olivier Combe <olivier.combe@gmail.com>
	 */
	(function (angular, window) {
	    'use strict';

	    var regModules = ['ng', 'oc.lazyLoad'],
	        regInvokes = {},
	        regConfigs = [],
	        modulesToLoad = [],
	        // modules to load from angular.module or other sources
	    realModules = [],
	        // real modules called from angular.module
	    recordDeclarations = [],
	        broadcast = angular.noop,
	        runBlocks = {},
	        justLoaded = [];

	    var ocLazyLoad = angular.module('oc.lazyLoad', ['ng']);

	    ocLazyLoad.provider('$ocLazyLoad', ["$controllerProvider", "$provide", "$compileProvider", "$filterProvider", "$injector", "$animateProvider", function ($controllerProvider, $provide, $compileProvider, $filterProvider, $injector, $animateProvider) {
	        var modules = {},
	            providers = {
	            $controllerProvider: $controllerProvider,
	            $compileProvider: $compileProvider,
	            $filterProvider: $filterProvider,
	            $provide: $provide, // other things (constant, decorator, provider, factory, service)
	            $injector: $injector,
	            $animateProvider: $animateProvider
	        },
	            debug = false,
	            events = false,
	            moduleCache = [],
	            modulePromises = {};

	        moduleCache.push = function (value) {
	            if (this.indexOf(value) === -1) {
	                Array.prototype.push.apply(this, arguments);
	            }
	        };

	        this.config = function (config) {
	            // If we want to define modules configs
	            if (angular.isDefined(config.modules)) {
	                if (angular.isArray(config.modules)) {
	                    angular.forEach(config.modules, function (moduleConfig) {
	                        modules[moduleConfig.name] = moduleConfig;
	                    });
	                } else {
	                    modules[config.modules.name] = config.modules;
	                }
	            }

	            if (angular.isDefined(config.debug)) {
	                debug = config.debug;
	            }

	            if (angular.isDefined(config.events)) {
	                events = config.events;
	            }
	        };

	        /**
	         * Get the list of existing registered modules
	         * @param element
	         */
	        this._init = function _init(element) {
	            // this is probably useless now because we override angular.bootstrap
	            if (modulesToLoad.length === 0) {
	                var elements = [element],
	                    names = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app'],
	                    NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/,
	                    append = function append(elm) {
	                    return elm && elements.push(elm);
	                };

	                angular.forEach(names, function (name) {
	                    names[name] = true;
	                    append(document.getElementById(name));
	                    name = name.replace(':', '\\:');
	                    if (typeof element[0] !== 'undefined' && element[0].querySelectorAll) {
	                        angular.forEach(element[0].querySelectorAll('.' + name), append);
	                        angular.forEach(element[0].querySelectorAll('.' + name + '\\:'), append);
	                        angular.forEach(element[0].querySelectorAll('[' + name + ']'), append);
	                    }
	                });

	                angular.forEach(elements, function (elm) {
	                    if (modulesToLoad.length === 0) {
	                        var className = ' ' + element.className + ' ';
	                        var match = NG_APP_CLASS_REGEXP.exec(className);
	                        if (match) {
	                            modulesToLoad.push((match[2] || '').replace(/\s+/g, ','));
	                        } else {
	                            angular.forEach(elm.attributes, function (attr) {
	                                if (modulesToLoad.length === 0 && names[attr.name]) {
	                                    modulesToLoad.push(attr.value);
	                                }
	                            });
	                        }
	                    }
	                });
	            }

	            if (modulesToLoad.length === 0 && !((window.jasmine || window.mocha) && angular.isDefined(angular.mock))) {
	                console.error('No module found during bootstrap, unable to init ocLazyLoad. You should always use the ng-app directive or angular.boostrap when you use ocLazyLoad.');
	            }

	            var addReg = function addReg(moduleName) {
	                if (regModules.indexOf(moduleName) === -1) {
	                    // register existing modules
	                    regModules.push(moduleName);
	                    var mainModule = angular.module(moduleName);

	                    // register existing components (directives, services, ...)
	                    _invokeQueue(null, mainModule._invokeQueue, moduleName);
	                    _invokeQueue(null, mainModule._configBlocks, moduleName); // angular 1.3+

	                    angular.forEach(mainModule.requires, addReg);
	                }
	            };

	            angular.forEach(modulesToLoad, function (moduleName) {
	                addReg(moduleName);
	            });

	            modulesToLoad = []; // reset for next bootstrap
	            recordDeclarations.pop(); // wait for the next lazy load
	        };

	        /**
	         * Like JSON.stringify but that doesn't throw on circular references
	         * @param obj
	         */
	        var stringify = function stringify(obj) {
	            try {
	                return JSON.stringify(obj);
	            } catch (e) {
	                var cache = [];
	                return JSON.stringify(obj, function (key, value) {
	                    if (angular.isObject(value) && value !== null) {
	                        if (cache.indexOf(value) !== -1) {
	                            // Circular reference found, discard key
	                            return;
	                        }
	                        // Store value in our collection
	                        cache.push(value);
	                    }
	                    return value;
	                });
	            }
	        };

	        var hashCode = function hashCode(str) {
	            var hash = 0,
	                i,
	                chr,
	                len;
	            if (str.length == 0) {
	                return hash;
	            }
	            for (i = 0, len = str.length; i < len; i++) {
	                chr = str.charCodeAt(i);
	                hash = (hash << 5) - hash + chr;
	                hash |= 0; // Convert to 32bit integer
	            }
	            return hash;
	        };

	        function _register(providers, registerModules, params) {
	            if (registerModules) {
	                var k,
	                    moduleName,
	                    moduleFn,
	                    tempRunBlocks = [];
	                for (k = registerModules.length - 1; k >= 0; k--) {
	                    moduleName = registerModules[k];
	                    if (!angular.isString(moduleName)) {
	                        moduleName = getModuleName(moduleName);
	                    }
	                    if (!moduleName || justLoaded.indexOf(moduleName) !== -1 || modules[moduleName] && realModules.indexOf(moduleName) === -1) {
	                        continue;
	                    }
	                    // new if not registered
	                    var newModule = regModules.indexOf(moduleName) === -1;
	                    moduleFn = ngModuleFct(moduleName);
	                    if (newModule) {
	                        regModules.push(moduleName);
	                        _register(providers, moduleFn.requires, params);
	                    }
	                    if (moduleFn._runBlocks.length > 0) {
	                        // new run blocks detected! Replace the old ones (if existing)
	                        runBlocks[moduleName] = [];
	                        while (moduleFn._runBlocks.length > 0) {
	                            runBlocks[moduleName].push(moduleFn._runBlocks.shift());
	                        }
	                    }
	                    if (angular.isDefined(runBlocks[moduleName]) && (newModule || params.rerun)) {
	                        tempRunBlocks = tempRunBlocks.concat(runBlocks[moduleName]);
	                    }
	                    _invokeQueue(providers, moduleFn._invokeQueue, moduleName, params.reconfig);
	                    _invokeQueue(providers, moduleFn._configBlocks, moduleName, params.reconfig); // angular 1.3+
	                    broadcast(newModule ? 'ocLazyLoad.moduleLoaded' : 'ocLazyLoad.moduleReloaded', moduleName);
	                    registerModules.pop();
	                    justLoaded.push(moduleName);
	                }
	                // execute the run blocks at the end
	                var instanceInjector = providers.getInstanceInjector();
	                angular.forEach(tempRunBlocks, function (fn) {
	                    instanceInjector.invoke(fn);
	                });
	            }
	        }

	        function _registerInvokeList(args, moduleName) {
	            var invokeList = args[2][0],
	                type = args[1],
	                newInvoke = false;
	            if (angular.isUndefined(regInvokes[moduleName])) {
	                regInvokes[moduleName] = {};
	            }
	            if (angular.isUndefined(regInvokes[moduleName][type])) {
	                regInvokes[moduleName][type] = {};
	            }
	            var onInvoke = function onInvoke(invokeName, invoke) {
	                if (!regInvokes[moduleName][type].hasOwnProperty(invokeName)) {
	                    regInvokes[moduleName][type][invokeName] = [];
	                }
	                if (checkHashes(invoke, regInvokes[moduleName][type][invokeName])) {
	                    newInvoke = true;
	                    regInvokes[moduleName][type][invokeName].push(invoke);
	                    broadcast('ocLazyLoad.componentLoaded', [moduleName, type, invokeName]);
	                }
	            };

	            function checkHashes(potentialNew, invokes) {
	                var isNew = true,
	                    newHash;
	                if (invokes.length) {
	                    newHash = signature(potentialNew);
	                    angular.forEach(invokes, function (invoke) {
	                        isNew = isNew && signature(invoke) !== newHash;
	                    });
	                }
	                return isNew;
	            }

	            function signature(data) {
	                if (angular.isArray(data)) {
	                    // arrays are objects, we need to test for it first
	                    return hashCode(data.toString());
	                } else if (angular.isObject(data)) {
	                    // constants & values for example
	                    return hashCode(stringify(data));
	                } else {
	                    if (angular.isDefined(data) && data !== null) {
	                        return hashCode(data.toString());
	                    } else {
	                        // null & undefined constants
	                        return data;
	                    }
	                }
	            }

	            if (angular.isString(invokeList)) {
	                onInvoke(invokeList, args[2][1]);
	            } else if (angular.isObject(invokeList)) {
	                angular.forEach(invokeList, function (invoke, key) {
	                    if (angular.isString(invoke)) {
	                        // decorators for example
	                        onInvoke(invoke, invokeList[1]);
	                    } else {
	                        // components registered as object lists {"componentName": function() {}}
	                        onInvoke(key, invoke);
	                    }
	                });
	            } else {
	                return false;
	            }
	            return newInvoke;
	        }

	        function _invokeQueue(providers, queue, moduleName, reconfig) {
	            if (!queue) {
	                return;
	            }

	            var i, len, args, provider;
	            for (i = 0, len = queue.length; i < len; i++) {
	                args = queue[i];
	                if (angular.isArray(args)) {
	                    if (providers !== null) {
	                        if (providers.hasOwnProperty(args[0])) {
	                            provider = providers[args[0]];
	                        } else {
	                            throw new Error('unsupported provider ' + args[0]);
	                        }
	                    }
	                    var isNew = _registerInvokeList(args, moduleName);
	                    if (args[1] !== 'invoke') {
	                        if (isNew && angular.isDefined(provider)) {
	                            provider[args[1]].apply(provider, args[2]);
	                        }
	                    } else {
	                        // config block
	                        var callInvoke = function callInvoke(fct) {
	                            var invoked = regConfigs.indexOf(moduleName + '-' + fct);
	                            if (invoked === -1 || reconfig) {
	                                if (invoked === -1) {
	                                    regConfigs.push(moduleName + '-' + fct);
	                                }
	                                if (angular.isDefined(provider)) {
	                                    provider[args[1]].apply(provider, args[2]);
	                                }
	                            }
	                        };
	                        if (angular.isFunction(args[2][0])) {
	                            callInvoke(args[2][0]);
	                        } else if (angular.isArray(args[2][0])) {
	                            for (var j = 0, jlen = args[2][0].length; j < jlen; j++) {
	                                if (angular.isFunction(args[2][0][j])) {
	                                    callInvoke(args[2][0][j]);
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }

	        function getModuleName(module) {
	            var moduleName = null;
	            if (angular.isString(module)) {
	                moduleName = module;
	            } else if (angular.isObject(module) && module.hasOwnProperty('name') && angular.isString(module.name)) {
	                moduleName = module.name;
	            }
	            return moduleName;
	        }

	        function moduleExists(moduleName) {
	            if (!angular.isString(moduleName)) {
	                return false;
	            }
	            try {
	                return ngModuleFct(moduleName);
	            } catch (e) {
	                if (/No module/.test(e) || e.message.indexOf('$injector:nomod') > -1) {
	                    return false;
	                }
	            }
	        }

	        this.$get = ["$log", "$rootElement", "$rootScope", "$cacheFactory", "$q", function ($log, $rootElement, $rootScope, $cacheFactory, $q) {
	            var instanceInjector,
	                filesCache = $cacheFactory('ocLazyLoad');

	            if (!debug) {
	                $log = {};
	                $log['error'] = angular.noop;
	                $log['warn'] = angular.noop;
	                $log['info'] = angular.noop;
	            }

	            // Make this lazy because when $get() is called the instance injector hasn't been assigned to the rootElement yet
	            providers.getInstanceInjector = function () {
	                return instanceInjector ? instanceInjector : instanceInjector = $rootElement.data('$injector') || angular.injector();
	            };

	            broadcast = function broadcast(eventName, params) {
	                if (events) {
	                    $rootScope.$broadcast(eventName, params);
	                }
	                if (debug) {
	                    $log.info(eventName, params);
	                }
	            };

	            function reject(e) {
	                var deferred = $q.defer();
	                $log.error(e.message);
	                deferred.reject(e);
	                return deferred.promise;
	            }

	            return {
	                _broadcast: broadcast,

	                _$log: $log,

	                /**
	                 * Returns the files cache used by the loaders to store the files currently loading
	                 * @returns {*}
	                 */
	                _getFilesCache: function getFilesCache() {
	                    return filesCache;
	                },

	                /**
	                 * Let the service know that it should monitor angular.module because files are loading
	                 * @param watch boolean
	                 */
	                toggleWatch: function toggleWatch(watch) {
	                    if (watch) {
	                        recordDeclarations.push(true);
	                    } else {
	                        recordDeclarations.pop();
	                    }
	                },

	                /**
	                 * Let you get a module config object
	                 * @param moduleName String the name of the module
	                 * @returns {*}
	                 */
	                getModuleConfig: function getModuleConfig(moduleName) {
	                    if (!angular.isString(moduleName)) {
	                        throw new Error('You need to give the name of the module to get');
	                    }
	                    if (!modules[moduleName]) {
	                        return null;
	                    }
	                    return angular.copy(modules[moduleName]);
	                },

	                /**
	                 * Let you define a module config object
	                 * @param moduleConfig Object the module config object
	                 * @returns {*}
	                 */
	                setModuleConfig: function setModuleConfig(moduleConfig) {
	                    if (!angular.isObject(moduleConfig)) {
	                        throw new Error('You need to give the module config object to set');
	                    }
	                    modules[moduleConfig.name] = moduleConfig;
	                    return moduleConfig;
	                },

	                /**
	                 * Returns the list of loaded modules
	                 * @returns {string[]}
	                 */
	                getModules: function getModules() {
	                    return regModules;
	                },

	                /**
	                 * Let you check if a module has been loaded into Angular or not
	                 * @param modulesNames String/Object a module name, or a list of module names
	                 * @returns {boolean}
	                 */
	                isLoaded: function isLoaded(modulesNames) {
	                    var moduleLoaded = function moduleLoaded(module) {
	                        var isLoaded = regModules.indexOf(module) > -1;
	                        if (!isLoaded) {
	                            isLoaded = !!moduleExists(module);
	                        }
	                        return isLoaded;
	                    };
	                    if (angular.isString(modulesNames)) {
	                        modulesNames = [modulesNames];
	                    }
	                    if (angular.isArray(modulesNames)) {
	                        var i, len;
	                        for (i = 0, len = modulesNames.length; i < len; i++) {
	                            if (!moduleLoaded(modulesNames[i])) {
	                                return false;
	                            }
	                        }
	                        return true;
	                    } else {
	                        throw new Error('You need to define the module(s) name(s)');
	                    }
	                },

	                /**
	                 * Given a module, return its name
	                 * @param module
	                 * @returns {String}
	                 */
	                _getModuleName: getModuleName,

	                /**
	                 * Returns a module if it exists
	                 * @param moduleName
	                 * @returns {module}
	                 */
	                _getModule: function getModule(moduleName) {
	                    try {
	                        return ngModuleFct(moduleName);
	                    } catch (e) {
	                        // this error message really suxx
	                        if (/No module/.test(e) || e.message.indexOf('$injector:nomod') > -1) {
	                            e.message = 'The module "' + stringify(moduleName) + '" that you are trying to load does not exist. ' + e.message;
	                        }
	                        throw e;
	                    }
	                },

	                /**
	                 * Check if a module exists and returns it if it does
	                 * @param moduleName
	                 * @returns {boolean}
	                 */
	                moduleExists: moduleExists,

	                /**
	                 * Load the dependencies, and might try to load new files depending on the config
	                 * @param moduleName (String or Array of Strings)
	                 * @param localParams
	                 * @returns {*}
	                 * @private
	                 */
	                _loadDependencies: function _loadDependencies(moduleName, localParams) {
	                    var loadedModule,
	                        requires,
	                        diff,
	                        promisesList = [],
	                        self = this;

	                    moduleName = self._getModuleName(moduleName);

	                    if (moduleName === null) {
	                        return $q.when();
	                    } else {
	                        try {
	                            loadedModule = self._getModule(moduleName);
	                        } catch (e) {
	                            return reject(e);
	                        }
	                        // get unloaded requires
	                        requires = self.getRequires(loadedModule);
	                    }

	                    angular.forEach(requires, function (requireEntry) {
	                        // If no configuration is provided, try and find one from a previous load.
	                        // If there isn't one, bail and let the normal flow run
	                        if (angular.isString(requireEntry)) {
	                            var config = self.getModuleConfig(requireEntry);
	                            if (config === null) {
	                                moduleCache.push(requireEntry); // We don't know about this module, but something else might, so push it anyway.
	                                return;
	                            }
	                            requireEntry = config;
	                            // ignore the name because it's probably not a real module name
	                            config.name = undefined;
	                        }

	                        // Check if this dependency has been loaded previously
	                        if (self.moduleExists(requireEntry.name)) {
	                            // compare against the already loaded module to see if the new definition adds any new files
	                            diff = requireEntry.files.filter(function (n) {
	                                return self.getModuleConfig(requireEntry.name).files.indexOf(n) < 0;
	                            });

	                            // If the module was redefined, advise via the console
	                            if (diff.length !== 0) {
	                                self._$log.warn('Module "', moduleName, '" attempted to redefine configuration for dependency. "', requireEntry.name, '"\n Additional Files Loaded:', diff);
	                            }

	                            // Push everything to the file loader, it will weed out the duplicates.
	                            if (angular.isDefined(self.filesLoader)) {
	                                // if a files loader is defined
	                                promisesList.push(self.filesLoader(requireEntry, localParams).then(function () {
	                                    return self._loadDependencies(requireEntry);
	                                }));
	                            } else {
	                                return reject(new Error('Error: New dependencies need to be loaded from external files (' + requireEntry.files + '), but no loader has been defined.'));
	                            }
	                            return;
	                        } else if (angular.isArray(requireEntry)) {
	                            var files = [];
	                            angular.forEach(requireEntry, function (entry) {
	                                // let's check if the entry is a file name or a config name
	                                var config = self.getModuleConfig(entry);
	                                if (config === null) {
	                                    files.push(entry);
	                                } else if (config.files) {
	                                    files = files.concat(config.files);
	                                }
	                            });
	                            if (files.length > 0) {
	                                requireEntry = {
	                                    files: files
	                                };
	                            }
	                        } else if (angular.isObject(requireEntry)) {
	                            if (requireEntry.hasOwnProperty('name') && requireEntry['name']) {
	                                // The dependency doesn't exist in the module cache and is a new configuration, so store and push it.
	                                self.setModuleConfig(requireEntry);
	                                moduleCache.push(requireEntry['name']);
	                            }
	                        }

	                        // Check if the dependency has any files that need to be loaded. If there are, push a new promise to the promise list.
	                        if (angular.isDefined(requireEntry.files) && requireEntry.files.length !== 0) {
	                            if (angular.isDefined(self.filesLoader)) {
	                                // if a files loader is defined
	                                promisesList.push(self.filesLoader(requireEntry, localParams).then(function () {
	                                    return self._loadDependencies(requireEntry);
	                                }));
	                            } else {
	                                return reject(new Error('Error: the module "' + requireEntry.name + '" is defined in external files (' + requireEntry.files + '), but no loader has been defined.'));
	                            }
	                        }
	                    });

	                    // Create a wrapper promise to watch the promise list and resolve it once everything is done.
	                    return $q.all(promisesList);
	                },

	                /**
	                 * Inject new modules into Angular
	                 * @param moduleName
	                 * @param localParams
	                 * @param real
	                 */
	                inject: function inject(moduleName) {
	                    var localParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	                    var real = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	                    var self = this,
	                        deferred = $q.defer();
	                    if (angular.isDefined(moduleName) && moduleName !== null) {
	                        if (angular.isArray(moduleName)) {
	                            var promisesList = [];
	                            angular.forEach(moduleName, function (module) {
	                                promisesList.push(self.inject(module, localParams, real));
	                            });
	                            return $q.all(promisesList);
	                        } else {
	                            self._addToLoadList(self._getModuleName(moduleName), true, real);
	                        }
	                    }
	                    if (modulesToLoad.length > 0) {
	                        var res = modulesToLoad.slice(); // clean copy
	                        var loadNext = function loadNext(moduleName) {
	                            moduleCache.push(moduleName);
	                            modulePromises[moduleName] = deferred.promise;
	                            self._loadDependencies(moduleName, localParams).then(function success() {
	                                try {
	                                    justLoaded = [];
	                                    _register(providers, moduleCache, localParams);
	                                } catch (e) {
	                                    self._$log.error(e.message);
	                                    deferred.reject(e);
	                                    return;
	                                }

	                                if (modulesToLoad.length > 0) {
	                                    loadNext(modulesToLoad.shift()); // load the next in list
	                                } else {
	                                        deferred.resolve(res); // everything has been loaded, resolve
	                                    }
	                            }, function error(err) {
	                                deferred.reject(err);
	                            });
	                        };

	                        // load the first in list
	                        loadNext(modulesToLoad.shift());
	                    } else if (localParams && localParams.name && modulePromises[localParams.name]) {
	                        return modulePromises[localParams.name];
	                    } else {
	                        deferred.resolve();
	                    }
	                    return deferred.promise;
	                },

	                /**
	                 * Get the list of required modules/services/... for this module
	                 * @param module
	                 * @returns {Array}
	                 */
	                getRequires: function getRequires(module) {
	                    var requires = [];
	                    angular.forEach(module.requires, function (requireModule) {
	                        if (regModules.indexOf(requireModule) === -1) {
	                            requires.push(requireModule);
	                        }
	                    });
	                    return requires;
	                },

	                /**
	                 * Invoke the new modules & component by their providers
	                 * @param providers
	                 * @param queue
	                 * @param moduleName
	                 * @param reconfig
	                 * @private
	                 */
	                _invokeQueue: _invokeQueue,

	                /**
	                 * Check if a module has been invoked and registers it if not
	                 * @param args
	                 * @param moduleName
	                 * @returns {boolean} is new
	                 */
	                _registerInvokeList: _registerInvokeList,

	                /**
	                 * Register a new module and loads it, executing the run/config blocks if needed
	                 * @param providers
	                 * @param registerModules
	                 * @param params
	                 * @private
	                 */
	                _register: _register,

	                /**
	                 * Add a module name to the list of modules that will be loaded in the next inject
	                 * @param name
	                 * @param force
	                 * @private
	                 */
	                _addToLoadList: _addToLoadList
	            };
	        }];

	        // Let's get the list of loaded modules & components
	        this._init(angular.element(window.document));
	    }]);

	    var bootstrapFct = angular.bootstrap;
	    angular.bootstrap = function (element, modules, config) {
	        // we use slice to make a clean copy
	        angular.forEach(modules.slice(), function (module) {
	            _addToLoadList(module, true, true);
	        });
	        return bootstrapFct(element, modules, config);
	    };

	    var _addToLoadList = function _addToLoadList(name, force, real) {
	        if ((recordDeclarations.length > 0 || force) && angular.isString(name) && modulesToLoad.indexOf(name) === -1) {
	            modulesToLoad.push(name);
	            if (real) {
	                realModules.push(name);
	            }
	        }
	    };

	    var ngModuleFct = angular.module;
	    angular.module = function (name, requires, configFn) {
	        _addToLoadList(name, false, true);
	        return ngModuleFct(name, requires, configFn);
	    };

	    // CommonJS package manager support:
	    if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
	        module.exports = 'oc.lazyLoad';
	    }
	})(angular, window);
	(function (angular) {
	    'use strict';

	    angular.module('oc.lazyLoad').directive('ocLazyLoad', ["$ocLazyLoad", "$compile", "$animate", "$parse", "$timeout", function ($ocLazyLoad, $compile, $animate, $parse, $timeout) {
	        return {
	            restrict: 'A',
	            terminal: true,
	            priority: 1000,
	            compile: function compile(element, attrs) {
	                // we store the content and remove it before compilation
	                var content = element[0].innerHTML;
	                element.html('');

	                return function ($scope, $element, $attr) {
	                    var model = $parse($attr.ocLazyLoad);
	                    $scope.$watch(function () {
	                        return model($scope) || $attr.ocLazyLoad; // it can be a module name (string), an object, an array, or a scope reference to any of this
	                    }, function (moduleName) {
	                        if (angular.isDefined(moduleName)) {
	                            $ocLazyLoad.load(moduleName).then(function () {
	                                // Attach element contents to DOM and then compile them.
	                                // This prevents an issue where IE invalidates saved element objects (HTMLCollections)
	                                // of the compiled contents when attaching to the parent DOM.
	                                $animate.enter(content, $element);
	                                // get the new content & compile it
	                                $compile($element.contents())($scope);
	                            });
	                        }
	                    }, true);
	                };
	            }
	        };
	    }]);
	})(angular);
	(function (angular) {
	    'use strict';

	    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
	        $provide.decorator('$ocLazyLoad', ["$delegate", "$q", "$window", "$interval", function ($delegate, $q, $window, $interval) {
	            var uaCssChecked = false,
	                useCssLoadPatch = false,
	                anchor = $window.document.getElementsByTagName('head')[0] || $window.document.getElementsByTagName('body')[0];

	            /**
	             * Load a js/css file
	             * @param type
	             * @param path
	             * @param params
	             * @returns promise
	             */
	            $delegate.buildElement = function buildElement(type, path, params) {
	                var deferred = $q.defer(),
	                    el,
	                    loaded,
	                    filesCache = $delegate._getFilesCache(),
	                    cacheBuster = function cacheBuster(url) {
	                    var dc = new Date().getTime();
	                    if (url.indexOf('?') >= 0) {
	                        if (url.substring(0, url.length - 1) === '&') {
	                            return url + '_dc=' + dc;
	                        }
	                        return url + '&_dc=' + dc;
	                    } else {
	                        return url + '?_dc=' + dc;
	                    }
	                };

	                // Store the promise early so the file load can be detected by other parallel lazy loads
	                // (ie: multiple routes on one page) a 'true' value isn't sufficient
	                // as it causes false positive load results.
	                if (angular.isUndefined(filesCache.get(path))) {
	                    filesCache.put(path, deferred.promise);
	                }

	                // Switch in case more content types are added later
	                switch (type) {
	                    case 'css':
	                        el = $window.document.createElement('link');
	                        el.type = 'text/css';
	                        el.rel = 'stylesheet';
	                        el.href = params.cache === false ? cacheBuster(path) : path;
	                        break;
	                    case 'js':
	                        el = $window.document.createElement('script');
	                        el.src = params.cache === false ? cacheBuster(path) : path;
	                        break;
	                    default:
	                        filesCache.remove(path);
	                        deferred.reject(new Error('Requested type "' + type + '" is not known. Could not inject "' + path + '"'));
	                        break;
	                }
	                el.onload = el['onreadystatechange'] = function (e) {
	                    if (el['readyState'] && !/^c|loade/.test(el['readyState']) || loaded) return;
	                    el.onload = el['onreadystatechange'] = null;
	                    loaded = 1;
	                    $delegate._broadcast('ocLazyLoad.fileLoaded', path);
	                    deferred.resolve();
	                };
	                el.onerror = function () {
	                    filesCache.remove(path);
	                    deferred.reject(new Error('Unable to load ' + path));
	                };
	                el.async = params.serie ? 0 : 1;

	                var insertBeforeElem = anchor.lastChild;
	                if (params.insertBefore) {
	                    var element = angular.element(angular.isDefined(window.jQuery) ? params.insertBefore : document.querySelector(params.insertBefore));
	                    if (element && element.length > 0) {
	                        insertBeforeElem = element[0];
	                    }
	                }
	                insertBeforeElem.parentNode.insertBefore(el, insertBeforeElem);

	                /*
	                 The event load or readystatechange doesn't fire in:
	                 - iOS < 6       (default mobile browser)
	                 - Android < 4.4 (default mobile browser)
	                 - Safari < 6    (desktop browser)
	                 */
	                if (type == 'css') {
	                    if (!uaCssChecked) {
	                        var ua = $window.navigator.userAgent.toLowerCase();

	                        // iOS < 6
	                        if (/iP(hone|od|ad)/.test($window.navigator.platform)) {
	                            var v = $window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
	                            var iOSVersion = parseFloat([parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)].join('.'));
	                            useCssLoadPatch = iOSVersion < 6;
	                        } else if (ua.indexOf("android") > -1) {
	                            // Android < 4.4
	                            var androidVersion = parseFloat(ua.slice(ua.indexOf("android") + 8));
	                            useCssLoadPatch = androidVersion < 4.4;
	                        } else if (ua.indexOf('safari') > -1) {
	                            var versionMatch = ua.match(/version\/([\.\d]+)/i);
	                            useCssLoadPatch = versionMatch && versionMatch[1] && parseFloat(versionMatch[1]) < 6;
	                        }
	                    }

	                    if (useCssLoadPatch) {
	                        var tries = 1000; // * 20 = 20000 miliseconds
	                        var interval = $interval(function () {
	                            try {
	                                el.sheet.cssRules;
	                                $interval.cancel(interval);
	                                el.onload();
	                            } catch (e) {
	                                if (--tries <= 0) {
	                                    el.onerror();
	                                }
	                            }
	                        }, 20);
	                    }
	                }

	                return deferred.promise;
	            };

	            return $delegate;
	        }]);
	    }]);
	})(angular);
	(function (angular) {
	    'use strict';

	    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
	        $provide.decorator('$ocLazyLoad', ["$delegate", "$q", function ($delegate, $q) {
	            /**
	             * The function that loads new files
	             * @param config
	             * @param params
	             * @returns {*}
	             */
	            $delegate.filesLoader = function filesLoader(config) {
	                var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	                var cssFiles = [],
	                    templatesFiles = [],
	                    jsFiles = [],
	                    promises = [],
	                    cachePromise = null,
	                    filesCache = $delegate._getFilesCache();

	                $delegate.toggleWatch(true); // start watching angular.module calls

	                angular.extend(params, config);

	                var pushFile = function pushFile(path) {
	                    var file_type = null,
	                        m;
	                    if (angular.isObject(path)) {
	                        file_type = path.type;
	                        path = path.path;
	                    }
	                    cachePromise = filesCache.get(path);
	                    if (angular.isUndefined(cachePromise) || params.cache === false) {

	                        // always check for requirejs syntax just in case
	                        if ((m = /^(css|less|html|htm|js)?(?=!)/.exec(path)) !== null) {
	                            // Detect file type using preceding type declaration (ala requireJS)
	                            file_type = m[1];
	                            path = path.substr(m[1].length + 1, path.length); // Strip the type from the path
	                        }

	                        if (!file_type) {
	                            if ((m = /[.](css|less|html|htm|js)?((\?|#).*)?$/.exec(path)) !== null) {
	                                // Detect file type via file extension
	                                file_type = m[1];
	                            } else if (!$delegate.jsLoader.hasOwnProperty('ocLazyLoadLoader') && $delegate.jsLoader.hasOwnProperty('requirejs')) {
	                                // requirejs
	                                file_type = 'js';
	                            } else {
	                                $delegate._$log.error('File type could not be determined. ' + path);
	                                return;
	                            }
	                        }

	                        if ((file_type === 'css' || file_type === 'less') && cssFiles.indexOf(path) === -1) {
	                            cssFiles.push(path);
	                        } else if ((file_type === 'html' || file_type === 'htm') && templatesFiles.indexOf(path) === -1) {
	                            templatesFiles.push(path);
	                        } else if (file_type === 'js' || jsFiles.indexOf(path) === -1) {
	                            jsFiles.push(path);
	                        } else {
	                            $delegate._$log.error('File type is not valid. ' + path);
	                        }
	                    } else if (cachePromise) {
	                        promises.push(cachePromise);
	                    }
	                };

	                if (params.serie) {
	                    pushFile(params.files.shift());
	                } else {
	                    angular.forEach(params.files, function (path) {
	                        pushFile(path);
	                    });
	                }

	                if (cssFiles.length > 0) {
	                    var cssDeferred = $q.defer();
	                    $delegate.cssLoader(cssFiles, function (err) {
	                        if (angular.isDefined(err) && $delegate.cssLoader.hasOwnProperty('ocLazyLoadLoader')) {
	                            $delegate._$log.error(err);
	                            cssDeferred.reject(err);
	                        } else {
	                            cssDeferred.resolve();
	                        }
	                    }, params);
	                    promises.push(cssDeferred.promise);
	                }

	                if (templatesFiles.length > 0) {
	                    var templatesDeferred = $q.defer();
	                    $delegate.templatesLoader(templatesFiles, function (err) {
	                        if (angular.isDefined(err) && $delegate.templatesLoader.hasOwnProperty('ocLazyLoadLoader')) {
	                            $delegate._$log.error(err);
	                            templatesDeferred.reject(err);
	                        } else {
	                            templatesDeferred.resolve();
	                        }
	                    }, params);
	                    promises.push(templatesDeferred.promise);
	                }

	                if (jsFiles.length > 0) {
	                    var jsDeferred = $q.defer();
	                    $delegate.jsLoader(jsFiles, function (err) {
	                        if (angular.isDefined(err) && ($delegate.jsLoader.hasOwnProperty("ocLazyLoadLoader") || $delegate.jsLoader.hasOwnProperty("requirejs"))) {
	                            $delegate._$log.error(err);
	                            jsDeferred.reject(err);
	                        } else {
	                            jsDeferred.resolve();
	                        }
	                    }, params);
	                    promises.push(jsDeferred.promise);
	                }

	                if (promises.length === 0) {
	                    var deferred = $q.defer(),
	                        err = "Error: no file to load has been found, if you're trying to load an existing module you should use the 'inject' method instead of 'load'.";
	                    $delegate._$log.error(err);
	                    deferred.reject(err);
	                    return deferred.promise;
	                } else if (params.serie && params.files.length > 0) {
	                    return $q.all(promises).then(function () {
	                        return $delegate.filesLoader(config, params);
	                    });
	                } else {
	                    return $q.all(promises)['finally'](function (res) {
	                        $delegate.toggleWatch(false); // stop watching angular.module calls
	                        return res;
	                    });
	                }
	            };

	            /**
	             * Load a module or a list of modules into Angular
	             * @param module Mixed the name of a predefined module config object, or a module config object, or an array of either
	             * @param params Object optional parameters
	             * @returns promise
	             */
	            $delegate.load = function (originalModule) {
	                var originalParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	                var self = this,
	                    config = null,
	                    deferredList = [],
	                    deferred = $q.defer(),
	                    errText;

	                // clean copy
	                var module = angular.copy(originalModule);
	                var params = angular.copy(originalParams);

	                // If module is an array, break it down
	                if (angular.isArray(module)) {
	                    // Resubmit each entry as a single module
	                    angular.forEach(module, function (m) {
	                        deferredList.push(self.load(m, params));
	                    });

	                    // Resolve the promise once everything has loaded
	                    $q.all(deferredList).then(function (res) {
	                        deferred.resolve(res);
	                    }, function (err) {
	                        deferred.reject(err);
	                    });

	                    return deferred.promise;
	                }

	                // Get or Set a configuration depending on what was passed in
	                if (angular.isString(module)) {
	                    config = self.getModuleConfig(module);
	                    if (!config) {
	                        config = {
	                            files: [module]
	                        };
	                    }
	                } else if (angular.isObject(module)) {
	                    // case {type: 'js', path: lazyLoadUrl + 'testModule.fakejs'}
	                    if (angular.isDefined(module.path) && angular.isDefined(module.type)) {
	                        config = {
	                            files: [module]
	                        };
	                    } else {
	                        config = self.setModuleConfig(module);
	                    }
	                }

	                if (config === null) {
	                    var moduleName = self._getModuleName(module);
	                    errText = 'Module "' + (moduleName || 'unknown') + '" is not configured, cannot load.';
	                    $delegate._$log.error(errText);
	                    deferred.reject(new Error(errText));
	                    return deferred.promise;
	                } else {
	                    // deprecated
	                    if (angular.isDefined(config.template)) {
	                        if (angular.isUndefined(config.files)) {
	                            config.files = [];
	                        }
	                        if (angular.isString(config.template)) {
	                            config.files.push(config.template);
	                        } else if (angular.isArray(config.template)) {
	                            config.files.concat(config.template);
	                        }
	                    }
	                }

	                var localParams = angular.extend({}, params, config);

	                // if someone used an external loader and called the load function with just the module name
	                if (angular.isUndefined(config.files) && angular.isDefined(config.name) && $delegate.moduleExists(config.name)) {
	                    return $delegate.inject(config.name, localParams, true);
	                }

	                $delegate.filesLoader(config, localParams).then(function () {
	                    $delegate.inject(null, localParams).then(function (res) {
	                        deferred.resolve(res);
	                    }, function (err) {
	                        deferred.reject(err);
	                    });
	                }, function (err) {
	                    deferred.reject(err);
	                });

	                return deferred.promise;
	            };

	            // return the patched service
	            return $delegate;
	        }]);
	    }]);
	})(angular);
	(function (angular) {
	    'use strict';

	    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
	        $provide.decorator('$ocLazyLoad', ["$delegate", "$q", function ($delegate, $q) {
	            /**
	             * cssLoader function
	             * @type Function
	             * @param paths array list of css files to load
	             * @param callback to call when everything is loaded. We use a callback and not a promise
	             * @param params object config parameters
	             * because the user can overwrite cssLoader and it will probably not use promises :(
	             */
	            $delegate.cssLoader = function (paths, callback, params) {
	                var promises = [];
	                angular.forEach(paths, function (path) {
	                    promises.push($delegate.buildElement('css', path, params));
	                });
	                $q.all(promises).then(function () {
	                    callback();
	                }, function (err) {
	                    callback(err);
	                });
	            };
	            $delegate.cssLoader.ocLazyLoadLoader = true;

	            return $delegate;
	        }]);
	    }]);
	})(angular);
	(function (angular) {
	    'use strict';

	    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
	        $provide.decorator('$ocLazyLoad', ["$delegate", "$q", function ($delegate, $q) {
	            /**
	             * jsLoader function
	             * @type Function
	             * @param paths array list of js files to load
	             * @param callback to call when everything is loaded. We use a callback and not a promise
	             * @param params object config parameters
	             * because the user can overwrite jsLoader and it will probably not use promises :(
	             */
	            $delegate.jsLoader = function (paths, callback, params) {
	                var promises = [];
	                angular.forEach(paths, function (path) {
	                    promises.push($delegate.buildElement('js', path, params));
	                });
	                $q.all(promises).then(function () {
	                    callback();
	                }, function (err) {
	                    callback(err);
	                });
	            };
	            $delegate.jsLoader.ocLazyLoadLoader = true;

	            return $delegate;
	        }]);
	    }]);
	})(angular);
	(function (angular) {
	    'use strict';

	    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
	        $provide.decorator('$ocLazyLoad', ["$delegate", "$templateCache", "$q", "$http", function ($delegate, $templateCache, $q, $http) {
	            /**
	             * templatesLoader function
	             * @type Function
	             * @param paths array list of css files to load
	             * @param callback to call when everything is loaded. We use a callback and not a promise
	             * @param params object config parameters for $http
	             * because the user can overwrite templatesLoader and it will probably not use promises :(
	             */
	            $delegate.templatesLoader = function (paths, callback, params) {
	                var promises = [],
	                    filesCache = $delegate._getFilesCache();

	                angular.forEach(paths, function (url) {
	                    var deferred = $q.defer();
	                    promises.push(deferred.promise);
	                    $http.get(url, params).success(function (data) {
	                        if (angular.isString(data) && data.length > 0) {
	                            angular.forEach(angular.element(data), function (node) {
	                                if (node.nodeName === 'SCRIPT' && node.type === 'text/ng-template') {
	                                    $templateCache.put(node.id, node.innerHTML);
	                                }
	                            });
	                        }
	                        if (angular.isUndefined(filesCache.get(url))) {
	                            filesCache.put(url, true);
	                        }
	                        deferred.resolve();
	                    }).error(function (err) {
	                        deferred.reject(new Error('Unable to load template file "' + url + '": ' + err));
	                    });
	                });
	                return $q.all(promises).then(function () {
	                    callback();
	                }, function (err) {
	                    callback(err);
	                });
	            };
	            $delegate.templatesLoader.ocLazyLoadLoader = true;

	            return $delegate;
	        }]);
	    }]);
	})(angular);
	// Array.indexOf polyfill for IE8
	if (!Array.prototype.indexOf) {
	        Array.prototype.indexOf = function (searchElement, fromIndex) {
	                var k;

	                // 1. Let O be the result of calling ToObject passing
	                //    the this value as the argument.
	                if (this == null) {
	                        throw new TypeError('"this" is null or not defined');
	                }

	                var O = Object(this);

	                // 2. Let lenValue be the result of calling the Get
	                //    internal method of O with the argument "length".
	                // 3. Let len be ToUint32(lenValue).
	                var len = O.length >>> 0;

	                // 4. If len is 0, return -1.
	                if (len === 0) {
	                        return -1;
	                }

	                // 5. If argument fromIndex was passed let n be
	                //    ToInteger(fromIndex); else let n be 0.
	                var n = +fromIndex || 0;

	                if (Math.abs(n) === Infinity) {
	                        n = 0;
	                }

	                // 6. If n >= len, return -1.
	                if (n >= len) {
	                        return -1;
	                }

	                // 7. If n >= 0, then Let k be n.
	                // 8. Else, n<0, Let k be len - abs(n).
	                //    If k is less than 0, then let k be 0.
	                k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

	                // 9. Repeat, while k < len
	                while (k < len) {
	                        // a. Let Pk be ToString(k).
	                        //   This is implicit for LHS operands of the in operator
	                        // b. Let kPresent be the result of calling the
	                        //    HasProperty internal method of O with argument Pk.
	                        //   This step can be combined with c
	                        // c. If kPresent is true, then
	                        //    i.  Let elementK be the result of calling the Get
	                        //        internal method of O with the argument ToString(k).
	                        //   ii.  Let same be the result of applying the
	                        //        Strict Equality Comparison Algorithm to
	                        //        searchElement and elementK.
	                        //  iii.  If same is true, return k.
	                        if (k in O && O[k] === searchElement) {
	                                return k;
	                        }
	                        k++;
	                }
	                return -1;
	        };
	}

/***/ }
/******/ ]);