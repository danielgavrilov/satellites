import * as d3 from "d3";
import * as topojson from "topojson";
import { geoWinkel3 } from "d3-geo-projection";

import data from "./data";
import kep2cart from "./calculations/kep2cart";
import cart2kep from "./calculations/cart2kep";
import propagate_kepler from "./calculations/propagate-kepler";
import { eci_to_ecef, ecef_to_latlon } from "./calculations/coordinates";

const { keplerian, cartesian, GM, time } = data["jason-2"];
const { r, v } = cartesian;

const propagate_kepler_jason2 = propagate_kepler({r, v, GM, time});

// =============================================================================

const π = Math.PI;

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
  const { longitude, latitude } = position;
  return [longitude, latitude];
});

const datum = {
  type: "LineString",
  coordinates: coords
};

const width = 960,
      height = 480;

const projection = d3.geoEquirectangular()
    .scale(height / π)
    .translate([width / 2, height / 2])
    .precision(.1);

const path = d3.geoPath()
    .projection(projection);

const graticule = d3.geoGraticule();

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("path")
    .datum(datum)
    .attr("class", "ground-track")
    .attr("d", path);

d3.json("/data/world-110m.json", function(error, world) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
});
