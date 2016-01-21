'use strict';

/**
 * @res:{
 *  code: (200|404|500),
 *  data: {
 *    types: [String]
 *  }
 * }
 * @req:{
 *
 * }
 */

var typesModel = require('../models/kTypes.js');
var dcModel = mongoose.model('kDcModel');

module.exports = {
  /**
   * @method: GET
   * @req: {}
   * @res: {
   *    code: 200|404|500,
   *    data: {
   *      types: [{typeId: String, name: Number, num: Number}]
   *    }
   * }
   */
  getTypes: function(req, res){
    var resData;
    var i = 0;
    var types = typesModel;
    types.forEach(function(item, index){
      if(item.id.split(':')[0] == '1') {
        dcModel.count({typeId: item.id}, function(err, count){
          types[index].num = count;
          i++;
          if(i == types.length){
            resData = {code: 200, data: {types: types},};
            res.json(resData);
          }
        })
      } else if(item.id.split(':')[0] == '0'){
        i++;
        if(i == types.length){
          resData = {code: 200, data: {types: types},};
          res.json(resData);
        }
      }
    });
  }
}
