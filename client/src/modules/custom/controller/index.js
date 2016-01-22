'use strict';

module.exports = ['$scope', 'Sprite', 'modelModel', '$state', '$rootScope',
  function($scope, Sprite, modelModel, $state, $rootScope){
    //$state.go('custom.home')
    console.log($rootScope.path);
    $rootScope.$on('$routeChangeSuccess', function(newV) {
      console.log($rootScope.path);
    });
  }
]