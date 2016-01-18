'use strict';

module.exports = function(){
  return function(size){
    return size < 1024*1024 ? (size/1024).toFixed(1) + 'KB' : (size/1024/1024).toFixed(1) + 'MB';
  }
}