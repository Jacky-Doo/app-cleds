'use strict';

var Constant = {
  baseUrl: '',
}

if(location.href.indexOf('localhost') != -1){
  Constant.baseUrl = 'http://localhost:8011';
} else {
  Constant.baseUrl = 'http://115.28.29.138:8011';
}

module.exports = Constant;