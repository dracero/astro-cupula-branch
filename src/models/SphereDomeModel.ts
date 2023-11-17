import * as THREE from "three";
import { SphereAnimation } from "../animations/SphereAnimation";

type DiscretizedValues = {
  times: number[];
  positions: THREE.Vec2[];
};

export type SphereDomeModelConditions = {
  domeRadius: number;
  sphereRadius: number;
  thetaStart: number; // Theta is the angle formed by the y+ axis and the position of the sphere relative to the dome's center
  friction: number;
};

type InstantValues = {
  time: number;
  position: THREE.Vec2;
  velocity: THREE.Vec2;
  normalForce: THREE.Vec2;
  frictionForce: THREE.Vec2;
};

export class SphereDomeModel {
  conditions: SphereDomeModelConditions;

  discretizedValues: InstantValues[] = [];

  constructor(values: SphereDomeModelConditions) {
    this.conditions = JSON.parse(JSON.stringify(values));

    this.discretize(SphereAnimation.duration, SphereAnimation.duration * 60);
  }

  private discretize(maxTime: number, steps: number) {
    if (steps < 1) return;

    const { cos, sin, atan, PI } = Math;
    const polar = (r: number, a: number) => new THREE.Vector2(r * cos(a), r * sin(a));
    const g = 9.806;
    const P = new THREE.Vector2(0, -g);

    const { domeRadius: R, sphereRadius: r, friction: mu } = this.conditions;
    const deltaT = maxTime / steps;
    let theta = this.conditions.thetaStart;
    const velocity = new THREE.Vector2(0, 0);
    const position = polar(R + r, PI / 2 - theta);

    for (let i = 0; i <= steps; i++) {
      const time = (maxTime * i) / steps;
      const { x, y } = position;

      // Calculate forces (without mass)
      const u = new THREE.Vector2(cos(theta), -sin(theta));
      const v = new THREE.Vector2(sin(theta), cos(theta));

      if (theta < PI / 2) {
        const Pu = u.clone().multiplyScalar(g * sin(theta));
        var N = v.clone().multiplyScalar(g * cos(theta));
        var Froz = u.clone().multiplyScalar(-mu * N.length() * Pu.length());
      } else {
        N = Froz = new THREE.Vector2(0, 0);
      }

      const instant: InstantValues = {
        time,
        position: { x, y },
        velocity: { x: velocity.x, y: velocity.y },
        normalForce: { x: N.x, y: N.y },
        frictionForce: { x: Froz.x, y: Froz.y },
      };

      this.discretizedValues.push(instant);

      // Make the step
      const acceleration = P.clone().add(N).add(Froz);
      velocity.add(acceleration.clone().multiplyScalar(deltaT));
      position.add(velocity.clone().multiplyScalar(deltaT));

      theta = atan(position.x / position.y);
      if (theta < 0) theta = PI + theta;
    }
  }
}
