const { sin, cos, pow, sqrt } = Math;

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
  const sinω = sin(ω),
        cosω = cos(ω),
        sinΩ = sin(Ω),
        cosΩ = cos(Ω),
        sini = sin(i),
        cosi = cos(i);
  const P = [
    cosΩ * cosω - sinΩ * cosi * sinω,
    sinΩ * cosω + cosΩ * cosi * sinω,
    sini * sinω
  ];
  const Q = [
    -cosΩ * sinω - sinΩ * cosi * cosω,
    cosΩ * cosi * cosω - sinΩ * sinω,
    sini * cosω
  ];
  return { P, Q };
}

// in orbital
export function get_coords_from_true_anomaly(r, ν) {
  const x = r * cos(ν);
  const y = r * sin(ν);
  return { x, y };
}

// turns orbital to ECI
export function get_eci_position(x0, y0, P, Q) {
  const x = x0 * P[0] + y0 * Q[0];
  const y = x0 * P[1] + y0 * Q[1];
  const z = x0 * P[2] + y0 * Q[2];
  return [x, y, z];
}

export function get_eci_velocity(a, r, e, sinE, cosE, P, Q, GM) {
  const f = sqrt(a * GM) / r;
  const g = sqrt(1 - e*e);
  const u = -f * sinE * P[0] + f * g * cosE * Q[0];
  const v = -f * sinE * P[1] + f * g * cosE * Q[1];
  const w = -f * sinE * P[2] + f * g * cosE * Q[2];
  return [u, v, w];
}
