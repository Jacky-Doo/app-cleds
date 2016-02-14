'use strict';
/**
 * id标识属性id,查找attrList中id="id"的零部件，返回零部件属性的attr（标识属性的id，name，value）item.attrList[i][attr]
 * 另外需要判断如果属性值value为object则返回object的value
 * @returns {Function}
 */
module.exports = function(){
  return function(item, id, attr){
    if(!item) return;
    for(var i=0; i<item.attrList.length; i++){
      if(item.attrList[i].id == id){
        if(typeof item.attrList[i][attr] == 'object'){
          return item.attrList[i][attr].name;
        } else{
          return item.attrList[i][attr];
        }
      }
    }
    return;
  }
}