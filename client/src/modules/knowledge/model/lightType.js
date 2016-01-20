'use strict';

module.exports = [function(){
  //type: 0为室内；type: 1为室外
  var lightTypes = [
    {id: 'any', name: "任意", place: "",},  //place为空则表示全部
    {id: "spotLight", name: "LED射灯", place: "0"},
    {id: "tubeLight", name: "LED筒灯", place: "0"},
    {id: "ballLight", name: "LED球泡灯", place: "0"},
    {id: "gridLight", name: "LED栅格灯", place: "0"},
    {id: "panelLight", name: "LED面板灯", place: "0"},
    {id: "streetLight", name: "LED路灯", place: "1"},
  ];
  return lightTypes;
}]