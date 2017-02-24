import _ from "lodash";

import {
  EARTH_RADIUS_AVERAGE,
  EARTH_ECI_ANOMALY,
  EARTH_RADIANS_PER_DAY,
  SECONDS_PER_DAY
} from "../constants";

import { date_to_j2000_seconds } from "../utils/dates";
import { magnitude, divide, cross } from "../utils/vectors";
import { rotate_z } from "./rotations";

const { sin, cos, sqrt, atan2, PI: π } = Math;

/**
 * Given a position vector and a time, it converts the vector from ECI to ECEF.
 * @param  {Array} [x, y, z] Position vector (in km)
 * @param  {Date} time
 * @return {Array} The resulting vector
 */
export function eci_to_ecef([x, y, z], time) {
  if (!_.isDate(time)) {
    throw new Error("eci_to_ecef() received an invalid time.");
  }
  const seconds = date_to_j2000_seconds(time);
  const days = seconds / SECONDS_PER_DAY;
  const Θ = (EARTH_ECI_ANOMALY + EARTH_RADIANS_PER_DAY * days) % (2*π);
  return rotate_z([x, y, z], Θ);
}

/**
 * Converts an ECEF vector to latitude/longitude/height.
 * @param  {Array} [x, y, z] The ECEF position vector (in km)
 * @return {Object}
 */
export function ecef_to_latlon([x, y, z]) {
  const λ = atan2(y, x);
  const φ = atan2(z, sqrt(x*x + y*y));
  const h = magnitude([x, y, z]) - EARTH_RADIUS_AVERAGE;
  return { λ, φ, h };
}

/**
 * Converts latitude/longitude/height to an ECEF vector.
 * @param  {Object} {λ, φ, h} Longitude, latitude & height
 * @return {Array} The ECEF position vector in km
 */
export function latlon_to_ecef({ λ, φ, h=0 }) {

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

/**
 * Creates an ENU basis at the given latitude/longitude.
 * @param  {Object} {λ, φ} Longitude & latitude
 * @return {Object} {e, n, u} The e, n & u vectors.
 */
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
    cosφ
  ];

  const u = [
    cosλ * cosφ,
    sinλ * cosφ,
    sinφ
  ];

  return { e, n, u };
}

/**
 * Convenience function that produces an ENU basis from an ECEF vector.
 * @param  {Array} [x, y, z] The ECEF position vector (in km)
 * @return {Object} {e, n, u} The e, n & u vectors
 */
export function ecef_to_enu([x, y, z]) {
  return latlon_to_enu(ecef_to_latlon([x, y, z]));
}

/**
 * Given an ECI position & velocity, it produces HCL basis vectors.
 * @param  {Object} {r, v} The ECI position & velocity
 * @return {Object} {h, c, l} The HCL basis vectors
 */
export function eci_to_hcl({ r, v }) {
  const rxv = cross(r, v);
  const h = divide(r, magnitude(r));
  const c = divide(rxv, magnitude(rxv));
  const l = cross(c, h);
  return { h, c, l };
}

/**
 * Given an HCI position & velocity and the reference time, it produces its
 * equivalent ECEF vector & lat/long/height.
 * @param  {Array} r    The ECI position vector
 * @param  {Array} v    The ECI velocity vector
 * @param  {Date} time  The reference time
 * @return {Object}
 */
export function eci_to_all_systems({ r, v, time }) {
  const r_ecef = eci_to_ecef(r, time);
  const r_latlon = ecef_to_latlon(r_ecef);
  return {
    eci: { r, v },
    ecef: { r: r_ecef },
    latlon: r_latlon,
    time
  };
}
