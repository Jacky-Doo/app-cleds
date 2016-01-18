'use strict';

module.exports = ['$http', '$q', 'Constant', '$resource', function($http, $q, Constant, $resource){
  var partRsc = $resource(
    Constant.baseUrl + '/knowledge/part/:id',
    {id: '@id',}
  );
  var partsRsc = $resource(
    Constant.baseUrl + '/knowledge/parts/:typeId',
    {typeId: '@typeId'}
  )

  var partModel = {
    item: {},
    collection: [],

    getParts: function(typeId, pageId, pageSize){
      var d = $q.defer();
      partsRsc.get({typeId: typeId, pageId: pageId, pageSize: pageSize}, function(res){
        partModel.collection = [];
        if(res.data){
          res.data.parts.forEach(function(item){
            partModel.collection.push(item);
          });
        }
        d.resolve(res);
      }), function(err){
        d.reject(err);
      }
      return d.promise;
    },

    addPart: function(item){
      var d = $q.defer();
      console.log(item);
      partRsc.save({}, {part: item}, function(res){
        d.resolve(res);
      }, function(err){
        d.reject(err);
      });
      return d.promise;
    },
  }

  return partModel;
}]