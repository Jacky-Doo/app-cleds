'use strict';

var path = require('path'),
    fs = require('fs'),
    copy = require('copy');
var fileModel = mongoose.model('fileModel');


module.exports = {
  addFile: function(req, res){
    var resData;
    if(req.files[0]){
      var data = {
        name: req.files[0].originalname,
        mimeType: req.files[0].mimetype,
        size: req.files[0].size,
        path: req.files[0].path.split('/file/')[1],
        createTime: (new Date()).getTime(),
        updateTime: (new Date()).getTime(),
      };
      var file = new fileModel(data);
      file.save(function(err, data){
        if(err){
          resData = {code: 404, data: null, msg: '文件上传失败'};
        } else {
          resData = {code: 200, data: data, msg: '文件上传成功'};
        }
        res.json(resData);
      });
    } else{
      resData = {code: 404, data: null, msg: '文件上传失败'};
      res.json(resData);
    }
  },

  getFile: function(req, res){
    var id = req.params.id;
    fileModel.findById(id, function(err, file){
      if(file){
        var src = path.join(root, '../file', file.path);
        var destDir = path.join(root, '/tmp');
        var destFile = path.join(destDir, file.name);
        var download = function(res){
          res.download(destFile, function(){
            setTimeout(function(){
              fs.access(destFile, fs.R_OK | fs.W_OK, function(){
                fs.unlink(destFile);
              })
            }, 60*1000);
          });
        }
        fs.access(destFile, fs.R_OK | fs.W_OK, function (err) {
          if(err){
            copy.one(src, destDir, function(){
              var tmpName = src.split('/').pop();
              fs.rename(path.join(destDir, tmpName), destFile, function(){
                download(res);
              })
            })
          } else {
            download(res);
          }
        });
      }
    })
  },

  getFileSrc: function(req, res, id){
    var id = id || req.params.id;
    var resData;
    fileModel.findById(id, function(err, file){
      if(file){
        resData = {code: 200, data: {fileSrc: file.path}};
        res.json(resData);
      } else {
        res.json('y');
      }
    })
  }
}