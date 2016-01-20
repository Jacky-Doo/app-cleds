'use strict';

var kModelSchema = new Schema({
  typeId: String,   //产品类型标识id
  typeName: String, //产品类型名称
  imageId: String,  //图片文件id
  modelId: String,  //模型文件id
  attrList: Object,  //属性由前端定义，在partManage.html中定义
  partList: Array,  //子元素即kPartSchema
  updateTime: Number,
  createTime: Number,
  //creator: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('kModelModel', kModelSchema);