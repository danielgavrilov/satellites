import _ from "lodash";

import {
  EARTH_RADIUS_AVERAGE,
  EARTH_ECI_ANOMALY,
  EARTH_RADIANS_PER_DAY,
  SECONDS_PER_DAY
} from "../constants";

import { deg_to_rad, date_to_j2000_seconds, magnitude } from "../utils";
import { rotate_z } from "./rotations";

const { sin, cos, sqrt, atan2, PI: π } = Math;

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
  const φ = atan2(z, sqrt(x*x + y*y));
  const h = magnitude([x, y, z]) - EARTH_RADIUS_AVERAGE;
  return { λ, φ, h };
}

export function latlon_to_ecef({ λ, φ, h }) {

  const sinφ = sin(φ),
        cosφ = cos(φ),
        sinλ = sin(λ),
        cosλ = cos(λ);

  const r = h + EARTH_RADIUS_AVERAGE;
  const x = r * cosφ * cosλ;
  const y = r * cosφ * sinλ;
  const z = r * sinφ;

  return [x, y, z];
}

export function latlon_to_enu({ λ, φ }) {

  const sinφ = sin(φ),
        cosφ = cos(φ),
        sinλ = sin(λ),
        cosλ = cos(λ);

  const e = [
    -sinλ,
    cosλ,
    0
  ];

  const n = [
    -cosλ * sinφ,
    -sinλ * sinφ,
    cosφ * k
  ];

  const u = [
    cosλ * cosφ,
    sinλ * cosφ,
    sinφ
  ];

  return { e, n, u };
}

export function ecef_to_enu([x, y, z]) {
  return latlon_to_enu(ecef_to_latlon([x, y, z]));
}
