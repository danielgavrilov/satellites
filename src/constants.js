import { schemeCategory10 } from "d3";

import { deg_to_rad } from "./utils/angles";

export const WIDTH = 840; // poxels

export const SECONDS_PER_DAY = 60 * 60 * 24;

export const EARTH_RADIUS_EQUATORIAL = 6378.137; // km
export const EARTH_RADIUS_POLAR = 6356.752; // km
export const EARTH_RADIUS_AVERAGE = (EARTH_RADIUS_EQUATORIAL + EARTH_RADIUS_POLAR) / 2; // km

export const EARTH_ECI_ANOMALY = deg_to_rad(280.4606); // radians
export const EARTH_RADIANS_PER_DAY = deg_to_rad(360.9856473662); // radians per day

export const MASK_ANGLE = 5; // degrees

export const J2000 = new Date(2000, 0, 1, 12, 0, 0);

export const TRACK_COLOURS = {
  kep: schemeCategory10[2],
  rk4: schemeCategory10[1],
  rk4_j2: schemeCategory10[0]
};
export const STATION_COLOURS = schemeCategory10.slice(2); // HEX colours for plots
