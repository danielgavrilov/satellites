import _ from "lodash";
import moment from "moment";
import {sin, cos, sqrt, pow, atan2, norm} from "mathjs";

import {J2000} from "../utils";
import cart2kep from "./cart2kep";
import {get_gaussian, get_eci_position, get_eci_velocity} from "./kep2cart";
import solve_kepler from "./solve-kepler";

export default function propagate_kepler({r, v, time, GM}) {

  if (!_.isDate(time)) {
    throw new Error("propagate_kepler() received an invalid time.");
  }

  const {a, e, i, ω, Ω, ν} = cart2kep({r, v, GM});
  const n = sqrt(GM / pow(a, 3));

  const rmag = norm(r);

  const sinE0 = (rmag * sin(ν)) / (a * sqrt(1 - pow(e, 2)));
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
    const y = a * sqrt(1 - pow(e, 2)) * sinEi;
    const r = a * (1 - e * cosEi);

    const {P, Q} = get_gaussian(ω, Ω, i);
    const position = get_eci_position(x, y, P, Q);
    const velocity = get_eci_velocity(a, r, e, sinEi, cosEi, P, Q, GM);

    return {
      r: position,
      v: velocity
    }

  }
}
