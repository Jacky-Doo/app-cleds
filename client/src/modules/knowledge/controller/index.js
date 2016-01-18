'use strict';

module.exports = ['$scope', 'Sprite', 'kTypeModel', '$state',
  function($scope, Sprite, kTypeModel, $state){
    $scope.type = kTypeModel;
    $scope.type.getTypes();
    $state.go('knowledge.dcManage');
  }
]