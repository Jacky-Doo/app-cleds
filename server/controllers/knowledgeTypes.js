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

var Types = mongoose.model('KnowledgeTypes');
var Dc = mongoose.model('KnowledgeDc');

module.exports = {
  /**
   * @method: GET
   * @req: {}
   * @res: {
   *    code: 200|404|500,
   *    data: {
   *      types: [{id: Number, name: Number, num: Number}]
   *    }
   * }
   */
  getTypes: function(req, res){
    Types.find(function(err, data){
      var resData;
      if(err){
        resData = {code: 500, data: null,};
        res.json(resData);
      } else if(data){
        var i = 0;
        data.forEach(function(item){
          Dc.count({_type: item._id}, function(err, count){
            item.num = count;
            i++;
            if(i == data.length){
              resData = {code: 200, data: {types: data},};
              res.json(resData);
            }
          });
        })
      } else {
        resData = {code: 404, data: null,};
        res.json(resData);
      }

    });
  },
  /**
   * @method: POST
   * @req: {
   *   type: {
   *     name: String,
   *   }
   * }
   * @res: {
   *    code: 200|404|500,
   *    data: null,
   *    msg: String
   * }
   */
  addType: function(req, res){
    var resData;
    Types.find({name: req.body.name}, function(err, data){
      if(data.length) {
        resData = {code: 304, data: null, msg: '类型已存在'};
        res.json(resData);
      } else {
        var type = new Types({name: req.body.name, num: 0});
        type.save(function(err) {
          resData = err ?
            {code: 404, data: null, msg: '添加失败'}
            : {code: 200, data: null, msg: '添加成功'}
          res.json(resData);
        });
      }
    });
  },

  removeType: function(req, res){

  }
}
