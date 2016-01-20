'use strict';

var modelModel = mongoose.model('kModelModel');

module.exports = {
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
  addModel: function(req, res){
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
  },
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
  getModels: function(req, res){
    var resData;
    var typeId = req.query.typeId;
    var pageId = req.query.pageId;
    var pageSize = req.query.pageSize;
    var startIndex = pageSize*(pageId-1);
    if(typeId == 'any'){
      modelModel
        .find({})
        .limit(pageSize)
        .skip(startIndex)
        .exec(function(err, data){
          if(data.length == 0){
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

  },
}

