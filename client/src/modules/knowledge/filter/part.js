'use strict';

module.exports = function(){
  return function(partList, typeId){
    var output = [];
    if(partList instanceof Array){
      partList.forEach(function(part){
        if(part.typeId == typeId) {
          output.push(part);
        }
      })
      return output;
    } else {
      return false;
    }
  }
}