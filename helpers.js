import * as THREE from "three";

<<<<<<< HEAD
export function createPlanet(texture, textureLoader, position) {
=======
export function createPlanet(texture, textureLoader, pdfData, position) {
>>>>>>> dc9caad1430cfc0ceb5eb231578f12cd82a9ea90
  const size = getRandom(5, 30);

  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture[getRandom(0, texture.length - 1)]),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
<<<<<<< HEAD
    
  obj.add(mesh);

  mesh.position.x = position[0]*500;
  mesh.position.y = position[1]*500;
  mesh.position.z = position[2]*500;
=======

  if (pdfData) {
    mesh.userData.title = pdfData.documents.title;
    mesh.userData.summary = pdfData.documents.summary;
    mesh.userData.id = pdfData.documents.id;
    mesh.userData.link = pdfData.documents.downloads.links;
    mesh.userData.keywords = pdfData.documents.keywords;
  }
  obj.add(mesh);

  mesh.position.x = getRandom(-500, 500);
  mesh.position.y = getRandom(-500, 500);
  mesh.position.z = getRandom(-500, 500);
>>>>>>> dc9caad1430cfc0ceb5eb231578f12cd82a9ea90

  return { mesh, obj };
}

export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getNodePositionById(documentId, nodes) {
  return nodes.filter((node) => node.mesh.userData.documentId == documentId)[0]
    .mesh.position;
}

export function isPlanetPainted(documentID, nodes) {
  nodes.forEach((node) => {
    if (node.mesh.userData.documentId == documentID) {
      return node;
    }
  });
}

export function eucDistance(a, b) {
  return (
    a
      .map((x, i) => Math.abs(x - b[i]) ** 2)
      .reduce((sum, now) => sum + now) **
    (1 / 2)
  );
}
