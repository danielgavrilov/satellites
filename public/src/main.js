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
    coordinates: coords
  };
}

// =============================================================================

const DAYS = 1;

const world_map = draw_map(d3.select("#world-map"));

const predictions_kep     = propagate_kepler({ r, v, GM, time }, DAYS * 8640, 10);
const predictions_rk4     = propagate_rk4({ r, v, GM, time }, DAYS * 8640, 10);
const predictions_rk4_j2  = propagate_rk4_j2({ r, v, GM, time }, DAYS * 8640, 10);

world_map
  .track("kep", transform_for_plot(predictions_kep))
  .track("rk4", transform_for_plot(predictions_rk4))
  .track("rk4-j2", transform_for_plot(predictions_rk4_j2))
