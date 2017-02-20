import { multiply } from "../utils/vectors";

const { sin, cos } = Math;

export function rotate_x_matrix(angle) {
  const s = sin(angle);
  const c = cos(angle);
  return [
    [ 1,  0,  0],
    [ 0,  c,  s],
    [ 0, -s,  c]
  ];
};

export function rotate_y_matrix(angle) {
  const s = sin(angle);
  const c = cos(angle);
  return [
    [ c,  0, -s],
    [ 0,  1,  0],
    [ s,  0,  c]
  ];
};

export function rotate_z_matrix(angle) {
  const s = sin(angle);
  const c = cos(angle);
  return [
    [ c,  s,  0],
    [-s,  c,  0],
    [ 0,  0,  1]
  ];
};

export function rotate_x(M, angle) {
  return multiply(rotate_x_matrix(angle), M);
};

export function rotate_y(M, angle) {
  return multiply(rotate_y_matrix(angle), M);
};

export function rotate_z(M, angle) {
  return multiply(rotate_z_matrix(angle), M);
};
