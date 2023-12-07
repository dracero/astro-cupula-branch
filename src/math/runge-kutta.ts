/** Runge-Kutta implementation
 * Source: https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
 *
 * `RK4` receives the last value where `t` ranges to
 *
 * `RK4Conditioned` is a more generic implementation where the step of `t` will stop when the conditions are met
 */

type RungeKuttaF = (t: number, yt: number) => number;

type StopCondition = (y: number, t: number) => boolean;

export type RKResult = [number, number][];

export function RK4(f: RungeKuttaF, y0: number, t0: number, tEnd: number, h = 1e-5): RKResult {
  const condition = (y: number, t: number) => (h > 0 ? t > tEnd : t < tEnd);
  return RK4Conditioned(f, y0, t0, condition, h);
}

export function RK4Conditioned(
  f: RungeKuttaF,
  y0: number,
  t0: number,
  stopCondition: StopCondition,
  h = 1e-5
): RKResult {
  const results: RKResult = [[t0, y0]];

  let t = t0;
  let y = y0;

  while (!stopCondition(y, t)) {
    const k1 = f(t, y);
    const k2 = f(t + h / 2, y + (h * k1) / 2);
    const k3 = f(t + h / 2, y + (h * k2) / 2);
    const k4 = f(t + h, y + h * k3);

    y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4); // y_n+1
    t += h;

    results.push([t, y]);
  }

  return results;
}
