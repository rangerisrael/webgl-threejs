import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import * as dat from 'dat.gui';
import nebula from '../assets/nebula.jpg';
import stars from '../assets/stars.jpg';
import floor from '../assets/floor.jpg';
import sphereImg from '../assets/sphereFlag.jpg';
import ringSphereImg from '../assets/flag.jpg';
import phTextImg from '../assets/flag.jpg';
import { addAudioListenerToCamera } from './audio';
import bumped from './helvetiker_regular.typeface.json';
import { Text } from 'troika-three-text';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './bus.glb';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const quaternionText = new THREE.Quaternion();
const axisText = new THREE.Vector3(0, 1, 0).normalize();



const assetLoader = new GLTFLoader();

let bus;

assetLoader.load(
	MODEL,
	function (glb) {
	
    bus = glb.scene;
    bus.rotation.y = 550;
    bus.position.set(10, -5, -0);

    scene.add(bus);

    

	},
	undefined,
	function (error) {
		console.error(error);
	},
);



// create image assets loader

const textureLoader = new THREE.TextureLoader();
const sphereTextLoader = new THREE.CubeTextureLoader();


scene.background = sphereTextLoader.load([stars, stars, stars, stars, stars, stars]);


// font
const font = new FontLoader().parse(bumped);



 
const textGeo = new TextGeometry('Travel Tour', {
	font: font,
	size: 2,
	height: 5,
	curveSegments: 20, // how smooth the text is
	bevelEnabled: false,

});

  textGeo.center();
const textMaterial = new THREE.MeshStandardMaterial({
	// color: 0xeaeaea,
	map: new THREE.TextureLoader().load(phTextImg),
	side: THREE.DoubleSide,
});

const textMesh = new THREE.Mesh(textGeo, textMaterial);


	// textMesh.rotation.y = 550;
	// textMesh.position.y = 10;
	// textMesh.position.x = 7;
  
	// textMesh.position.x = 7;
	// textMesh.position.z =-8;


//  quaternionText.setFromAxisAngle(axisText, 0.01);
//  textMesh.position.applyQuaternion(quaternionText);

textMesh.position.set(0, -2, 15);
textMesh.quaternion.copy(camera.quaternion);
scene.add(textMesh);





const orbitControlCamera = new OrbitControls(camera, renderer.domElement);

const gui =  new dat.GUI();


const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
const lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );

const option = {
  sphereColor:'#ff0000',
  wireframe:false,
  speed:0.01,
  angle:0.2,
  penumbra:0,
  intensity:1
}

gui.addColor(option, 'sphereColor').onChange((value) => {
  sphere.material.color.set(value);
});

gui.add(option, 'wireframe').onChange((value) => {
	sphere.material.wireframe = value;
});

gui.add(option, 'speed', 0.01, 0.1);

// spotlight angle
gui.add(option, 'angle',0,1);
gui.add(option, 'penumbra',0,1);
gui.add(option, 'intensity',0,1);


// scene.add(cube);


const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometryLine = new THREE.BufferGeometry().setFromPoints(points);


// plane geometry

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planePhone = new THREE.MeshPhongMaterial({
	// color: 0x0a7d15,
	// color: 0xffffff,
	side: THREE.DoubleSide,
	map: new THREE.TextureLoader().load(floor),
});
const planeMaterial = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
	map: new THREE.TextureLoader().load(stars),
});
const plane = new THREE.Mesh(planeGeometry, planePhone);
plane.rotation.x = Math.PI / 2;
plane.position.set(0, -5, 0);
plane.receiveShadow = true;



const quaternion = new THREE.Quaternion();
const axis = new THREE.Vector3(0, 1, 0).normalize();

// sphere geometry

const sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
const sphereMaterial = new THREE.MeshStandardMaterial({
	wireframe: false,
	map: new THREE.TextureLoader().load(sphereImg),
});
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.set(0,0,0);
sphere.castShadow = true;


scene.add( sphere );





const ringSphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const ringSphereMaterial = new THREE.MeshStandardMaterial({
	color: 0x00ffff,
	wireframe: false,
	map: new THREE.TextureLoader().load(ringSphereImg),
});
const ringSphere = new THREE.Mesh(ringSphereGeometry, ringSphereMaterial);
ringSphere.position.set(10,0,0);

scene.add( ringSphere );


const lineGeomentry = new THREE.Line(geometryLine, lineMaterial);

// scene.add(lineGeomentry);

const axisHelper = new THREE.AxesHelper( 5 );
// scene.add( axisHelper );

// grid helper

const gridHelper = new THREE.GridHelper( 30 );
gridHelper.position.set(0, -5, 0);
scene.add(gridHelper);
scene.add(plane);


const ambientLight =  new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);


const spotLight = new THREE.SpotLight(0xFFFFFF, 0.8);
scene.add(spotLight);
spotLight.position.set(0, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper);


scene.fog = new THREE.FogExp2(0xffffff, 0.01);
renderer.setClearColor(0xeaeaea);


// mouse move when item selected


const mousePosition = new THREE.Vector2();
let validWheel = false;





window.addEventListener('click', (event) => {

  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
		const intersect = raycaster.intersectObjects(scene.children);

  

  for (let i = 0; i < intersect.length; i++) {
		if (intersect[i].object.id === sphereId) {
			// intersect[i].object.material.color.set(0x0000ff);
      validWheel=true;
        addAudioListenerToCamera(camera);
     
		}
	}

})

const raycaster = new THREE.Raycaster();
const sphereId = sphere.id;



camera.position.set(0,5,30);

orbitControlCamera.update();


let step=0;
let speed = option.speed;
let stepText = 0;
let speedText = 0.01;





function animate(time) {

	// requestAnimationFrame(animate);
	cube.rotation.x = time / 1000;
	cube.rotation.y = time / 1000;

  if(validWheel === true){
  
   
		// sphere.rotation.z = time / 1000;
		// sphere.rotation.x = time / 1000;
		 sphere.rotation.y = time / 1000;

		  quaternion.setFromAxisAngle(axis, 5);
			sphere.position.applyQuaternion(quaternion);

        stepText += speedText;
        textMesh.position.y = 0.5 * Math.abs(Math.sin(step));
        

				step += speed;
				sphere.position.y = 10 * Math.abs(Math.sin(step));
        
						
        

	}

      
  if(bus){
     bus.rotation.y += 0.01;
    //  bus.rotation.y += 0.01;
    //  bus.rotation.z += 0.01;

			quaternion.setFromAxisAngle(axis, 0.01);
			bus.position.applyQuaternion(quaternion);

  }


   ringSphere.rotation.y = time / 1000;

		quaternion.setFromAxisAngle(axis, 0.01);
		ringSphere.position.applyQuaternion(quaternion);





  spotLight.angle = option.angle;
  spotLight.penumbra = option.penumbra;
  spotLight.intensity = option.intensity;
  sLightHelper.update();



	renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);


window.addEventListener('resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});