'use strict';

var Dc = mongoose.model('KnowledgeDc');

module.exports = {
  /**
   * @method: POST
   * @req: {
   *  dc:{
   *     title: String,
   *     typeId: String|Number,
   *     keys: [String],
   *     desc: String,
   *     size: Number,
   *     name: String,
   *     format: String,
   *     url: String,
   *   }
   * }
   * @res: {
   *    code: 200|404|500,
   *    data: null,
   *    msg: String
   * }
   */
  addDc: function(req, res){
    var dcData = req.body.dc;
    var resData;
    Dc.find({title: dcData.tite}, function(err, data){
      if(data.length){
        resData = {code: 304, data: null, msg: '标题已存在'};
        res.json(resData);
      } else{
        dcData.createTime = dcData.updateTime = (new Date()).getTime();
        dcData.viewNum = 0;
        var dc = new Dc(dcData);
        dc.save(function(err){
          resData = err ?
            {code: 404, data: null, msg: '保存失败'}
            :{code: 200, data: null, msg: '保存成功'}
        });
        res.json(resData);
      }
    });
  },
  /**
   * @method: POST
   * @req: {
   * }
   * @res: {
   *    code: 200|404|500,
   *    data: {
   *      file: {
   *        name: String,
   *        size: Number,
   *        mimeType: String,
   *        path: String,
   *      }
   *    }
   *    msg: String
   * }
   */
  addFile: function(req, res){
    var file = req.files[0];
    var data = {
      name: file.originalname,
      size: file.size,
      mimeType: file.mimeType,
      path: file.path,
    };
    var resData = {code: 200, data: data, msg: '文件上传成功'};
    res.json(resData);
  }
}

