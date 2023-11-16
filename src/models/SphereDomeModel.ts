import * as THREE from "three";

type DiscretizedValues = {
  times: number[];
  positions: THREE.Vec2[];
};

export type SphereDomeModelValues = {
  domeRadius: number;
  sphereRadius: number;
  thetaStart: number; // Theta is the angle formed by the y+ axis and the position of the sphere relative to the dome's center
  friction: number;
};

export class SphereDomeModel {
  values: SphereDomeModelValues;

  constructor(values: SphereDomeModelValues) {
    this.values = JSON.parse(JSON.stringify(values));
  }

  discretize(maxTime: number, steps: number): DiscretizedValues {
    const result: DiscretizedValues = { times: [], positions: [] as any };

    if (steps < 1) return result;

    const { cos, sin, atan, PI } = Math;
    const polar = (r: number, a: number) => new THREE.Vector2(r * cos(a), r * sin(a));
    const g = 9.806;
    const P = new THREE.Vector2(0, -g);

    const { domeRadius: R, sphereRadius: r, friction: mu } = this.values;
    const deltaT = maxTime / steps;
    let theta = this.values.thetaStart;
    const velocity = new THREE.Vector2(0, 0);
    const position = polar(R + r, PI / 2 - theta);

    for (let i = 0; i <= steps; i++) {
      // Add time state to result
      const time = (maxTime * i) / steps;
      const { x, y } = position;
      result.times.push(time);
      result.positions.push({ x, y });

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

      // Make the step
      const acceleration = P.clone().add(N).add(Froz);
      velocity.add(acceleration.clone().multiplyScalar(deltaT));
      position.add(velocity.clone().multiplyScalar(deltaT));
      theta = atan(position.x / position.y);
      if (theta < 0) theta = PI + theta;
    }

    return result;
  }
}
