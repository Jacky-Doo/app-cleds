'use strict';

var kDcSchema = new Schema({
  title: String,
  typeId: String,
  typeName: String,
  keys: [String],
  desc: String,
  fileId: String,
  fileName: String,
  fileSize: Number,
  mimeType: String,
  viewNum: Number,
  updateTime: Number,
  createTime: Number,
  //creator: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('kDcModel', kDcSchema);