import {abs, sin, cos} from "../utils";

export default function solve_kepler(M, e) {
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
