'use strict';

require('./style/home.less');

var homeController = require('./controller/home');
var customNavController = require('./controller/customNav');

angular.module('home', ['ngMaterial']);

angular.module('home')
  .controller('HomeController', customNavController)
  .controller('CustomNavController', customNavController)

module.exports = angular.module('home');