'use strict';

var scene = null;
var camera = null;
var renderer = null;
var mesh = null;

function init(modelUrl){
  renderer = new THREE.WebGLRenderer({ antialias : true });
  $('#viewer').append(renderer.domElement);
  renderer.setClearColor(0xfffffff);
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-150,150,112.5,-112.5,-100,10000);
  camera.position.set(15,25,50);
  camera.lookAt(new THREE.Vector3(0,2,0));
  scene.add(camera);
  var loader = new THREE.OBJLoader();
  loader.load(modelUrl, function(obj){
    obj.traverse(function(child){
      if(child instanceof THREE.Mesh){
        //child.material.side = THREE.DoubleSide;
        child.material = new THREE.MeshPhongMaterial({
          color: "#ffffff",
          emissive:"#555555",
          shininess:80,
          specular:0xeeeeee,
          shading:THREE.SmoothShading
        })
      }
    });
    mesh = obj;
    scene.add(obj);
    var light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(20,10,5);
    scene.add(light1);
    var light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(200,100,50);
    scene.add(light2);
    var light3 = new THREE.DirectionalLight(0xffffff);
    light3.position.set(2000,1000,500);
    scene.add(light3);
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    setInterval(draw,20);
  });
}

function draw(){
  renderer.render(scene,camera);
  mesh.rotation.y += 0.01;
  if(mesh.rotation.y>Math.PI*2){
    mesh.rotation.y-=Math.PI*2;
  }
}

var modelUrl = '/' + Base.getRequest('modelSrc');

init(modelUrl);
