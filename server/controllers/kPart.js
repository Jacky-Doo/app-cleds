'use strict';

var partModel = mongoose.model('kPartModel');

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
  addPart: function(req, res){
    var partData = req.body.part;
    var resData;
    partData.createTime  = partData.updateTime = (new Date()).getTime();
    var part = new partModel(partData);
    part.save(function(err){
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
  getParts: function(req, res){
    var resData;
    var typeId = req.params.typeId;
    var pageId = req.query.pageId;
    var pageSize = parseInt(req.query.pageSize);
    var startIndex = parseInt(pageSize*(pageId-1));
    if(typeId == 'any'){
      partModel
        .find({})
        .limit(pageSize)
        .skip(startIndex)
        .exec(function(err, data){
          if(!data){
            resData = {code: 404, data: null, msg: '没有零件'};
            res.json(resData);
          } else {
            resData = {code: 200, data: {parts: data}, msg: '查找成功'};
            if(pageId == 1){
              partModel.count({}, function(err, count){
                resData.data.count = count;
                res.json(resData);
              })
            } else {
              res.json(resData);
            }
          }
        })
    } else {
      partModel
        .find({typeId: typeId})
        .limit(pageSize)
        .skip(startIndex)
        .exec(function(err, data){
          if(!data){
            resData = {code: 404, data: null, msg: '没有零件'};
            res.json(resData);
          } else {
            resData = {code: 200, data: {parts: data}, msg: '查找成功'};
            if(pageId == 1){
              partModel.count({typeId: typeId}, function(err, count){
                resData.data.count = count;
                res.json(resData);
              })
            } else {
              res.json(resData);
            }
          }
        })
    }

  }
}

