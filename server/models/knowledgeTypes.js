'use strict';

var KnowledgeTypesSchema = new Schema({
  name: String,
});

module.exports = mongoose.model('KnowledgeTypes', KnowledgeTypesSchema);
