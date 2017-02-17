import {abs, sin, cos} from "../utils";

export default function solve_kepler(M, e) {
  let E = M;
  let x;
  while (abs(x = f(M, E, e)) > 1e-7) {
    E -= x / df(E, e);
  }
  return E;
}

function f(M, E, e) {
  return E - e * sin(E) - M;
}

function df(E, e) {
  return 1 - e * cos(E);
}
