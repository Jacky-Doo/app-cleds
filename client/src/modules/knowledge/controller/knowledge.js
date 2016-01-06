'use strict';

module.exports = ['$scope', 'Sprite', 'KnowledgeType', '$state',
  function($scope, Sprite, KnowledgeType, $state){
    $scope.type = KnowledgeType;
    $scope.type.getTypes();
    $state.go('knowledge.upload');
  }
]