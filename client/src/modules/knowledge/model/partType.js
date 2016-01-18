'use strict';

module.exports = ["$http", '$q', 'Constant', '$resource', function($http, $q, Constant, $resource){
  var partTypes = [
    {
      id: "lens",
      name: "透镜模块",
      attrList: [
        {id: "name", name: "名称", value: "", unit: ""},
        {id: "producer", name: "生产商", value: "", unit: ""},
        {id: "version", name: "型号", value: "", unit: ""},
        {id: "size", name: "尺寸", value: "", unit: "mm*mm"},
        {id: "price", name: "价格", value: "", unit: "￥"},
        {id: "material", name: "材质", value: "", unit: ""},
        {id: "luminousness", name: "透光率", value: "", unit: "%"},
        {id: "lmsAngle", name: "发光角度", value: "", unit: ""},
      ]
    },
    {
      id: "chip",
      name: "芯片",
      attrList: [
        {id: "name", name: "名称", value: "", unit: ""},
        {id: "producer", name: "生产商", value: ""},
        {id: "version", name: "型号", value: ""},
        {id: "size", name: "尺寸", value: ""},
        {id: "price", name: "价格", value: ""},
        {id: "lmsFlux", name: "光通量", value: ""},
        {id: "power", name: "功率", value: ""},
        {id: "voltage", name: "电压", value: ""},
        {id: "cri", name: "显色指数", value: ""},
        {id: "lmsAngle", name: "发光角度", value: ""},
        {id: "resistance", name: "热阻", value: ""},
      ]
    },
    {
      id: "substrate",
      name: "基板",
      attrList: [
        {id: "name", name: "名称", value: "", unit: ""},
        {id: "producer", name: "生产商", value: ""},
        {id: "version", name: "型号", value: ""},
        {id: "size", name: "尺寸", value: ""},
        {id: "price", name: "价格", value: ""},
        {id: "material", name: "材质", value: ""},
        {id: "power", name: "功率", value: ""},
        {id: "voltage", name: "电压", value: ""},
      ]
    },
    {
      id: "source",
      name: "电源",
      attrList: [
        {id: "name", name: "名称", value: "", unit: ""},
        {id: "producer", name: "生产商", value: ""},
        {id: "version", name: "型号", value: ""},
        {id: "size", name: "尺寸", value: ""},
        {id: "price", name: "价格", value: ""},
        {id: "type", name: "类型", value: ""},
        {id: "power", name: "功率", value: ""},
        {id: "inputVoltage", name: "输入电压", value: ""},
        {id: "outputVoltage", name: "输出电压", value: ""},
      ]
    },
    {
      id: "controller",
      name: "控制器",
      attrList: [
        {id: "name", name: "名称", value: "", unit: ""},
        {id: "producer", name: "生产商", value: ""},
        {id: "version", name: "型号", value: ""},
        {id: "price", name: "价格", value: ""},
        {id: "power", name: "功率", value: ""},
        {id: "inputVoltage", name: "输入电压", value: ""},
        {id: "outputVoltage", name: "输出电压", value: ""},
      ]
    },
    {
      id: "radiator",
      name: "散热器",
      attrList: [
        {id: "name", name: "名称", value: "", unit: ""},
        {id: "producer", name: "生产商", value: ""},
        {id: "version", name: "型号", value: ""},
        {id: "material", name: "材质", value: ""},
      ]
    },
    {
      id: "shell",
      name: "外壳",
      attrList: [
        {id: "name", name: "名称", value: "", unit: ""},
        {attr: "producer", name: "生产商", value: "String"},
        {attr: "version", name: "型号", value: "String"},
        {attr: "material", name: "材质", value: "String"},
      ]
    }
  ];

  return partTypes;
}]