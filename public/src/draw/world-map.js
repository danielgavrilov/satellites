import * as d3 from "d3";
import * as topojson from "topojson";

const π = Math.PI;

export default function(svg) {

  const width = svg.attr("width"),
        height = svg.attr("height");

  const projection = d3.geoEquirectangular()
      .scale(height / π)
      .translate([width / 2, height / 2])
      .precision(.1);

  const path = d3.geoPath()
      .projection(projection);

  const graticule = d3.geoGraticule();

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

  const track_path = svg.append("path")
      .attr("class", "ground-track");

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

  function track(datum) {
    track_path.datum(datum).attr("d", path);
  }

  function stations(station_latlon) {

  }

  return { track, stations };
}
