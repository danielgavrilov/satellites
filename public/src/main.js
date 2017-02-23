import _ from "lodash";
import * as d3 from "d3";

import data from "./data";
import propagate_kep from "./propagations/keplerian";
import propagate_rk4 from "./propagations/rk4";
import propagate_rk4_j2 from "./propagations/rk4-j2";
import { deg_to_rad } from "./utils/angles";
import draw_map from "./plots/world-map";
import graphs from "./plots/graphs";
import diff_hcl from "./transforms/diff-hcl";
import events from "./events";
import { WIDTH, MASK_ANGLE } from "./constants";
import stations_controller from "./controllers/stations";
import tracks_controller from "./controllers/tracks";
import { eci_to_all_systems } from "./transforms/coordinates";

import { track_to_plot } from "./transforms/plots";

const { keplerian, cartesian, GM, time } = data["jason-2"];
const { r, v } = cartesian;

// =============================================================================

const DAYS = 2;

const world_map = draw_map(d3.select("#world-map"));

const tracks = {
  kep:    propagate_kep({ r, v, GM, time }, DAYS * 8640, 10).map(eci_to_all_systems),
  rk4:    propagate_rk4({ r, v, GM, time }, DAYS * 8640, 10).map(eci_to_all_systems),
  rk4_j2: propagate_rk4_j2({ r, v, GM, time }, DAYS * 8640, 10).map(eci_to_all_systems)
};

const rk4_vs_rk4_j2 = _.zipWith(tracks.rk4, tracks.rk4_j2, (a, b) => {
  return diff_hcl(a.eci, b.eci);
});

const locations = [
  { φ: deg_to_rad(30), λ: deg_to_rad(0), h: 0 },
  { φ: deg_to_rad(-30), λ: deg_to_rad(90), h: 0 },
  { φ: deg_to_rad(30), λ: deg_to_rad(180), h: 0 },
  { φ: deg_to_rad(-30), λ: deg_to_rad(270), h: 0 },
]

stations_controller({
  locations,
  world_map,
  track: tracks.rk4_j2,
  views_container: d3.select("#station-views").select(".content")
});

// tracks_controller({ tracks, world_map });

world_map
  // .track("kep", track_to_plot(tracks.kep))
  // .track("rk4", track_to_plot(tracks.rk4))
  .track("rk4-j2", track_to_plot(tracks.rk4_j2))
  // .station(0, latlon_to_plot(stations[0]));

graphs({
  container: d3.select("#graphs").select(".content"),
  width: WIDTH,
  extent: d3.extent(tracks.kep, (d) => d.time)
});
