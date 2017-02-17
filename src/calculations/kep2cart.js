import {sin, cos, pow, sqrt, add, multiply} from "mathjs";

export default function kep2cart({a, e, i, ω, Ω, ν, GM}) {

  const p = a * (1 - pow(e, 2));
  const r = p / (1 + e * cos(ν));
  const {P, Q} = get_gaussian(ω, Ω, i);
  const {x, y} = get_coords_from_true_anomaly(r, ν);
  const sinE = y / a * sqrt(1 - pow(e, 2));
  const cosE = x / a + e;

  const position = get_eci_position(x, y, P, Q);
  const velocity = get_eci_velocity(a, r, e, sinE, cosE, P, Q, GM);

  return {
    r: position,
    v: velocity
  }
}

export function get_gaussian(ω, Ω, i) {
  const P = [
    cos(Ω) * cos(ω) - sin(Ω) * cos(i) * sin(ω),
    sin(Ω) * cos(ω) + cos(Ω) * cos(i) * sin(ω),
    sin(i) * sin(ω)
  ];
  const Q = [
    -cos(Ω) * sin(ω) - sin(Ω) * cos(i) * cos(ω),
    cos(Ω) * cos(i) * cos(ω) - sin(Ω) * sin(ω),
    sin(i) * cos(ω)
  ];
  return {P, Q};
}

// in orbital
export function get_coords_from_true_anomaly(r, ν) {
  const x = r * cos(ν);
  const y = r * sin(ν);
  return {x, y};
}

// turns orbital to ECI
export function get_eci_position(x, y, P, Q) {
  const p = multiply(P, x);
  const q = multiply(Q, y);
  return add(p, q);
}

export function get_eci_velocity(a, r, e, sinE, cosE, P, Q, GM) {
  const f = sqrt(a * GM) / r;
  const g = sqrt(1 - pow(e, 2));
  const p = multiply(P, -f * sinE);
  const q = multiply(Q, f * g * cosE);
  return add(p, q);
}
