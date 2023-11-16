import * as THREE from "three";
import { AnimationsManager } from "./AnimationsManager";
import { SphereDomeModel } from "../models/SphereDomeModel";

export class SphereAnimation {
  static readonly name = "sphere-animation";

  mixer: THREE.AnimationMixer;
  action: THREE.AnimationAction;

  constructor(obj: THREE.Object3D) {
    const thetaStart = Math.atan(obj.position.x / obj.position.y);
    const model = new SphereDomeModel({
      domeRadius: 10,
      sphereRadius: 1,
      friction: 0,
      thetaStart,
    });

    const values = model.discretize(5, 5 * 30);
    const positions = values.positions.map(({ x, y }) => [x, y, 0]).flat();
    const track = new THREE.VectorKeyframeTrack(".position", values.times, positions);
    const clip = new THREE.AnimationClip(SphereAnimation.name, -1, [track]);
    this.mixer = new THREE.AnimationMixer(obj);
    this.action = this.mixer.clipAction(clip);
    AnimationsManager.add(this.mixer, SphereAnimation.name);
  }
}
