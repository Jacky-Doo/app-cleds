'use strict';

var multer = require('multer');
var path = require('path');

var typesCtrl = require('../controllers/knowledgeTypes');
var dcCtrl = require('../controllers/knowledgeDc');

module.exports = function(app){
  app.route('/knowledge/types')
    .get(typesCtrl.getTypes)
    .post(typesCtrl.addType);

  app.route('/knowledge/dcs')
    .post(dcCtrl.addDc);

  app.route('/knowledge/dcs/:typeId')
    .get(dcCtrl.getDcs);

  app.route('/knowledge/dc/file/:id') //下载文档文件，id为文档id并非文件路径id
    .get(dcCtrl.getFile);

  app.route('/knowledge/dc/file')
    .post(multer({dest: path.join(root, '/upload/dc')}).any(), dcCtrl.addFile);
}