/**
 * Given an angle, it returns a normalised one between 0 and 2π radians.
 * @param  {Number} angle
 * @return {Number}
 */
export function normalise_angle(angle) {
  angle = angle % (2 * Math.PI);
  if (angle < 0) angle += 2 * Math.PI;
  return angle;
}

/**
 * Converts from degrees to radians.
 * @param  {Number} degrees
 * @return {Number}
 */
export function deg_to_rad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Converts from radians to degrees.
 * @param  {Number} radians
 * @return {Number}
 */
export function rad_to_deg(radians) {
  return (radians * 180) / Math.PI;
}
