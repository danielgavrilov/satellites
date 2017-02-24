export function normalise_angle(angle) {
  angle = angle % (2 * Math.PI);
  if (angle < 0) angle += 2 * Math.PI;
  return angle;
}

export function deg_to_rad(degrees) {
  return (degrees * Math.PI) / 180;
}

export function rad_to_deg(radians) {
  return (radians * 180) / Math.PI;
}
