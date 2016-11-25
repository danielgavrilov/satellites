function kep2cart({a, e, i, ω, Ω, ν, GM}) {

  const {P, Q} = get_gaussian(ω, Ω, i);
  const p = a * (1 - pow(e, 2));
  const r = p / (1 + e * cos(ν));
  const {o_x, o_y} = get_coords(r, ν);
  const position = get_position(o_x, o_y, P, Q);
  const sinE = o_y / a * sqrt(1 - pow(e, 2));
  const cosE = o_x / a + e;
  const f = sqrt(a * GM) / r;
  const g = sqrt(1 - pow(e, 2));
  const velocity = get_velocity(f, sinE, g, cosE, P, Q);

  return {
    r: position,
    v: velocity
  }
}

function get_gaussian(ω, Ω, i) {
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
function get_coords(r, ν) {
  const o_x = r * cos(ν);
  const o_y = r * sin(ν);
  return {o_x, o_y};
}

// turns orbital to ECI
function get_position(o_x, o_y, P, Q) {
  const x = o_x * P[0] + o_y * Q[0];
  const y = o_x * P[1] + o_y * Q[1];
  const z = o_x * P[2] + o_y * Q[2];
  return [x, y, z];
}

function get_velocity(f, sinE, g, cosE, P, Q) {
  const u = -f * sinE * P[0] + f * g * cosE * Q[0];
  const v = -f * sinE * P[1] + f * g * cosE * Q[1];
  const w = -f * sinE * P[2] + f * g * cosE * Q[2];
  return [u, v, w];
}
