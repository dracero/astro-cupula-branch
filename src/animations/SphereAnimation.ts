import * as THREE from "three";
import { SphereDomeModel } from "../models/SphereDomeModel";
import { addDatListener, guiOptions } from "../components/DatGUI";
import { Clock } from "../utils/Clock";

export class SphereAnimation {
  static readonly name = "sphere-animation";
  static readonly duration = 8; // Seconds

  speed: number = guiOptions.speed;
  mixer: THREE.AnimationMixer;
  action: THREE.AnimationAction;

  constructor(obj: THREE.Object3D, model: SphereDomeModel) {
    const positions = model.discretizedValues.map((values) => [values.position.x, values.position.y, 0]).flat();
    const times = model.discretizedValues.map((values) => values.time);
    const track = new THREE.VectorKeyframeTrack(".position", times, positions);
    const clip = new THREE.AnimationClip(SphereAnimation.name, -1, [track]);
    this.mixer = new THREE.AnimationMixer(obj);
    this.action = this.mixer.clipAction(clip);

    addDatListener("datgui-speed", (e) => (this.speed = e.value));

    addDatListener("datgui-togglePlay", () => (this.action.paused = !this.action.paused));
  }

  update() {
    this.mixer.update(Clock.delta * this.speed);
  }

  get time(): number {
    return this.action.time;
  }

  get isPlaying(): boolean {
    return this.action.isRunning();
  }
}
