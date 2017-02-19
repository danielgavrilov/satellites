import { deg_to_rad } from "./utils";

export const SECONDS_PER_DAY = 60 * 60 * 24;

export const EARTH_RADIUS_EQUATORIAL = 6378.137;
export const EARTH_RADIUS_POLAR = 6356.752;
export const EARTH_RADIUS_AVERAGE = (EARTH_RADIUS_EQUATORIAL + EARTH_RADIUS_POLAR) / 2;

export const EARTH_ECI_ANOMALY = deg_to_rad(280.4606); // radians
export const EARTH_RADIANS_PER_DAY = deg_to_rad(360.9856473662); // radians per day

export const J2000 = new Date(2000, 0, 1, 12, 0, 0);
