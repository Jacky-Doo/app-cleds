'use strict';

module.exports = ['$http', '$q', 'Constant', '$resource', function($http, $q, Constant, $resource){
  var modelRsc = $resource(Constant.baseUrl + '/knowledge/model/');
  var modelsRsc = $resource(Constant.baseUrl + '/knowledge/models');
  var modelDealsRsc = $resource(Constant.baseUrl + '/knowledge/modeldeals');

  var modelModel = {
    item: {},
    collection: [],

    getModels: function(typeId, pageId, pageSize){
      var d = $q.defer();
      modelsRsc.get({typeId: typeId, pageId: pageId, pageSize: pageSize}, function(res){
        modelModel.collection = [];
        if(res.data){
          res.data.models.forEach(function(item){
            modelModel.collection.push(item);
          });
        }
        d.resolve(res);
      }), function(err){
        d.reject(err);
      }
      return d.promise;
    },

    getModel: function(modelId){
      var d = $q.defer();
      modelRsc.get({modelId: modelId}, function(res){
        if(res.code == '200'){
          d.resolve(res.data.model);
        } else{
          alert('没有model:' + modelId);
          d.resolve();
        }
      }, function(err){
        d.reject(err);
      })
      return d.promise;
    },

    addModel: function(item){
      var d = $q.defer();
      var model = angular.merge({}, item);
      model.partList.forEach(function(item){
        if(item.hasOwnProperty("isDisabledAdd")) delete item.isDisabledAdd;
        if(item.hasOwnProperty("isShowInfo")) delete item.isShowInfo;
      });
      modelRsc.save({}, {model: model}, function(res){
        d.resolve(res);
      }, function(err){
        d.reject(err);
      });
      return d.promise;
    },

    //item.partList中添加part子项
    addPart: function(part){
      if(!this.item.partList){
        this.item.partList = [];
      }
      this.item.partList.push(part);
    },

    removePart: function(index){
      if(!this.item.partList) return false;
      this.item.partList.splice(index ,1);
    },


    getModelDeals: function(typeId, pageId, pageSize){
      var d = $q.defer();
      modelDealsRsc.get({typeId: typeId, pageId: pageId, pageSize: pageSize}, function(res){
        d.resolve(res);
      }), function(err){
        d.reject(err);
      }
      return d.promise;
    },
  }

  return modelModel;
}]