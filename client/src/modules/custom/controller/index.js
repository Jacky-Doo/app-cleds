'use strict';

module.exports = ['$scope', 'Sprite', 'modelModel', '$state',
  function($scope, Sprite, modelModel, $state){
    $state.go('custom.home');
  }
]