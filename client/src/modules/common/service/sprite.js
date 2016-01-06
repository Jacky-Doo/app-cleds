'use strict';

var svgSymbols = require('../assets/svg-symbols.svg');
/**
 * 后面需要提供自动解析函数？？？？？？？？？？
 * @type {{add: string, remove: string, search: string, download: string, upload: string}}
 */
module.exports = {
  add: svgSymbols + '#ic-add',
  remove: svgSymbols + '#ic-remove',
  search: svgSymbols + '#ic-search',
  download: svgSymbols + '#ic-download',
  upload: svgSymbols + '#ic-upload',
  right: svgSymbols + '#ic-right'
}

