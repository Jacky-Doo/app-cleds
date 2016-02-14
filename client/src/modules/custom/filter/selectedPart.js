'use strict';

module.exports = function(){
  return function(partList){
    var output = [];
    if(partList instanceof Array){
      partList.forEach(function(item){
        if(item.selected) {
          output.push(item);
        }
      })
      return output;
    } else {
      return false;
    }
  }
}
