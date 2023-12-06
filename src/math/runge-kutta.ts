type RungeKuttaF = (t: number, yt: number) => number;

export type RKResult = [number, number][];

/** Runge-Kutta implementation
 * Source: https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
 */
export function RK4(f: RungeKuttaF, y0: number, t0: number, tMax: number, h = 1e-5): RKResult {
  const results: RKResult = [[t0, y0]];

  let t = t0;
  let y = y0;
  const steps = Math.abs(t0 - tMax) / h;

  for (let n = 1; n <= steps; n++) {
    const k1 = f(t, y);
    const k2 = f(t + h / 2, y + (h * k1) / 2);
    const k3 = f(t + h / 2, y + (h * k2) / 2);
    const k4 = f(t + h, y + h * k3);

    y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4); // y_n+1
    t += h * (t0 < tMax ? 1 : -1);

    results.push([t, y]);
  }

  return results;
}
