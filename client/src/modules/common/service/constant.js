'use strict';

var baseUrl;
if(location.href.indexOf('localhost') != -1){
  baseUrl = 'http://localhost:8011';
} else {
  baseUrl = 'http://115.28.29.138:8011';
}

module.exports = baseUrl;