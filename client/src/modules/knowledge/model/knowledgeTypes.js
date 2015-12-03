'use strict';


module.exports = ['$http', 'constant', function($http, constant){
  function KnowledgeTypes(typesData){
    if(typesData){
      this.set(typesData)
    }
  }
  KnowledgeTypes.prototype = {
    set: function(typesData){
      angular.extend(this, typesData);
    },
    get: function(cb){
      var scope = this;
      $http({
        method: 'JSONP',
        url: constant.baseUrl + '/knowledge/types?callback=JSON_CALLBACK',
      }).success(function(data){
        scope.set(data);
        cb(data);
      })
    }
  }

  return KnowledgeTypes;
}];
