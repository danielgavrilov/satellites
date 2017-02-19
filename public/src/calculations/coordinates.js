import _ from "lodash";
import { sqrt, pow, atan2, norm } from "mathjs";

import { deg_to_rad, rad_to_longitude, rad_to_latitude } from "../utils";
import { date_to_j2000_seconds } from "./time";
import { rotate_z } from "./matrix-rotations";

const R_equatorial = 6378.137;
const R_polar = 6356.752;
const R_avg = (R_equatorial + R_polar) / 2;

export function eci_to_ecef(position, date) {
  if (!_.isDate(date)) {
    throw new Error("eci_to_ecef() received an invalid time.");
  }
  const seconds = date_to_j2000_seconds(date);
  const days = seconds / 60 / 60 / 24;
  const Θ = deg_to_rad(280.4606 + 360.9856473662 * days);
  return rotate_z(position, Θ);
}

export function ecef_to_latlon_radians([x, y, z]) {
  const λ = atan2(y, x);
  const φ = atan2(z, sqrt(pow(x, 2) + pow(y, 2)));
  const h = norm([x, y, z]) - R_avg;
  return { λ, φ, h };
}

export function ecef_to_latlon([x, y, z]) {
  const { λ, φ, h } = ecef_to_latlon_radians([x, y, z]);
  return {
    latitude: rad_to_latitude(φ),
    longitude: rad_to_longitude(λ),
    height: h
  };
}

export function topocentric_to_enu({ λ, φ, h }) {

  const e = [
    -sin(λ),
    cos(λ),
    0
  ];

  const n = [
    -cos(λ) * sin(φ),
    -sin(λ) * sin(φ),
    cos(φ) * k
  ];

  const u = [
    cos(λ) * cos(φ),
    sin(λ) * cos(φ),
    sin(φ)
  ];

  return { e, n, u };
}
