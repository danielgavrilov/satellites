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
