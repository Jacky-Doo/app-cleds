'use strict';

var knowledgeUpload = ['$scope', 'KnowledgeTypes', 'KnowledgeDc', 'FileUploader', 'Constant',
  function($scope, KnowledgeTypes, KnowledgeDc, FileUploader, Constant){
    /**
     * 对象声明
     */
    $scope.Types = new KnowledgeTypes();
    $scope.Dc = new KnowledgeDc();
    $scope.Uploader = new FileUploader();
    $scope.dc = {
      type: '',
      title: '',
      keys: [],
      desc: '',
      types: [],
      keysStr: '',
    };
    /**
     * 对象方法声明
     */
    //获取所有文档类型
    $scope.dc.getTypes = function(){
      $scope.Types.getTypes().then(function(res){
        $scope.dc.types = $scope.Types.types;
        $scope.dc.type = $scope.dc.types[0];
      });
    }
    //提交文档
    $scope.dc.addDc = function(){
      if($scope.Uploader.queue.length ==1){
        var item = $scope.Uploader.queue[0];
        item.url = Constant.baseUrl + '/konwledge/dc/file';
        item.upload();
        var dcData = {
          title: $scope.dc.title,
          typeId: $scope.dc.type.id,
          keys: $scope.dc.keys,
          desc: $scope.dc.desc,
          name: item.file.name,
          size: item.file.size,
          format: item.file.type,
          url: '?????',
        };
      }


      //$scope.Dc.addDc({dc: dcData});
    }
    /**
     * 逻辑初始化
     */
    $scope.dc.getTypes();
    $scope.$watch('dc.keysStr', function(newValue, oldValue, scope){
      scope.dc.keys = newValue.split(' ');
    });


    //初始化KnowledgeTypesShecma程序
    //var types = ['技术沉淀', '技术标准', '相关专利', '相关论文', '行业动态', '失效产品', '优质产品'];
    //types.forEach(function(item){
    //  $scope.Types.addType({name: item});
    //});
  }
];

module.exports = knowledgeUpload;