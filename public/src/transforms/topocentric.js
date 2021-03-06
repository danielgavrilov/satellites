import { latlon_to_enu, latlon_to_ecef } from "./coordinates";
import { magnitude, subtract, divide, dot } from "../utils/vectors"

const { asin, atan2 } = Math;

/**
 * Given a station position in lat/long, it returns a function that takes
 * a vector and computes its azimuth and elevation relative to the station.
 *
 * @param  {Object} station_latlon Lat/long in a { λ, φ } format
 * @return {Function} A function that takes an ECEF vector and retunrs
 *                    resulting azimuth and elevation
 */
export default function(station_latlon) {

  const { e, n, u } = latlon_to_enu(station_latlon);
  const station_ecef = latlon_to_ecef(station_latlon);

  return function(satellite_ecef) {

    const rss = subtract(satellite_ecef, station_ecef);
    const rss_unit = divide(rss, magnitude(rss));

    const rss_e = dot(rss_unit, e);
    const rss_n = dot(rss_unit, n);
    const rss_u = dot(rss_unit, u);

    const elevation = asin(rss_u);
    const azimuth = atan2(rss_e, rss_n);

    return { elevation, azimuth };
  }
}
