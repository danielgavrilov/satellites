import { multiply } from "../utils/vectors";

const { sin, cos } = Math;

/**
 * The functions below create rotation matrices about specific axes at the
 * given angle (in radians).
 */

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

/**
 * Given a vector and an angle, the functions below rotate the vector about
 * specific axes at the given angle.
 */

export function rotate_x(M, angle) {
  return multiply(rotate_x_matrix(angle), M);
};

export function rotate_y(M, angle) {
  return multiply(rotate_y_matrix(angle), M);
};

export function rotate_z(M, angle) {
  return multiply(rotate_z_matrix(angle), M);
};
