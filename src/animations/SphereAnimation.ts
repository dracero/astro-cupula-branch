import * as THREE from "three";
import { AnimationsManager } from "./AnimationsManager";
import { SphereDomeModel } from "../models/SphereDomeModel";

export class SphereAnimation {
  static readonly name = "sphere-animation";
  static readonly duration = 8; // Seconds

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

    const positions = model.discretizedValues.map((values) => [values.position.x, values.position.y, 0]).flat();
    const times = model.discretizedValues.map((values) => values.time);
    const track = new THREE.VectorKeyframeTrack(".position", times, positions);
    const clip = new THREE.AnimationClip(SphereAnimation.name, -1, [track]);
    this.mixer = new THREE.AnimationMixer(obj);
    this.action = this.mixer.clipAction(clip);
    AnimationsManager.add(this.mixer, SphereAnimation.name);
  }
}
