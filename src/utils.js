import { pi as π } from "mathjs";

import { J2000 } from "./constants";

export function magnitude(vector, dimensions=3) {
  let sum = 0;
  for (let i = 0; i < dimensions; i++) {
    sum += vector[i] * vector[i];
  }
  return Math.sqrt(sum);
}

export function normalise_angle(angle) {
  angle = angle % (2 * π);
  if (angle < 0) angle += 2 * π;
  return angle;
}

export function deg_to_rad(degrees) {
  return (degrees * π) / 180;
}

export function rad_to_deg(radians) {
  return (radians * 180) / π;
}

export function rad_to_latitude(radians) {
  const angle = normalise_angle(radians);
  const degrees = rad_to_deg(angle);
  if (degrees <= 90) {
    return degrees;
  } else if (degrees <= 270) {
    return 180 - degrees;
  } else {
    return degrees - 360;
  }
}

export function rad_to_longitude(radians) {
  const angle = normalise_angle(radians);
  const degrees = rad_to_deg(angle);
  if (degrees > 180) {
    return degrees - 360;
  } else {
    return degrees;
  }
}

export function date_to_j2000_seconds(date) {
  return ((+date) - (+J2000)) / 1000;
}
