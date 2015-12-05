'use strict';

module.exports = ['$http', '$q', 'Constant', function($http, $q, Constant){
  function KnowledgeTypes(typesData){
    if(typesData){
      this.set(typesData)
    }
  }
  KnowledgeTypes.prototype = {
    set: function(typesData){
      angular.extend(this, typesData);
    },
    //获取文档类型
    getTypes: function(){
      var scope = this;
      var d = $q.defer();
      $http({
        method: 'GET',
        url: Constant.baseUrl + '/knowledge/types',
      }).success(function(res){
        if(res.code == 200){
          scope.set({types: res.data.types});
        } else {
          console.log('types 出错了～');
        }
        d.resolve(res);
      }).error(function(err){
        console.log(err);
        d.reject(err);
      })
      return d.promise;
    },
    //添加文档类型
    addType: function(typeData){
      var d = $q.defer();
      $http({
        method: 'POST',
        url: Constant.baseUrl + '/knowledge/types',
        data: typeData,
      }).success(function(res){
        d.resolve(res);
      }).error(function(err){
        d.reject(err);
      });
      return d.promise;
    }
  }

  return KnowledgeTypes;
}];
