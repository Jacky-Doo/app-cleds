'use strict';

module.exports = ['$q', 'Constant', '$resource', function($q, Constant, $resource){

  var knowledgeTypeRsc = $resource(Constant.baseUrl + '/knowledge/types/:typeId', {typeId: '@typeId'});

  var KnowledgeType = {
    item: {},
    collection: [],
    getTypes: function(){
      var d = $q.defer();
      knowledgeTypeRsc.get(function(res){
        KnowledgeType.collection = res.data.types;
        d.resolve(res);
      }, function(err){
        d.reject(err);
      });
      return d.promise;
    },
    addType: function(){
      knowledgeTypeRsc.save({}, {type: KnowledgeType.item}, function(res){
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

  return KnowledgeType;
}];
