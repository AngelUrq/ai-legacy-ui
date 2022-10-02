import * as THREE from "three";

export function createPlanet(texture, textureLoader,pdfData) {
  const size = getRandom(5, 30);

  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture[getRandom(0, texture.length - 1)]),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  
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
  mesh.position.z = 0

  return { mesh, obj };
}

export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getNodePositionById(documentId, nodes) {
  return nodes.filter((node) => node.documentId == documentId)[0].mesh.position;
}

export function isPlanetPainted(documentID, nodes){
    nodes.forEach(node => {
        return node.documentId == documentID
        
    });
}