'use strict';

module.exports = ['$scope', 'Sprite', 'modelModel', '$state', '$rootScope',
  function($scope, Sprite, modelModel, $state, $rootScope){
    $state.go('custom.home');
  }
]