import station_view from "./transforms/station-view";
import { group_consecutive } from "./utils/arrays";

export default function rise_and_set(track, station_latlon, mask_angle) {

  const get_azimuth_elevation = station_view(station_latlon);

  const items = track.map((point) => {
    const { elevation, azimuth } = get_azimuth_elevation(point.ecef.r);
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
