'use strict';

var fileSchema = new Schema({
  name: String,    //文件原名称
  mimeType: String,    //文件类型
  size: Number,    //文件大小
  path: String,    //文件在服务器端的路径
  updateTime: Number,   //上次更新时间
  createTime: Number,  //创建时间
});

module.exports = mongoose.model('fileModel', fileSchema);
