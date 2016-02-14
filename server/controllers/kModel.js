'use strict';

var modelModel = mongoose.model('kModelModel');
var fileModel = mongoose.model('fileModel');

/**
 * @method: POST
 * @req: {
 *  dc:{
 *     title: String,
 *     typeId: String,
 *     typeName: String,
 *     keys: [String],
 *     desc: String,
 *     fileSize: Number,
 *     fileName: String,
 *     mimeType: String,
 *     filePath: String,
 *   }
 * }
 * @res: {
 *    code: 200|404|500,
 *    data: null,
 *    msg: String
 * }
 */
var addModel = function(req, res){
  var modelData = req.body.model;
  var resData;
  modelData.createTime  = modelData.updateTime = (new Date()).getTime();
  var model = new modelModel(modelData);
  model.save(function(err){
    if(err){
      resData = {code: 404, data: null, msg: '保存失败'};
    } else {
      resData = {code: 200, data: null, msg: '保存成功'};
    }
    res.json(resData);
  })
};
/**
 * @method: GET
 * @req: {
 * }
 * @res: {
 *   dcs:[
 *     title: String,
 *     typeId: String,
 *     typeName: String
 *     keys: [String],
 *     desc: String,
 *     size: Number,
 *     name: String,
 *     format: String,
 *     url: String,
 *   ]
 * }
 */
var getModels = function(req, res){
  var resData;
  var typeId = req.query.typeId;
  var pageId = req.query.pageId;
  var pageSize = parseInt(req.query.pageSize);
  var startIndex = parseInt(pageSize*(pageId-1));
  if(typeId == 'any'){
    modelModel
      .find({})
      //.limit(pageSize)
      .skip(startIndex)
      .exec(function(err, data){
        if(!data){
          resData = {code: 404, data: null, msg: '没有零件'};
          res.json(resData);
        } else {
          resData = {code: 200, data: {models: data}, msg: '查找成功'};
          if(pageId == 1){
            modelModel.count({}, function(err, count){
              resData.data.count = count;
              res.json(resData);
            })
          } else {
            res.json(resData);
          }
        }
      })
  } else if(typeId){
    modelModel
      .find({typeId: typeId})
      .limit(pageSize)
      .skip(startIndex)
      .exec(function(err, data){
        if(data.length == 0){
          resData = {code: 404, data: null, msg: '没有零件'};
          res.json(resData);
        } else {
          resData = {code: 200, data: {models: data}, msg: '查找成功'};
          if(pageId == 1){
            modelModel.count({typeId: typeId}, function(err, count){
              resData.data.count = count;
              res.json(resData);
            })
          } else {
            res.json(resData);
          }
        }
      })
  }
};

var getModel = function(req, res){
  var resData;
  var modelId = req.query.modelId;
  modelModel.findById(modelId, function(err, data){
    if(data){
      resData = {code: 200, data: {model: data}, msg: '查找成功'};
    } else {
      resData = {code: 404, data: null, msg: '没有实例'};
    }
    res.json(resData);
  })
}

var getModelDeals = function(req, res){
  var resData;
  var typeId = req.query.typeId;
  var pageId = req.query.pageId;
  var pageSize = parseInt(req.query.pageSize);
  var startIndex = parseInt(pageSize*(pageId-1));
  if(typeId == 'any'){
    modelModel
      .find({})
      .limit(pageSize)
      .skip(startIndex)
      .exec(function(err, data){
        if(!data){
          resData = {code: 404, data: null, msg: '没有零件'};
          res.json(resData);
        } else {
          _modelDealsFilter(data, function(modelDeals){
            resData = {code: 200, data: {modelDeals: modelDeals}, msg: '查找成功'};
            res.json(resData);
          });
        }
      })
  }
};


function _modelDealsFilter(models ,callback){
  var modelDeals = [];
  var i = 0;
  models.forEach(function(item){
    var modelDeal = {
      id: item._id,
      price: _modelAttrFilter(item, 'price', 'value'),
      name: _modelAttrFilter(item, 'name', 'value'),
      desc: _modelAttrFilter(item, 'desc', 'value'),
    }
    fileModel.findById(item.imageId, function(err, file){
      i++;
      if(err){
        console.log(err);
        return false;
      }
      modelDeal.imageSrc = file.path;
      modelDeals.push(modelDeal);
      if(i == models.length){
        callback(modelDeals);
      }
    })
  });
}

function _modelAttrFilter(item, id, attr){
  for(var i=0; i<item.attrList.length; i++){
    if(item.attrList[i].id == id){
      if(typeof item.attrList[i][attr] == 'object'){
        return item.attrList[i][attr].name;
      } else{
        return item.attrList[i][attr];
      }
    }
  }
  return;
}


module.exports = {
  addModel: addModel,
  getModel: getModel,
  getModels: getModels,
  getModelDeals: getModelDeals,
}

