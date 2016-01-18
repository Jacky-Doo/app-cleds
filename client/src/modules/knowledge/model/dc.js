'use strict';

module.exports = ['$http', '$q', 'Constant', '$resource', function($http, $q, Constant, $resource){

  var dcsRsc = $resource(
    Constant.baseUrl + '/knowledge/dcs/:typeId',
    {typeId: '@typeId'}
  );
  var dcRsc = $resource(
    Constant.baseUrl + '/knowledge/dc/:id',
    {typeId: '@id'}
  );

  var dcModel = {
    item: {},
    collection: [],
    getDcs: function(typeId, pageId, pageSize){
      var d = $q.defer();
      dcsRsc.get({typeId: typeId, pageId: pageId, pageSize: pageSize}, function(res){
        dcModel.collection = [];
        if(res.code == 200 && res.data){
          res.data.dcs.forEach(function(item){
            dcModel.collection.push(item);
          });
        }
        d.resolve(res);
      }), function(err){
        d.reject(err);
      }
      return d.promise;
    },
    addDc: function(item){
      var d = $q.defer();
      dcRsc.save({}, {dc: item}, function(res){
        d.resolve(res);
      }, function(err){
        d.reject(err);
      });
      return d.promise;
    },
    getDcFile: function(path){
      window.open(Constant.baseUrl + '/file/' + path, '_blank', '');
    },
    findItemById: function(id){
      for(var i=0; i<this.collection.length; i++){
        if(this.collection[i]._id == id) return this.collection[i];
      }
    }
  }

  return dcModel;
}]