'use strict';

var kPartSchema = new Schema({
  typeId: String,
  typeName: String,
  desc: String,
  imageId: String,  //图片文件id
  modelId: String,  //模型文件id
  attrList: Object, //具体自文档在前端partType.js中定义
  updateTime: Number,
  createTime: Number,
  modelSrc: String,
  imageSrc: String
  //creator: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('kPartModel', kPartSchema);