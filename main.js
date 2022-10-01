import "./style.css";
import * as THREE from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createPlanet, getRandom } from './helpers'
import starsTexture from './img/stars.jpg';
import sunTexture from './img/sun.jpg';
import mercuryTexture from './img/mercury.jpg';
import venusTexture from './/img/venus.jpg';
import earthTexture from './img/earth.jpg';
import marsTexture from './img/mars.jpg';
import jupiterTexture from './img/jupiter.jpg';
import saturnTexture from './img/saturn.jpg';
import saturnRingTexture from './img/saturn ring.png';
import uranusTexture from './img/uranus.jpg';
import uranusRingTexture from './img/uranus ring.png';
import neptuneTexture from './img/neptune.jpg';
import plutoTexture from './img/pluto.jpg';

const textures = [mercuryTexture, venusTexture, marsTexture, jupiterTexture,
  saturnTexture, uranusTexture, neptuneTexture, plutoTexture];
const ringTextures = [saturnRingTexture, uranusRingTexture];
const planets = [];


const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture
]);

const textureLoader = new THREE.TextureLoader();


const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
console.log(innerWidth)
//sun.position = 50
scene.add(sun);
for (let index = 0; index < 50; index++) {
  const planet = createPlanet(textures, ringTextures, textureLoader)
  planets.push(planet);
  scene.add(planet.obj)

}
const mars = createPlanet(textures, ringTextures, textureLoader);
scene.add(mars.obj)
// const planet = createPlanet(textures,ringTextures)
//console.log(planet)
//scene.add(planet.obj)
// scene.add(planet.mesh)

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 500);
scene.add(pointLight);
function animate() {
  //Self-rotation
planets.forEach(planet => {
  //console.log(planet)
  planet.mesh.rotateY(getRandom(1,10)/1000);
  //planet.obj.rotateY(getRandom(1,10)/10000);

});
 
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  //renderer.render(scene, camera);

  renderer.setSize(window.innerWidth, window.innerHeight);
});




