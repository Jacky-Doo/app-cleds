'use strict';

var dcModel = mongoose.model('kDcModel');

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
  addDc: function(req, res){
    var dcData = req.body.dc;
    var resData;
    dcModel.find({title: dcData.tite}, function(err, data){
      if(data.length){
        resData = {code: 304, data: null, msg: '标题已存在'};
        res.json(resData);
      } else{
        dcData.createTime = dcData.updateTime = (new Date()).getTime();
        dcData.viewNum = 0;
        var dc = new dcModel(dcData);
        dc.save(function(err){
          if(err){
            resData = {code: 404, data: null, msg: '保存失败'};
          } else {
            resData = {code: 200, data: null, msg: '保存成功'};
          }
          res.json(resData);
        });
      }
    });
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
  getDcs: function(req, res){
    var resData;
    var typeId = req.params.typeId;
    var pageId = req.query.pageId;
    var pageSize = req.query.pageSize;
    var startIndex = pageSize*(pageId-1);
    dcModel
      .find({typeId: typeId})
      .limit(pageSize)
      .skip(startIndex)
      .exec(function(err, data) {
        if (data.length == 0) {
          resData = {code: 404, data: null, msg: '没有文档'};
          res.json(resData);
        } else {
          resData = {code: 200, data: {dcs: data}, msg: '查找成功'};
          if(pageId == 1){
            dcModel.count({typeId: typeId}, function(err, count){
              resData.data.count = count;
              res.json(resData);
            });
          } else {
            res.json(resData);
          }
        }
      })
  }
}

