'use strict';

var kPartSchema = new Schema({
  typeId: String,
  typeName: String,
  desc: String,
  imageId: String,  //图片文件id
  modelId: String,  //模型文件id
  attrList: Object,
  updateTime: Number,
  createTime: Number,
  //creator: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('kPartModel', kPartSchema);