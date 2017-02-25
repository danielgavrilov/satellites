import _ from "lodash";
import * as d3 from "d3";

import data from "./data";
import propagate_kep from "./propagations/keplerian";
import propagate_rk4 from "./propagations/rk4";
import propagate_rk4_j2 from "./propagations/rk4-j2";
import { deg_to_rad } from "./utils/angles";
import plot_map from "./plots/world-map";
import create_graphs from "./plots/graphs";
import diff_hcl from "./transforms/diff-hcl";
import { WIDTH } from "./constants";
import controller from "./controller";
import { eci_to_all_systems } from "./transforms/coordinates";

import { track_to_plot } from "./transforms/plots";

const { cartesian, GM, time } = data["jason-2"];
const { r, v } = cartesian;

// =============================================================================

const DAYS = 1;

const world_map = plot_map({
  container: d3.select(".world-map-container").select(".content"),
  width: WIDTH
});

const tracks = {
  kep:    propagate_kep({ r, v, GM, time }, DAYS * 8640, 10).map(eci_to_all_systems),
  rk4:    propagate_rk4({ r, v, GM, time }, DAYS * 8640, 10).map(eci_to_all_systems),
  rk4_j2: propagate_rk4_j2({ r, v, GM, time }, DAYS * 8640, 10).map(eci_to_all_systems)
};

const rk4_j2_vs_rk4 = _.zipWith(tracks.rk4_j2, tracks.rk4, (a, b) => {
  return {
    vector: diff_hcl(a.eci, b.eci),
    time: a.time
  }
});

const locations = [
  { φ: deg_to_rad(51.6448), λ: deg_to_rad(-0.3935), h: 0 },
  { φ: deg_to_rad(-50.7587), λ: deg_to_rad(-70.3140), h: 0 },
  { φ: deg_to_rad(52.7723), λ: deg_to_rad(140.1880), h: 0 },
  { φ: deg_to_rad(-33.8571), λ: deg_to_rad(146.5714), h: 0 },
]

const graphs = create_graphs({
  container: d3.select("#graphs").select(".content"),
  width: WIDTH,
  extent: d3.extent(tracks.kep, (d) => d.time)
});

world_map
  .track("kep", track_to_plot(tracks.kep))
  .track("rk4", track_to_plot(tracks.rk4))
  .track("rk4-j2", track_to_plot(tracks.rk4_j2));

graphs.differences.plot(rk4_j2_vs_rk4, {
  labels: ["Height", "Cross-axis", "Along-axis"],
  unit: "km"
});

controller({
  locations,
  world_map,
  graphs,
  track: tracks.rk4_j2,
  views_container: d3.select("#station-views").select(".content")
});
