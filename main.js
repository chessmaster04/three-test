/* THREE */

const GEOMETRY = {
    CUBE: "cube",
    SPHERE: "sphere",
    CYLINDER: "cylinder",
}
const WIDTH = window.innerWidth;
const HEIGHT = 600;

var rerender = null;
var scene = null;
var controls = null;
const meshes = {};

function init_canvas() {
    var canvas = document.getElementById('canvas');
    canvas.setAttribute('width', WIDTH);
    canvas.setAttribute('height', HEIGHT);
    
    var renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
    renderer.setClearColor(0xcccccc);
    renderer.setSize(WIDTH, HEIGHT);
    // renderer.shadowMapEnabled = true;
    
    scene = new THREE.Scene();
    
    var camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 0.1, 5000);

    camera.position.set(100,100,500);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    var light = new THREE.SpotLight(0xffffff );
	light.position.set( 200, 1000, 200 );
    light.castShadow = true;
    light.shadow.mapSize.width = WIDTH;
    light.shadow.mapSize.height = HEIGHT;

    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 30;
    scene.add(light);

    var line_y_geometry = new THREE.Geometry(); 
	line_y_geometry.vertices.push(new THREE.Vector3(0,-1000,0));
	line_y_geometry.vertices.push(new THREE.Vector3(0,1000,0));
	var line_y_material = new THREE.LineBasicMaterial({color:0x000000});
	var line_y = new THREE.Line (line_y_geometry,line_y_material);
	scene.add(line_y);
	
	var line_x_geometry = new THREE.Geometry(); 
	line_x_geometry.vertices.push(new THREE.Vector3(-1000,0,0));
	line_x_geometry.vertices.push(new THREE.Vector3(1000,0,0));
	var line_x = new THREE.Line (line_x_geometry,line_y_material);
	scene.add(line_x);
	
	var line_z_geometry = new THREE.Geometry(); 
	line_z_geometry.vertices.push(new THREE.Vector3(0,0,-1000));
	line_z_geometry.vertices.push(new THREE.Vector3(0,0,1000));
	var line_z = new THREE.Line (line_z_geometry,line_y_material);
	scene.add(line_z);
    
    rerender = (scene) => renderer.render(scene, camera);
    
}

function animate() {
    controls.update();
    requestAnimationFrame ( animate );  
    rerender(scene);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) - max/2;
}

function createCubeGeometry(scale_x, scale_y, scale_z) {
    var geometry = new THREE.BoxGeometry( 20, 20, 20 );
    geometry.scale(scale_x, scale_y, scale_z);
    var material = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.y = getRandomInt(HEIGHT);
    cube.position.x = getRandomInt(WIDTH);
    cube.position.z = Math.floor(Math.random()*100);
    cube.receiveShadow = true;
    cube.castShadow = true;
    return cube
}

function createSphereGeometry(scale_x, scale_y, scale_z) {
    var geometry = new THREE.SphereGeometry(20, 20, 20);
    geometry.scale(scale_x, scale_y, scale_z);
    var material = new THREE.MeshLambertMaterial( {color: 0xff0000} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = getRandomInt(HEIGHT);
    sphere.position.x = getRandomInt(WIDTH);
    sphere.position.z = Math.floor(Math.random()*100);
    sphere.receiveShadow = true;
    sphere.castShadow = true;
    return sphere
}

function createCylinderGeometry(scale_x, scale_y, scale_z) {
    var geometry = new THREE.CylinderGeometry( 20, 20, 20, 32 );
    geometry.scale(scale_x, scale_y, scale_z);
    var material = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
    var cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.y = getRandomInt(HEIGHT);
    cylinder.position.x = getRandomInt(WIDTH);
    cylinder.position.z = Math.floor(Math.random()*100);
    cylinder.receiveShadow = true;
    cylinder.castShadow = true;
    return cylinder
}

function addGeometry({ geometry, scale_x, scale_y, scale_z}) {
    const mesh = {
        [GEOMETRY.CUBE]: createCubeGeometry,
        [GEOMETRY.SPHERE]: createSphereGeometry,
        [GEOMETRY.CYLINDER]: createCylinderGeometry,
    }[geometry](scale_x, scale_y, scale_z);
    meshes[mesh.uuid] = mesh;
    scene.add(mesh);
    rerender(scene);
    return mesh.uuid;
}

function removeGeometry(uuid) {
    const mesh = meshes[uuid];
    scene.remove(mesh);
    rerender(scene);
}

/* FORM */

const convertFormToJSON = (form) => {
    const data = {};
    Array.from(new FormData(form)).forEach(([k, v]) => {
        data[k] = v;
    });
    return data;
};

function onSubmit(e) {
    e.preventDefault();
    const uuid = addGeometry(convertFormToJSON(e.target));
    const del_btn = document.createElement('button');
    del_btn.appendChild(document.createTextNode('X'));
    del_btn.addEventListener('click', () => {
        removeGeometry(uuid);
        document.querySelector('#geometry-'+uuid).remove();
    });
    const new_line = document.createElement('li');
    new_line.id = "geometry-"+uuid;
    new_line.appendChild(document.createTextNode(uuid));
    new_line.appendChild(del_btn);
    document.querySelector('#list_of_meshes').appendChild(new_line);
}

window.onload = function () {
    document.querySelector("#panel").addEventListener('submit', onSubmit);
    init_canvas();
    animate();
}