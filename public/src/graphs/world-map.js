import _ from "lodash";
import * as d3 from "d3";
import * as topojson from "topojson";

const π = Math.PI;

export default function(svg) {

  const root = svg.append("g");

  const width = svg.attr("width"),
        height = svg.attr("height");

  const projection = d3.geoEquirectangular()
      .scale(height / π)
      .translate([width / 2, height / 2])
      .precision(.1);

  const path = d3.geoPath()
      .projection(projection);

  const graticule = d3.geoGraticule();

  const graticule_path = root.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

  const land = root.insert("path", ".graticule");
  const borders = root.insert("path", ".graticule");

  const zoom = d3.zoom()
      .scaleExtent([1, 20])
      .translateExtent([[0,0], [width, height]])
      .on("zoom", zoomed)

  svg.call(zoom);
  svg.call(zoom.transform, d3.zoomIdentity);

  let paths = {};

  function zoomed() {
    const transform = d3.event.transform;
    root.attr("transform", transform);
    graticule_path.style("stroke-width", 0.75 / transform.k);
    borders.style("stroke-width", 0.75 / transform.k);
    _.values(paths).forEach((path) => {
      path.style("stroke-width", 1.5 / transform.k);
    });
  }

  d3.json("/data/world-50m.json", function(error, world) {
    if (error) throw error;

    land.datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

    borders.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
  });


  function noop() {}

  noop.track = function(name, datum) {
    if (!paths[name]) {
      paths[name] = root.append("path")
        .attr("class", "ground-track " + name);
    }
    paths[name].datum(datum).attr("d", path);
    return noop;
  }

  noop.stations = function(station_latlon) {
    return noop;
  }

  return noop;
}
