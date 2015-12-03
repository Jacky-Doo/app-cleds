'use strict';

var typesCtrl = require('../controllers/knowledgeTypes');

module.exports = function(app){
  app.route('/knowledge/types')
    .get(typesCtrl.getTypes)
    .post(typesCtrl.setTypes)
}