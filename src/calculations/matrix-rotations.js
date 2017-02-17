import {multiply} from "mathjs";

import {sin, cos} from "../utils";

export function rotate_z_matrix(angle) {
  const sinA = sin(angle);
  const cosA = cos(angle);
  return [
    [ cosA,  sinA,  0],
    [-sinA,  cosA,  0],
    [     0,    0,  1]
  ];
};

export function rotate_z(M, angle) {
  return multiply(rotate_z_matrix(angle), M);
};
