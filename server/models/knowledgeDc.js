'use strict';

var KnowledgeDcSchema = new Schema({
  title: String,
  type: {type: Schema.Types.ObjectId, ref: 'KnowledgeTypes'},
  keys: [String],
  updateDate: Date,
  createDate: Date,
  viewNum: Number,
  //creator: {type: Schema.Types.ObjectId, ref: 'User'},
  url: String,
  format: String,
});

module.exports = mongoose.model('KnowledgeDc', KnowledgeDcSchema);

