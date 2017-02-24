import events from "./events";
import rise_and_set from "./rise-and-set";
import station_view from "./plots/station-view";
import { deg_to_rad } from "./utils/angles";
import { relative_track_to_plot, track_to_plot, latlon_to_plot } from "./transforms/plots";
import { WIDTH, MASK_ANGLE } from "./constants";

export default function({ locations, track, world_map, graphs, views_container }) {

  const station_view_padding = 10;
  const station_view_width = (WIDTH - station_view_padding * (locations.length - 1)) / locations.length;

  function populate_from_location(location, i) {
    return {
      name: i,
      location,
      view: station_view({
        container: views_container,
        width: station_view_width,
        height: station_view_width,
        padding: i == (locations.length - 1) ? 0 : station_view_padding,
        name: i,
        mask_angle: MASK_ANGLE
      })
    }
  }

  function update_rise_and_set(d) {
    d.rise_and_set = rise_and_set(track, d.location, deg_to_rad(MASK_ANGLE));
    const relative_tracks = d.rise_and_set.map(({ relative_track }) => {
      return relative_track_to_plot(relative_track)
    });
    d.view.tracks(relative_tracks);
    const tracks = d.rise_and_set.map(({ track }) => track_to_plot(track));
    world_map.cover(d.name, tracks);
    graphs.rise_and_set.intervals(d.name, d.rise_and_set);
  }

  function update_map_location(d) {
    const latlon = latlon_to_plot(d.location)
    world_map.station(d.name, latlon);
    d.view.station(latlon);
  }

  const stations = locations.map(populate_from_location)

  stations.forEach(update_rise_and_set);
  stations.forEach(update_map_location);

  stations.forEach((d) => {
    events.on("station-location:" + d.name, (location) => {
      d.location = location;
      update_map_location(d);
      update_rise_and_set(d);
    });
  });

}
