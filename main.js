import "./style.css";
import * as THREE from "three";
import config from "./db.json";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { createPlanet, getNodePositionById, getRandom } from "./helpers";
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

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
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

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const documents = config.documents;

let points = [];

for (let index = 0; index < documents.length; index++) {
  const planet = createPlanet(textures, textureLoader);
  planet.mesh.userData.scores = documents[index].scores;
  planet.mesh.userData.documentId = documents[index].id;
  planet.mesh.userData.title = documents[index].title;
  planet.mesh.userData.keywords = documents[index].keywords;
  planet.mesh.userData.summary = documents[index].summary;
  planet.mesh.userData.authorAffiliations = documents[index].authorAffiliations;
  planet.mesh.userData.downloads = documents[index].downloads;

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
pointLight.position.set(300, 0, 0);
scene.add(pointLight);

function animate() {
  planets.forEach((planet) => {
    planet.mesh.rotateY(getRandom(1, 10) / 1000);
  });

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();

/* Modal */
var modal = document.getElementById("info-modal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
  modal.style.display = "none";
};

const DOWNLOAD_URL = "https://ntrs.nasa.gov";

window.addEventListener("click", (event) => {
  event.preventDefault();

  if (event.target == modal) {
    modal.style.display = "none";
  }

  var canvasBounds = renderer.domElement.getBoundingClientRect();

  clickMouse.x =
    ((event - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) *
      2 -
    1;
  clickMouse.y =
    -(
      (event.clientY - canvasBounds.top) /
      (canvasBounds.bottom - canvasBounds.top)
    ) *
      2 +
    1;

  raycaster.setFromCamera(
    {
      x: (2 * event.offsetX) / event.target.clientWidth - 1,
      y: (-2 * event.offsetY) / event.target.clientHeight + 1,
    },
    camera
  );
  const found = raycaster.intersectObjects(scene.children);

  if (found.length > 0) {
    found.forEach((element) => {
      element.object.userData.documentId;
    });

    const paperData = found[0].object.userData;
    modal.style.display = "block";

    let paperContent = document.getElementById("paper-content");
    let authors = "";
    let url = "";

    paperData.authorAffiliations.forEach(
      (authorAffiliation) =>
        (authors += `${authorAffiliation.meta.author.name},`)
    );
    authors = authors.substring(0, authors.length - 1);

    if (paperData.downloads.length > 0)
      url = DOWNLOAD_URL + paperData.downloads[0].links.original;

    paperContent.innerHTML = `
      <h2>${paperData.title}</h2>
      <p><strong>Authors:</strong>&nbsp;${authors}</p>
      <p><strong>Keywords:</strong>&nbsp;${paperData.keywords}</p>
      <p><strong>Summary:</strong>&nbsp;${paperData.summary}</p>
      <div class="download-container">
        <button class="btn-download" onclick="window.open('${url}', '_blank');">See</button>
      </div>
    `;
  }
});

window.addEventListener("resize", function () {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

/* Query */
const API_URL = "http://192.168.23.74:5000";

const searchButton = document.getElementById("search-button");
searchButton.onclick = function () {
  const query = document.getElementById("searcher").value;
  console.log(query);
  let data = { query };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    res.json().then((embeddings) => console.log(embeddings));
  });
};
