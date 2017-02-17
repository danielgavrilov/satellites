export const {PI:π} = Math;
export const J2000 = new Date(2000, 0, 1, 12, 0, 0);

export function normalise_angle(angle) {
  angle = angle % π;
  if (angle < 0) angle += 2 * π;
  return angle;
}

export function deg_to_rad(degrees) {
  return (degrees * π) / 180;
}

export function rad_to_deg(radians) {
  return (radians * 180) / π;
}
