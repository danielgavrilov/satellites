import _ from "lodash";

function generate_rk4_step_function(calc_k) {
  return function({ r: x0, v: v0, GM }, h) {

    function calc_xk2([x0, v0, k1]) {
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

    const xk2 = _.zip(x0, v0, k1).map(calc_xk2);
    const k2 = calc_k(xk2, h, GM);

    // k3

    const k3 = k2.slice();

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

export default function(calc_k) {

  const step = generate_rk4_step_function(calc_k);

  return function({ r, v, time, GM }, steps, step_size) {
    let predictions = [];
    for (let i = 0; i < steps; i++) {
      predictions.push({ r, v, time });
      ({ r, v } = step({ r, v, GM }, step_size));
      time = new Date(+time + step_size * 1e3);
    }
    return predictions;
  }
}
