'use strict';

var svgSymbols = require('../assets/svg-symbols.svg');
/**
 * 后面需要提供自动解析函数？？？？？？？？？？
 * @type {{add: string, remove: string, search: string, download: string, upload: string}}
 */
module.exports = {
  add: svgSymbols + '#add',
  remove: svgSymbols + '#remove',
  search: svgSymbols + '#search',
  download: svgSymbols + '#download',
  upload: svgSymbols + '#upload',
  right: svgSymbols + '#right'
}

