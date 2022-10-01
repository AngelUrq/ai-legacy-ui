import "./style.css";
import * as THREE from "three";
import config from "./db.json";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createPlanet, getNodePositionById, getRandom } from "./helpers";
import starsTexture from "./img/stars.jpg";
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

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
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
  starsTexture,
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const documents = config.documents;

let points = [];

for (let index = 0; index < documents.length; index++) {
  const planet = createPlanet(textures, textureLoader);
  planet.documentId = documents[index].id;
  planet.scores = documents[index].scores;
  planets.push(planet);
  scene.add(planet.obj);
}

for (let j = 0; j < planets.length; j++) {
  const scores = planets[j].scores;

  points.push(planets[j].mesh.position);

  for (let k = 0; k < scores.length; k++) {
    const point = getNodePositionById(scores[k].id, planets);
    points.push(point);
  }

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
  points = [];
}

const mars = createPlanet(textures, textureLoader);
scene.add(mars.obj);

const pointLight = new THREE.PointLight(0xffffff, 2, 500);
scene.add(pointLight);

function animate() {
  planets.forEach((planet) => {
    planet.mesh.rotateY(getRandom(1, 10) / 1000);
  });

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});
