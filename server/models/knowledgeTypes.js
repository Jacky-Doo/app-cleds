'use strict';

var KnowledgeTypesSchema = new Schema({
  types: String,
});

module.exports = mongoose.model('KnowledgeTypes', KnowledgeTypesSchema);
