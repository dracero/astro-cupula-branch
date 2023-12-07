import * as THREE from "three";
import { SphereAnimation } from "../animations/SphereAnimation";
import { RK4, RK4Conditioned } from "../math/runge-kutta";

export type SphereDomeModelConditions = {
  domeRadius: number;
  sphereRadius: number;
  thetaStart: number; // Theta is the angle formed by the y+ axis and the position of the sphere relative to the dome's center
  friction: number;
};

export type InstantValues = {
  time: number;
  theta?: number;
  rotation: number;
  position: THREE.Vector2;
  velocity: THREE.Vector2;
  contactForce: THREE.Vector2;
  frictionForce: THREE.Vector2;
};

export class SphereDomeModel {
  conditions: SphereDomeModelConditions;

  discretizedValues: InstantValues[] = [];

  constructor(values: SphereDomeModelConditions) {
    this.conditions = JSON.parse(JSON.stringify(values));

    this.discretize();
  }

  getValuesAt(time: number): InstantValues {
    const { mapLinear, lerp } = THREE.MathUtils;
    const count = this.discretizedValues.length;

    if (time < this.discretizedValues[0].time) return this.discretizedValues[0];
    if (time > this.discretizedValues[count - 1].time) return this.discretizedValues[count - 1];

    for (let i = 0; i < count; i++) {
      const [prev, next] = this.discretizedValues.slice(i, i + 2);

      if (prev.time <= time && time <= next.time) {
        const p = mapLinear(time, prev.time, next.time, 0, 1);

        return {
          time,
          rotation: lerp(prev.rotation, next.rotation, p),
          theta: lerp(prev.theta, next.theta, p),
          position: prev.position.lerp(next.position, p),
          velocity: prev.velocity.lerp(next.velocity, p),
          contactForce: prev.contactForce.lerp(next.contactForce, p),
          frictionForce: prev.frictionForce.lerp(next.frictionForce, p),
        };
      }
    }
  }

  private discretize() {
    // Source: http://www.sc.ehu.es/sbweb/fisica3/solido/cupula/cupula.html

    const { sqrt, sin, cos, acos, PI } = Math;
    const g = 9.806;
    const polar = (r: number, a: number) => new THREE.Vector2(r * cos(a), r * sin(a));
    const { domeRadius: R, sphereRadius: r, friction: mu, thetaStart: theta0 } = this.conditions;

    const dTheta = (t: number, theta: number) => 2 * sqrt((5 * g) / (R + r)) * sin(theta / 2);
    const stopCondition = (theta: number, t: number) => theta > acos(10 / 17);
    const results = RK4Conditioned(dTheta, theta0, 0, stopCondition);

    for (let result of results) {
      var [time, theta] = result;
      const speed = (R + r) * dTheta(time, theta);
      var position = polar(R + r, PI / 2 - theta);
      var velocity = polar(speed, -theta);
      const contactForce = polar(g * cos(theta), PI / 2 - theta);

      const newRotation = -((R + r) * theta) / r;
      var drotation = newRotation - rotation;
      var rotation = newRotation;

      const instant: InstantValues = {
        time,
        theta,
        rotation,
        position,
        velocity,
        contactForce,
        frictionForce: new THREE.Vector2(),
      };

      this.discretizedValues.push(instant);
    }

    const dt = results[1][0] - results[0][0];
    for (time += dt; time <= SphereAnimation.duration; time += dt) {
      const dp = velocity.clone().multiplyScalar(dt);
      position.add(dp);

      rotation += drotation;

      this.discretizedValues.push({
        time,
        rotation,
        position: position.clone(),
        velocity: velocity.clone(),
        contactForce: new THREE.Vector2(),
        frictionForce: new THREE.Vector2(),
      });

      const dv = new THREE.Vector2(0, -g).multiplyScalar(dt);
      velocity.add(dv);
    }
  }
}
