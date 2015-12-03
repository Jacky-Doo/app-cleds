'use strict';

var Types = mongoose.model('KnowledgeTypes');

module.exports = {
  getTypes: function(req, res){
    Types.find({},function(data){
      res.jsonp(data);
    });
  },
  setTypes: function(req, res){
    var types = new Types(req.body);
    logger.debug(req.body);
    types.save(function(){
      res.send({code: 200});
    });
  }
}
