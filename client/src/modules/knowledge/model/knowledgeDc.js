'use strict';

module.exports = ['$http', 'constant', function($http, constant){
  function KnowledgeDc(data){
   if(data){
     this.setData(data);
   }
  }
  KnowledgeDc.prototype = {
    setData: function(data){
      angular.extend(this, data);
    },
    get: function(){
      $http({
        method: 'JSONP',
        url: constant.baseUrl + '/konwledge/dc'
      })
    }
  }
  return KnowledgeDc;
}]