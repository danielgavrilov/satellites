import _ from "lodash";

/**
 * Given a calc_k function, it produces an RK4 step function that takes current
 * state and step size, and produces the next state (after the given step size).
 * @param  {Function} calc_k
 * @return {Function}
 */
function generate_rk4_step_function(calc_k) {
  return function({ r: x0, v: v0, GM }, h) {

    function calc_xk23([x0, v0, k1]) {
      return x0 + 0.5 * h * v0 + k1 / 4;
    }

    function calc_xk4([x0, v0, k3]) {
      return x0 + h * v0 + k3;
    }

    function calc_x1([x0, v0, k1, k2, k3]) {
      const P = (k1 + k2 + k3) / 3;
      return x0 + h * v0 + P;
    }

    function calc_v1([v0, k1, k2, k3, k4]) {
      const Q = (k1 + 2*k2 + 2*k3 + k4) / 3;
      return v0 + Q / h;
    }

    // k1

    const k1 = calc_k(x0, h, GM);

    // k2

    const xk2 = _.zip(x0, v0, k1).map(calc_xk23);
    const k2 = calc_k(xk2, h, GM);

    // k3

    const xk3 = _.zip(x0, v0, k2).map(calc_xk23);
    const k3 = calc_k(xk3, h, GM);

    // k4

    const xk4 = _.zip(x0, v0, k3).map(calc_xk4);
    const k4 = calc_k(xk4, h, GM);

    // x1 & v1 (outputs)

    const x1 = _.zip(x0, v0, k1, k2, k3).map(calc_x1);
    const v1 = _.zip(v0,     k1, k2, k3, k4).map(calc_v1);

    return {
      r: x1,
      v: v1
    };

  }
}

/**
 * Given a calc_k function, it produces an RK4 propagator—this is different from
 * (but uses) the one above as it can produce multiple values at multiple steps.
 * @param  {Function} calc_k
 * @return {Function}
 */
export default function(calc_k) {

  const step = generate_rk4_step_function(calc_k);

  /**
   * Given the initial conditions, it produces a sequence of predictions using
   * the Runge-Kutta 4 method.
   *
   * @param  {Array} r      Position vector (in km)
   * @param  {Array} v      Velocity vector (in km/s)
   * @param  {Date} time    The reference time
   * @param  {Number} GM    Gravitational constant × mass
   * @param  {Number} steps Number of steps
   * @param  {Number} step_size Step size in seconds
   * @return {Array}        Array of position & velocity predictions
   */
  return function({ r, v, time, GM }, steps, step_size=10) {
    let predictions = [];
    for (let i = 0; i < steps; i++) {
      // include the initial conditions in the predictions array
      predictions.push({ r, v, time });
      // get the next position & velocity
      ({ r, v } = step({ r, v, GM }, step_size));
      // update the time by the given timestep
      time = new Date(+time + step_size * 1e3);
    }
    return predictions;
  }
}
