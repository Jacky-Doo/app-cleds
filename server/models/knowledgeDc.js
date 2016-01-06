'use strict';

var KnowledgeDcSchema = new Schema({
  title: String,
  _type: {type: Schema.Types.ObjectId, ref: 'KnowledgeTypes'},
  keys: [String],
  desc: String,
  name: String,
  size: Number,
  mimeType: String,
  path: String,
  viewNum: Number,
  updateTime: Number,
  createTime: Number,
  //creator: {type: Schema.Types.ObjectId, ref: 'User'},

});

module.exports = mongoose.model('KnowledgeDc', KnowledgeDcSchema);