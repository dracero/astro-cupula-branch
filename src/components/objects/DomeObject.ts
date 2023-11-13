import * as THREE from "three";

const ObjectsIndex = {
  directionArrow: "Sphere001_1",
  sphereMesh: "Sphere001_2",
  normalArrow: "Sphere001_3",
};

export class DomeObject extends THREE.Object3D {
  directionArrow: THREE.Object3D;
  normalArrow: THREE.Object3D;

  constructor(scene: THREE.Object3D) {
    super();

    this.add(scene);
    this.traverse((child) => {
      switch (child.name) {
        case ObjectsIndex.directionArrow:
          this.directionArrow = child;
          return;
        case ObjectsIndex.normalArrow:
          this.normalArrow = child;
          return;
      }
    });
  }
}
