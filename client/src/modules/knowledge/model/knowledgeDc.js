'use strict';

module.exports = ['$http', '$q', 'Constant', '$resource', function($http, $q, Constant, $resource){

  var knowledgeDcRsc = $resource(
    Constant.baseUrl + '/knowledge/dcs/:typeId',
    {typeId: '@typeId'}
  );

  function saveFilter(item){
    return {
      title: item.title,
      _type: parseType(item._type),
      keys: item.keys,
      desc: item.desc,
      name: item.name,
      size: item.size,
      mimeType: item.mimeType,
      path: item.path
    }
  }
  function parseType(type){
    if(typeof type == 'string'){
      return JSON.parse(type);
    } else{
      return type;
    }
  }

  var KnowledgeDc = {
    item: {},
    collection: [],
    getDcs: function(typeId, pageId, pageSize){
      var d = $q.defer();
      knowledgeDcRsc.get({typeId: typeId, pageId: pageId, pageSize: pageSize}, function(res){
        KnowledgeDc.collection = [];
        if(res.data){
          res.data.dcs.forEach(function(item){
            KnowledgeDc.collection.push(item);
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
      var data = saveFilter(item);
      knowledgeDcRsc.save({}, {dc: data}, function(res){
        d.resolve(res);
      }, function(err){
        d.reject(err);
      });
      return d.promise;
    },
    getDcFile: function(id){
      window.open(Constant.baseUrl + '/knowledge/dc/file/' + id, '_blank', '');
    },
    updateDc: function(item){
      var d = $q.defer();
      var data = saveFilter(item);
      knowledgeDcRsc.put({}, {dc: data}, function(res){
        d.resolve(res);
      }, function(err){
        d.reject(err);
      });
      return d.promise;
    },
    findItemById: function(id){
      for(var i=0; i<this.collection.length; i++){
        if(this.collection[i]._id == id) return this.collection[i];
      }
    }
  }

  return KnowledgeDc;
}]