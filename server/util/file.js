'use strict';

var fileModel = mongoose.model('fileModel');

exports.getFilePath = function(id){
  return new Promise(function(resolve, reject){
    fileModel.findById(id, function(err, data){
      if(err){
        reject(err);
      } else {
        resolve(data.path);
      }
    });
  })
}