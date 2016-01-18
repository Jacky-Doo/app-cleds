'use strict';

var multer = require('multer');
var path = require('path');

//var typesCtrl = require('../controllers/knowledgeTypes');
var typesCtrl = require('../controllers/kTypes.js'),
    dcCtrl = require('../controllers/kDc.js'),
    partCtrl = require('../controllers/kPart.js');


module.exports = function(app){
  app.route('/knowledge/types')
    .get(typesCtrl.getTypes)

  app.route('/knowledge/dc')
    .post(dcCtrl.addDc);

  app.route('/knowledge/dcs/:typeId')
    .get(dcCtrl.getDcs);

  app.route('/knowledge/part')
    .post(partCtrl.addPart);

  app.route('/knowledge/parts/:typeId')
    .get(partCtrl.getParts);
}