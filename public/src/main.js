import _ from "lodash";
import * as d3 from "d3";

import data from "./data";
import { WIDTH, TRACK_COLOURS } from "./constants";

import propagate_kep from "./propagations/keplerian";
import propagate_rk4 from "./propagations/rk4";
import propagate_rk4_j2 from "./propagations/rk4-j2";

import plot_map from "./plots/world-map";
import plot_graphs from "./plots/graphs";
import plot_passes from "./plots/passes";
import plot_lines from "./plots/multi-line";
import plot_legend from "./plots/legend";

import { deg_to_rad, rad_to_deg, normalise_angle } from "./utils/angles";
import { unzip } from "./utils/arrays";
import diff_hcl from "./transforms/diff-hcl";
import { eci_to_all_systems } from "./transforms/coordinates";
import { track_to_plot } from "./transforms/plots";
import controller from "./controller";

const { cartesian, GM, time } = data["jason-2"];
const { r, v } = cartesian;

// =============================================================================

const DAYS = 1;

const world_map = plot_map({
  container: d3.select("#world-map").select(".content"),
  width: WIDTH
});

const tracks = {
  kep:    propagate_kep({ r, v, GM, time }, DAYS * 8640, 10).map(eci_to_all_systems),
  rk4:    propagate_rk4({ r, v, GM, time }, DAYS * 8640, 10).map(eci_to_all_systems),
  rk4_j2: propagate_rk4_j2({ r, v, GM, time }, DAYS * 8640, 10).map(eci_to_all_systems)
};

world_map
  .track("kep", {
    track: track_to_plot(tracks.kep),
    colour: TRACK_COLOURS.kep
  })
  .track("rk4", {
    track: track_to_plot(tracks.rk4),
    colour: TRACK_COLOURS.rk4
  })
  .track("rk4-j2", {
    track: track_to_plot(tracks.rk4_j2),
    colour: TRACK_COLOURS.rk4_j2
  });

const locations = [
  { φ: deg_to_rad(51.6448), λ: deg_to_rad(-0.3935), h: 0 },
  { φ: deg_to_rad(-50.7587), λ: deg_to_rad(-70.3140), h: 0 },
  { φ: deg_to_rad(52.7723), λ: deg_to_rad(140.1880), h: 0 },
  { φ: deg_to_rad(-33.8571), λ: deg_to_rad(146.5714), h: 0 },
]

const graphs = plot_graphs({
  container: d3.select("#axis").select(".content"),
  height_container: d3.select("#graphs"),
  width: WIDTH,
  extent: d3.extent(tracks.kep, (d) => d.time)
});

const passes_graph = graphs.append(plot_passes, {
  container: d3.select("#passes").select(".content"),
  width: WIDTH,
  height: 100
});

const rk4_j2_vs_rk4 = _.zipWith(tracks.rk4_j2, tracks.rk4, (a, b) => {
  return {
    vector: diff_hcl(a.eci, b.eci),
    time: a.time
  }
});

graphs.append(plot_lines, {
  container: d3.select("#rk4_j2-vs-rk4").select(".content"),
  width: WIDTH,
  height: 100
}).plot(unzip(rk4_j2_vs_rk4), {
  labels: ["Height", "Cross-axis", "Along-axis"],
  unit: "km"
});


const tracks_order = ["kep", "rk4", "rk4_j2"];
const tracks_colours = tracks_order.map((key) => TRACK_COLOURS[key]);
const tracks_ordered = tracks_order.map((key) => tracks[key]);
const tracks_labels = ["Keplerian", "RK4", "RK4-J2"];

function map_keplerian(key, transform=_.identity) {
  return function(track) {
    return track.map(({ time, kep }) => {
      return {
        time,
        value: transform(kep[key])
      };
    });
  }
}

function graph_keplerian(key, unit) {
  const transform = unit === "degrees" ? (d) => rad_to_deg(normalise_angle(d)) : _.identity;
  return graphs.append(plot_lines, {
    container: d3.select("#keplerian-" + key).select(".content"),
    width: WIDTH,
    height: 40
  }).plot(tracks_ordered.map(map_keplerian(key, transform)), {
    labels: tracks_labels,
    colours: tracks_colours,
    unit
  });
}

graph_keplerian("a", "km");
graph_keplerian("e");
graph_keplerian("i", "degrees");
graph_keplerian("ω", "degrees");
graph_keplerian("Ω", "degrees");
graph_keplerian("ν", "degrees");

plot_legend({
  container: d3.select("#ground-tracks-legend").append("g").attr("transform", "translate(15, 0)"),
  item_size: 13,
  padding: 6,
  orient: "right",
  labels: tracks_labels,
  colours: [
    "rgba(44, 160, 44, .25)",
    "rgba(255, 127, 14, .25)",
    "rgba(31, 119, 180, .4)"
  ],
  height: 60
});

controller({
  locations,
  world_map,
  passes_graph,
  track: tracks.rk4_j2,
  views_container: d3.select("#station-views").select(".content")
});
