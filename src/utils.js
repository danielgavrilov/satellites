import math from "mathjs";

export const {sin, cos, sqrt, pow, abs, atan2, PI:π} = Math;
export const {dot, cross, norm} = math;

export const J2000 = new Date(2000, 0, 1, 12, 0, 0);

export function normalise_angle(angle) {
  angle = angle % π;
  if (angle < 0) angle += 2 * π;
  return angle;
}
