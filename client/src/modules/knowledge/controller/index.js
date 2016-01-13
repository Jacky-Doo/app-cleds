'use strict';

module.exports = ['$scope', 'Sprite', 'dcTypeModel', '$state',
  function($scope, Sprite, dcTypeModel, $state){
    $scope.type = dcTypeModel;
    $scope.type.getTypes();
    $state.go('knowledge.dcUpload');
  }
]