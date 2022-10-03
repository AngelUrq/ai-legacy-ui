import * as THREE from "three";

export function createPlanet(texture, textureLoader, position) {

  let size = getRandom(5, 30);

  if (texture.length == 1) {
    size = 70;
  }

  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture[getRandom(0, texture.length - 1)]),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();

  obj.add(mesh);

  mesh.position.x = position[0] * 1500;
  mesh.position.y = position[1] * 1500;
  mesh.position.z = position[2] * 1500;

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
    a.map((x, i) => Math.abs(x - b[i]) ** 2).reduce((sum, now) => sum + now) **
    (1 / 2)
  );
}
