import _ from "lodash";

import cart2kep from "../transforms/cart2kep";
import { get_gaussian, get_eci_position, get_eci_velocity } from "../transforms/kep2cart";
import { magnitude } from "../utils/vectors";

const { abs, sin, cos, sqrt, pow, atan2 } = Math;

function solve_kepler(M, e) {
  let E = M;
  let x;
  do {
    x = f(M, E, e);
    E -= x / df(E, e);
  } while (abs(x) > 1e-7);
  return E;
}

function f(M, E, e) {
  return E - e * sin(E) - M;
}

function df(E, e) {
  return 1 - e * cos(E);
}

function generator({ r, v, time, GM }) {

  if (!_.isDate(time)) {
    throw new Error("propagate_kepler() received an invalid time.");
  }

  const {a, e, i, ω, Ω, ν} = cart2kep({r, v, GM});
  const { P, Q } = get_gaussian(ω, Ω, i);
  const SQRT_A_TIMES_E_SQUARED = a * sqrt(1 - pow(e, 2));

  const n = sqrt(GM / pow(a, 3));

  const rmag = magnitude(r);

  const sinE0 = (rmag * sin(ν)) / (SQRT_A_TIMES_E_SQUARED);
  const cosE0 = (rmag * cos(ν)) / a + e;

  const E0 = atan2(sinE0, cosE0);
  const M0 = E0 - e * sinE0;

  return function(t) {

    const dt = ((+t) - (+time)) / 1000;

    const Mi = M0 + n * dt;
    const Ei = solve_kepler(Mi, e);

    const sinEi = sin(Ei);
    const cosEi = cos(Ei);

    const x = a * (cosEi - e);
    const y = SQRT_A_TIMES_E_SQUARED * sinEi;
    const r = a * (1 - e * cosEi);

    const position = get_eci_position(x, y, P, Q);
    const velocity = get_eci_velocity(a, r, e, sinEi, cosEi, P, Q, GM);

    return {
      r: position,
      v: velocity
    }

  }
}

export default function propagate_kepler({ r, v, time, GM }, steps, step_size=10) {

  const propagate = generator({ r, v, time, GM });

  const intervals = _.range(
    +time,
    +time + steps * step_size * 1e3,
    step_size * 1e3
  ).map(ms => new Date(ms));

  return intervals.map((time) => {
    const { r, v } = propagate(time);
    return { r, v, time };
  });
}
