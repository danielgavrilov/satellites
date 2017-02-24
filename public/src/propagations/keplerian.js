import _ from "lodash";

import cart2kep from "../transforms/cart2kep";
import { get_gaussian, get_eci_position, get_eci_velocity } from "../transforms/kep2cart";
import { magnitude } from "../utils/vectors";

const { abs, sin, cos, sqrt, pow, atan2 } = Math;

/**
 * Given the mean anomaly (M) and the eccentricity (e), it returns the
 * eccentric anomaly.
 * @param  {Number} M Mean anomaly in radians
 * @param  {Number} e Eccentricity
 * @return {Number}   Eccentric anomaly
 */
function solve_kepler(M, e) {
  let E = M;
  let x;
  do {
    x = f(M, E, e);
    E -= x / df(E, e);
  } while (abs(x) > 1e-7);
  return E;
}

// Convenience function for calculating eccentric anomaly.
function f(M, E, e) {
  return E - e * sin(E) - M;
}

// Derivative of f above.
function df(E, e) {
  return 1 - e * cos(E);
}

/**
 * Given the position and velocity of a satellite in space, as well as the time
 * these were observed, it returns a function.
 * The returned function takes a time and returns the predicted position of the
 * satellite at the given time, using Keplerian propagation.
 * @param  {Array} r    Position vector (in km)
 * @param  {Array} v    Velocity vector (in km/s)
 * @param  {Date} time  The reference time
 * @param  {Number} GM  Gravitational constant × mass
 * @return {Function}
 */
function generator({ r, v, time, GM }) {

  // check if the time received is a Date object
  if (!_.isDate(time)) {
    throw new Error("propagate_kepler() received an invalid time.");
  }

  // calculate Keplerian elements of the orbit
  const {a, e, i, ω, Ω, ν} = cart2kep({r, v, GM});

  // calculate Gaussian vectors
  const { P, Q } = get_gaussian(ω, Ω, i);

  // calculate mean motion
  const n = sqrt(GM / pow(a, 3));

  const rmag = magnitude(r);

  const sinE0 = (rmag * sin(ν)) / (a * sqrt(1 - pow(e, 2)));
  const cosE0 = (rmag * cos(ν)) / a + e;

  const E0 = atan2(sinE0, cosE0);
  const M0 = E0 - e * sinE0;

  return function(t) {

    // calculate time difference from reference time (of measurements)
    // to requested time
    // +date converts a JavaScript date into milliseconds, which is why the
    // value is divided by 1000
    const Δt = ((+t) - (+time)) / 1000; // in seconds

    const Mi = M0 + n * Δt;
    const Ei = solve_kepler(Mi, e);

    const sinEi = sin(Ei);
    const cosEi = cos(Ei);

    const x = a * (cosEi - e);
    const y = a * sqrt(1 - pow(e, 2)) * sinEi;
    const r = a * (1 - e * cosEi);

    const position = get_eci_position(x, y, P, Q);
    const velocity = get_eci_velocity(a, r, e, sinEi, cosEi, P, Q, GM);

    return {
      r: position,
      v: velocity
    }

  }
}

/**
 * Convenience function to generate a sequence of positions in time using
 * Keplerian propagation.
 * It receives the input of `generator` (described above) and additionally the
 * number of steps and step size (seconds), and returns the Keplerian prediction
 * at each time step.
 * @param  {Array} r      Position vector (in km)
 * @param  {Array} v      Velocity vector (in km/s)
 * @param  {Date} time    The reference time
 * @param  {Number} GM    Gravitational constant × mass
 * @param  {Number} steps Number of steps
 * @param  {Number} step_size Step size in seconds
 * @return {Array}        Array of position & velocity predictions
 */
export default function propagate_kepler({ r, v, time, GM }, steps, step_size=10) {

  const propagate = generator({ r, v, time, GM });

  // how _.range works: _.range(0, 10, 2) outputs [0, 2, 4, 6, 8]
  // parameters: _.range(start, end, step)
  const intervals = _.range(
    +time,                           // multiplying by 1e3 (1000) to convert to
    +time + steps * step_size * 1e3, // milliseconds, as JavaScript dates work
    step_size * 1e3                  // work milliseconds
  ).map(ms => new Date(ms));

  return intervals.map((time) => {
    const { r, v } = propagate(time);
    return { r, v, time };
  });
}
