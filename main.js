import "./style.css";
import * as THREE from "three";
import config from "./db.json";
import planetPoint from './planetVector3.json'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { createPlanet, getNodePositionById, getRandom, isPlanetPainted } from "./helpers";
import starsTexture from "./img/sky.jpg";
import sunTexture from "./img/sun.jpg";
import mercuryTexture from "./img/mercury.jpg";
import venusTexture from ".//img/venus.jpg";
import marsTexture from "./img/mars.jpg";
import jupiterTexture from "./img/jupiter.jpg";
import saturnTexture from "./img/saturn.jpg";
import uranusTexture from "./img/uranus.jpg";
import neptuneTexture from "./img/neptune.jpg";
import plutoTexture from "./img/pluto.jpg";

const textures = [
  mercuryTexture,
  venusTexture,
  marsTexture,
  jupiterTexture,
  saturnTexture,
  uranusTexture,
  neptuneTexture,
  plutoTexture,
];
const planets = [];

const renderer = new THREE.WebGLRenderer();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

const controls = new OrbitControls(camera, renderer.domElement);
let normax;
let normay;
let normaz;
let IsNewTarget = false;
let targetPlanet;
controls.target.set(0, 0, 0);
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 20, 100);
controls.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const textureLoader = new THREE.TextureLoader();


const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const documents = config.documents;
const planetPoints = planetPoint.points;
console.log(planetPoints)
let points = [];

for (let index = 0; index < documents.length; index++) {
  const planet = createPlanet(textures, textureLoader, planetPoints[index]);
  planet.mesh.userData.scores = documents[index].scores;
  planet.mesh.userData.documentId = documents[index].id;

  planets.push(planet);
  scene.add(planet.obj);
}

for (let j = 0; j < planets.length; j++) {
  const scores = planets[j].mesh.userData.scores;
  points.push(planets[j].mesh.position);

  for (let k = 0; k < scores.length; k++) {
    if (scores[k].score < 0.3) {
      const point = getNodePositionById(scores[k].id, planets);
      points.push(point);
    }
  }

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
  points = [];
}

const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.position.set(300, 0, 0)
scene.add(pointLight);

function animate() {
  planets.forEach((planet) => {
    planet.mesh.rotateY(getRandom(1, 10) / 1000);
  });
  if (IsNewTarget) {
    camera.lookAt(targetPlanet)
    camera.position.set(camera.position.x + normax*10, camera.position.y + normay*10, camera.position.z + normaz*10)
   
    const distance =  Math.sqrt( Math.pow((targetPlanet.x-camera.position.x), 2) + Math.pow((targetPlanet.y-camera.position.y), 2) + Math.pow(((targetPlanet.z-camera.position.z)), 2) );
    if (distance < 200) {
      IsNewTarget = false;
      controls.target.set(targetPlanet.x, targetPlanet.y, targetPlanet.z + 0.01);
      camera.position.set(camera.position.x , camera.position.y, camera.position.z -200)
      camera.lookAt(targetPlanet);
      targetPlanet = null;

    }
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  event.preventDefault();
  var canvasBounds = renderer.domElement.getBoundingClientRect();

  clickMouse.x = ((event - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
  clickMouse.y = - ((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;

  raycaster.setFromCamera({
    x: 2 * event.offsetX / event.target.clientWidth - 1,
    y: -2 * event.offsetY / event.target.clientHeight + 1
  }, camera);
  const found = raycaster.intersectObjects(scene.children);

  if (found.length > 0) {
    found.forEach((element) => {

      if (element.object.userData.documentId) {
        console.log(element)
        normax = (element.object.position.x - camera.position.x) / element.distance;
        normay = (element.object.position.y - camera.position.y) / element.distance;
        normaz = (element.object.position.z - camera.position.z) / element.distance;
        targetPlanet = element.object.position;
        IsNewTarget = true;
        console.log(normax, " ", normay, " ", normaz)



        //controls.update() must be called after any manual changes to the camera's transform
        //camera.position.set( 0, 20, 100 );
      }



    });
  }
});

window.addEventListener("resize", function () {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
