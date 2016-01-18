'use strict';

module.exports = ['$q', 'Constant', '$resource', function($q, Constant, $resource){

  var kTypeRsc = $resource(Constant.baseUrl + '/knowledge/types');

  var kTypeModel = {
    item: {},
    collection: [],
    getTypes: function(){
      var d = $q.defer();
      kTypeRsc.get(function(res){
        kTypeModel.collection = res.data.types;
        d.resolve(res);
      }, function(err){
        d.reject(err);
      });
      return d.promise;
    },
    findTypeById: function(id){
      for(var i = 0; i < this.collection.length; i++) {
        if (id == this.collection[i].id) {
          return this.collection[i];
        }
      }
    }
  };

  return kTypeModel;
}];
