import _ from "lodash";

import topocentric_generator from "./transforms/topocentric";
import { group_consecutive } from "./utils/arrays";

/**
 * Given a track of positions, a station latitude/longitude and a mask angle, it
 * returns all intervals for which the positions are above the elevation of the
 * mask angle, relative to the station.
 *
 * @param {Array} track
 * @param {Object} station_latlon Station position in {λ, φ} format
 * @param {Number} mask_angle     Mask angle in radians
 * @return {Array} Intervals
 */
export default function rise_and_set(track, station_latlon, mask_angle) {

  const topocentric = topocentric_generator(station_latlon);

  const items = track.map((point) => {
    const { elevation, azimuth } = topocentric(point.ecef.r);
    return {
      elevation,
      azimuth,
      point,
      time: point.time
    };
  });

  const rise_and_set_groups = group_consecutive(items, ({ elevation }) => {
    return elevation >= mask_angle;
  });

  const result = rise_and_set_groups.map((items) => {
    const rise = items[0].time;
    const set = items[items.length-1].time;
    const duration = ((+set) - (+rise)) / 1e3;
    const track = items.map(({ point }) => point);
    const relative_track = items.map(({ elevation, azimuth, time }) => {
      return { elevation, azimuth, time };
    });
    return { rise, set, duration, track, relative_track };
  });

  return result;

}

export function combine_rise_and_set(rise_and_set_array) {

  const rise_and_set = _.sortBy(_.flatten(rise_and_set_array), (d) => d.rise);
  const intervals = [];

  let { rise, set, duration } = rise_and_set[0];

  for (let i = 1; i < rise_and_set.length; i++) {
    const d = rise_and_set[i];
    if (d.rise <= set && d.set > set) {
      set = d.set;
      duration = set - rise;
    } else {
      intervals.push({ rise, set, duration });
      ({ rise, set, duration } = d);
    }
  }

  return intervals;
}
