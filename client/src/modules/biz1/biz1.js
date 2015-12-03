'use strict';

var biz1Controller = require('./controller/biz1.controller.js');

angular.module('biz1', []);

angular.module('biz1')
  .config(['$stateProvider',
    function($stateProvider){
      $stateProvider
        .state('biz1.main', {
          url: '/main',
          template: '<p>bizq.main</p>'
        })
    }
  ])
  .controller('Biz1Controller', biz1Controller)

module.exports = angular.module('biz1');