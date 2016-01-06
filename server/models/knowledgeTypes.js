'use strict';

var KnowledgeTypesSchema = new Schema({
  name: String,
  num: Number,
});

module.exports = mongoose.model('KnowledgeTypes', KnowledgeTypesSchema);
