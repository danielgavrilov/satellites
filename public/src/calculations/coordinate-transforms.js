import _ from "lodash";
import { sin, cos, sqrt, pow, atan2, norm } from "mathjs";

import { deg_to_rad } from "../utils";
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

export function ecef_to_latlon([x, y, z]) {
  const λ = atan2(y, x);
  const φ = atan2(z, sqrt(pow(x, 2) + pow(y, 2)));
  const h = norm([x, y, z]) - R_avg;
  return { λ, φ, h };
}

export function latlon_to_ecef({ λ, φ, h }) {
  const r = h + R_avg;
  const x = r * cos(φ) * cos(λ);
  const y = r * cos(φ) * sin(λ);
  const z = r * sin(φ);
  return [x, y, z];
}

export function latlon_to_enu({ λ, φ }) {

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

export function ecef_to_enu([x, y, z]) {
  return latlon_to_enu(ecef_to_latlon([x, y, z]));
}
