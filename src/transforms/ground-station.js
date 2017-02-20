import { subtract, divide, dot } from "mathjs";

import { latlon_to_enu, ecef_to_enu } from "./coordinates";
import { magnitude } from "../utils/vectors"

const { asin, atan2 } = Math;

export default function(station_latlon) {

  const { e, n, u } = latlon_to_enu(station_latlon);
  const station_ecef = latlon_to_ecef(station_latlon);

  return function(satellite_ecef) {

    const rss = subtract(satellite_ecef, station_ecef);
    const { e, n, u } = ecef_to_enu(rss);
    const rss_unit = divide(rss, magnitude(rss));

    const rss_e = dot(rss_unit, e);
    const rss_n = dot(rss_unit, n);
    const rss_u = dot(rss_unit, u);

    const elevation = asin(rss_u);
    const azimuth = atan2(rss_e, ess_n);

    return { elevation, azimuth };
  }
}
