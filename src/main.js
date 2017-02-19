import * as d3 from "d3";

import data from "./data";
import kep2cart from "./calculations/kep2cart";
import cart2kep from "./calculations/cart2kep";
import propagate_kepler from "./calculations/propagate-kepler";
import { eci_to_ecef, ecef_to_latlon } from "./calculations/coordinate-transforms";
import { rad_to_longitude, rad_to_latitude } from "./utils";
import draw_map from "./draw/world-map";

const { keplerian, cartesian, GM, time } = data["jason-2"];
const { r, v } = cartesian;

const world_map = draw_map(d3.select("#world-map"));

const propagate_kepler_jason2 = propagate_kepler({r, v, GM, time});

// =============================================================================

const intervals = d3.range(+time, +time + 1 * 8640 * 10e3, 10e3)
    .map(ms => new Date(ms));

const cartesian_positions = intervals.map((time) => {
  const { r, v } = propagate_kepler_jason2(time);
  return { r, v, time };
});

const latlon_positions = cartesian_positions.map(({ r, time }) => {
  return {
    position: ecef_to_latlon(eci_to_ecef(r, time)),
    time
  };
});

const coords = latlon_positions.map(({ position }) => {
  const { λ, φ } = position;
  return [
    rad_to_longitude(λ),
    rad_to_latitude(φ)
  ];
});

const datum = {
  type: "LineString",
  coordinates: coords
};

world_map.track(datum);
