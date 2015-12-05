'use strict';

module.exports = ['$http', '$q', 'Constant', function($http, $q, Constant){
  function KnowledgeDc(dcData){
   if(dcData){
     this.setData(dcData);
   }
  }
  KnowledgeDc.prototype = {
    setData: function(dcData){
      angular.extend(this, dcData);
    },
    getDcs: function(){
      var d = $q.defer();
      var scope =this;
      $http({
        method: 'GET',
        url: Constant.baseUrl + '/konwledge/dc',
      }).success(function(res){
        var dcData = res.data.dcData;
        scope.setData({dcData: dcData});
        d.resolve(res);
      }).error(function(err){
        console.log(err);
        d.reject(err);
      });
      return d.promise;
    },
    addDc: function(dcData){
      var d = $q.defer();
      $http({
        method: 'POST',
        url: Constant.baseUrl + '/knowledge/dc',
        data: dcData
      }).success(function(res){
        d.resolve(res);
      }).error(function(err){
        d.reject(err);
      });
      return d.promise;
    }
  }
  return KnowledgeDc;
}]