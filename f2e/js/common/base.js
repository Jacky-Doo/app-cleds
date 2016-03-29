'use strict';

var Base = {
  getRequest: function(r, url){
    var search = location.search;
    if(arguments.length == 2){
      search = url.slice(url.indexOf('?'));
    }
    if (search.indexOf("?") != -1) {
      var items = search.substr(1).split("&");
      for(var index in items){
        if(items[index].split('=')[0] == r){
          return items[index].split('=')[1];
        }
      }
    }
    console.log('there is no ' + r);
    return false;
  }
}
