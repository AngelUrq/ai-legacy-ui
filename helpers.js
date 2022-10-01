import * as THREE from "three";

export function createPlanet(texture, textureLoader) {
  const size = getRandom(5, 30);

  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture[getRandom(0, texture.length - 1)]),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  mesh.position.x = getRandom(-500, 500);
  mesh.position.y = getRandom(-500, 500);
  mesh.position.z = getRandom(-500, 500);

  return { mesh, obj };
}

export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
