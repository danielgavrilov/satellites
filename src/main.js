import * as d3 from "d3";

import data from "./data";
import kep2cart from "./transforms/kep2cart";
import cart2kep from "./transforms/cart2kep";
import propagate_kepler from "./propagations/keplerian";
import propagate_rk4 from "./propagations/rk4";
import propagate_rk4_j2 from "./propagations/rk4-j2";
import { eci_to_ecef, ecef_to_latlon } from "./transforms/coordinates";
import { rad_to_longitude, rad_to_latitude } from "./utils/angles";
import draw_map from "./draw/world-map";
import simplify from "./utils/simplify";

const { keplerian, cartesian, GM, time } = data["jason-2"];
const { r, v } = cartesian;

// =============================================================================

function transform_for_plot(cartesian_positions) {

  const coords = cartesian_positions.map(({ r, time }) => {
    const { λ, φ } = ecef_to_latlon(eci_to_ecef(r, time));
    return [
      rad_to_longitude(λ),
      rad_to_latitude(φ)
    ];
  });

  return {
    type: "LineString",
    coordinates: simplify(coords, .02)
  };
}

// =============================================================================

const DAYS = 1;

const world_map_keplerian = draw_map(d3.select("#world-map-keplerian"));
const world_map_rk4 = draw_map(d3.select("#world-map-rk4"));


const propagate_kepler_jason2 = propagate_kepler({r, v, GM, time});

const intervals = d3.range(+time, +time + DAYS * 8640 * 10e3, 10e3)
    .map(ms => new Date(ms));

const predictions_keplerian = intervals.map((time) => {
  const { r, v } = propagate_kepler_jason2(time);
  return { r, v, time };
});


const predictions_rk4 = propagate_rk4({ r, v, GM, time }, DAYS * 8640, 10);


world_map_keplerian.track(transform_for_plot(predictions_keplerian));
world_map_rk4.track(transform_for_plot(predictions_rk4));
