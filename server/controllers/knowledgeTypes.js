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

module.exports = {
  /**
   * @method: GET
   * @req: {}
   * @res: {
   *    code: 200|404|500,
   *    data: {
   *      types: [{id: item._id, name: item.name}]
   *    }
   * }
   */
  getTypes: function(req, res){
    Types.find(function(err, data){
      var resData;
      var types = [];
      data.forEach(function(item){
        types.push({id: item._id, name: item.name});
      });
      console.log(types);
      if(err){
        resData = {code: 500, data: null,};
      } else if(types){
        resData = {code: 200, data: {types: types},};
      } else {
        resData = {code: 404, data: null,};
      }
      res.json(resData);
    });
  },
  /**
   * @method: PUT
   * @req: {
   *   id: _id,
   *   name: _name
   * }
   * @res: {
   *    code: 200|404|500,
   *    data: null,
   *    msg: String
   * }
   */
  updateType: function(req, res){
    Types.findByIdAndUpdate(req.body.id, {$set: {name: req.body.name}}, function(err){
      var resData = err ?
        {code: 404, data: null, msg: '更新失败'}
        :{code: 200, data: null , msg: '更新成功'}
      res.json(resData);
    });
  },
  /**
   * @method: POST
   * @req: {
   *   name: String
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
        var type = new Types({name: req.body.name});
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
