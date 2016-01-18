'use strict';

var multer = require('multer');
var path = require('path');
var fileCtrl = require('../controllers/file.js');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var destDir = req.params[0] ? req.params[0] : 'default';
      cb(null, path.join(root, '/file/'+destDir));
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})

module.exports = function(app){

  app.route('/file/:id')
    .get(fileCtrl.getFile);

  app.route('/file/single/*')
    .post(multer({storage: storage}).any(), fileCtrl.addFile);
}
