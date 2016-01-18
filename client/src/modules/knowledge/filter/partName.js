'use strict';
/**
 * 返回part.item下attrList中id="name"的零部件名称
 * @returns {Function}
 */
module.exports = function(){
  return function(item){
    for(var i=0; i<item.attrList.length; i++){
      if(item.attrList[i].id == 'name'){
        return item.attrList[i].value;
      }
    }
    return;
  }
}