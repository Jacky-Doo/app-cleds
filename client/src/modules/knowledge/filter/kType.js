'use strict';

module.exports = function(){
  return function(type, idTag){
    var output = [];
    if(type instanceof Array){
      type.forEach(function(item){
        if(item.id.indexOf(idTag) != -1) {
          output.push(item);
        }
      })
      return output;
    } else {
      return false;
    }
  }
}