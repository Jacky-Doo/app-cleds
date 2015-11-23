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