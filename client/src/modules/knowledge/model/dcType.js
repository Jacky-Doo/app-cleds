'use strict';

module.exports = ['$q', 'Constant', '$resource', function($q, Constant, $resource){

  var dcTypeRsc = $resource(Constant.baseUrl + '/knowledge/types/:typeId', {typeId: '@typeId'});

  var dcTypeModel = {
    item: {},
    collection: [],
    getTypes: function(){
      var d = $q.defer();
      dcTypeRsc.get(function(res){
        dcTypeModel.collection = res.data.types;
        d.resolve(res);
      }, function(err){
        d.reject(err);
      });
      return d.promise;
    },
    addType: function(){
      dcTypeRsc.save({}, {type: dcTypeModel.item}, function(res){
      }, function(err){
        console.log(err);
      });
    },
    findTypeById: function(id){
      for(var i = 0; i < this.collection.length; i++) {
        if (id == this.collection[i]._id) {
          return this.collection[i];
        }
      }
    }
  };

  return dcTypeModel;
}];
