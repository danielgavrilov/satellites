import _ from "lodash";
import { sin, cos, sqrt, pow, atan2, norm } from "mathjs";

import {
  EARTH_RADIUS_AVERAGE,
  EARTH_ECI_ANOMALY,
  EARTH_RADIANS_PER_DAY,
  SECONDS_PER_DAY
} from "../constants";

import { deg_to_rad, date_to_j2000_seconds } from "../utils";
import { rotate_z } from "./rotations";

const π = Math.PI;

export function eci_to_ecef(position, date) {
  if (!_.isDate(date)) {
    throw new Error("eci_to_ecef() received an invalid time.");
  }
  const seconds = date_to_j2000_seconds(date);
  const days = seconds / SECONDS_PER_DAY;
  const Θ = (EARTH_ECI_ANOMALY + EARTH_RADIANS_PER_DAY * days) % (2*π);
  return rotate_z(position, Θ);
}

export function ecef_to_latlon([x, y, z]) {
  const λ = atan2(y, x);
  const φ = atan2(z, sqrt(pow(x, 2) + pow(y, 2)));
  const h = norm([x, y, z]) - EARTH_RADIUS_AVERAGE;
  return { λ, φ, h };
}

export function latlon_to_ecef({ λ, φ, h }) {
  const r = h + EARTH_RADIUS_AVERAGE;
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
