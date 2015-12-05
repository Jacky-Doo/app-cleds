'use strict';

var multer = require('multer');
var path = require('path');

var typesCtrl = require('../controllers/knowledgeTypes');
var dcCtrl = require('../controllers/knowledgeDc');

module.exports = function(app){
  app.route('/knowledge/types')
    .get(typesCtrl.getTypes)
    .post(typesCtrl.addType);

  app.route('/knowledge/dc')
    .post(dcCtrl.addDc);

  app.route('/konwledge/dc/file')
    .post(multer({dest: path.join(root, '/upload/dc')}).any(), dcCtrl.addFile);
}