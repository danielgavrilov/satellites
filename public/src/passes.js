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
export default function passes(track, station_latlon, mask_angle) {

  const topocentric = topocentric_generator(station_latlon);

  const items = track.map((track_item) => {
    const time = track_item.time;
    const { elevation, azimuth } = topocentric(track_item.ecef.r);
    return {
      relative_track: { elevation, azimuth, time },
      track: track_item,
      time
    };
  });

  const passes_groups = group_consecutive(items, (d) => {
    return d.relative_track.elevation >= mask_angle;
  });

  const passes = passes_groups.map((items) => {
    const rise = items[0].time;
    const set = items[items.length-1].time;
    const duration = ((+set) - (+rise)) / 1e3;
    const track = items.map((d) => d.track);
    const relative_track = items.map((d) => d.relative_track);
    return { rise, set, duration, track, relative_track };
  });

  return passes;

}

export function combine_passes(passes_array) {

  const passes = _.sortBy(_.flatten(passes_array), (d) => d.rise);
  const intervals = [];

  let { rise, set, duration } = passes[0];

  for (let i = 1; i < passes.length; i++) {
    const d = passes[i];
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
