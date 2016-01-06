'use strict';

var Dc = mongoose.model('KnowledgeDc');
var Types = mongoose.model('KnowledgeTypes');
var path = require('path');
var copy = require('copy');
var fs = require('fs');

module.exports = {
  /**
   * @method: POST
   * @req: {
   *  dc:{
   *     title: String,
   *     typeId: String|Number,
   *     keys: [String],
   *     desc: String,
   *     size: Number,
   *     name: String,
   *     format: String,
   *     url: String,
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
    console.log(req.body.dc);
    Dc.find({title: dcData.tite}, function(err, data){
      if(data.length){
        resData = {code: 304, data: null, msg: '标题已存在'};
        res.json(resData);
      } else{
        dcData._type = dcData._type._id;  //处理populate
        dcData.createTime = dcData.updateTime = (new Date()).getTime();
        dcData.viewNum = 0;
        var dc = new Dc(dcData);
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
  getFile: function(req, res){
    var id = req.params.id;
    Dc.findById(id, function(err, dc){
      if(dc){
        console.log(dc);
        var src = path.join(root, '/upload/dc', dc.path);
        var destDir = path.join(root, '/tmp');
        var destFile = path.join(destDir, dc.name);
        var download = function(res){
          res.download(destFile, function(){
            setTimeout(function(){
              fs.unlink(destFile);
            }, 60*1000);
          });
        }
        fs.access(destFile, fs.R_OK | fs.W_OK, function (err) {
          if(err){
            copy.one(src, destDir, function(){
              fs.rename(path.join(destDir, dc.path), destFile, function(){
                download(res);
              });
            })
          } else {
            download(res);
          }
        });
      }
    })
  },
  /**
   * @method: POST
   * @req: {
   * }
   * @res: {
   *    code: 200|404|500,
   *    data: {
   *      file: {
   *        name: String,
   *        size: Number,
   *        mimeType: String,
   *        path: String,
   *      }
   *    }
   *    msg: String
   * }
   */
  addFile: function(req, res){
    var file = req.files[0];
    var tmp = file.path.split('/');
    var path = tmp[tmp.length-1];
    var data = {
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      path: path,
    };
    var resData = {code: 200, data: data, msg: '文件上传成功'};
    res.json(resData);
  },
  /**
   * @method: GET
   * @req: {
   * }
   * @res: {
   *   dcs:[
   *     title: String,
   *     type: {
   *      typeId: String,
   *      name: String
   *     }
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
    Dc
      .find({_type: typeId})
      .limit(pageSize)
      .skip(startIndex)
      .populate('_type')
      .exec(function(err, data) {
        if (data.length == 0) {
          resData = {code: 404, data: null, msg: '没有文档'};
        } else {
          resData = {code: 200, data: {dcs: data}, msg: '查找成功'};
          if(pageId == 1){
            Dc.count({_type: typeId}, function(err, count){
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

