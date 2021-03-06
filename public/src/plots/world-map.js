import _ from "lodash";
import * as d3 from "d3";
import * as topojson from "topojson";

import events from "../events";
import { STATION_COLOURS } from "../constants";
import { deg_to_rad } from "../utils/angles";

const π = Math.PI;

export default function({ container, width }) {

  let tracks = {},
      stations = {},
      passes = {};

  const height = width / 2;

  const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "world-map");

  const root = svg.append("g");

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
      .scaleExtent([1, 50])
      .translateExtent([[0, 0], [width, height]])
      .on("zoom", zoomed)

  function zoomed() {
    const transform = d3.event.transform;
    root.attr("transform", transform);
    graticule_path.style("stroke-width", 0.75 / transform.k);
    borders.style("stroke-width", 0.75 / transform.k);
    _.values(tracks).forEach((path) => {
      path.style("stroke-width", 1.5 / transform.k);
    });
    _.values(passes).forEach((pass) => {
      pass.selectAll(".pass").style("stroke-width", 3 / transform.k);
    });
    _.values(stations).forEach((circle) => {
      circle.attr("r", 4 / Math.log(1 + transform.k))
       .style("stroke-width", 1 / transform.k);
    });
  }

  const drag = d3.drag()
      .on("start", dragstart)
      .on("drag", dragging)
      .on("end", dragend);

  function dragstart({ name }) {
    events.emit("station-tracks:" + name, null);
  }

  function dragging(datum) {
    const p = d3.mouse(this);
    datum.location = projection.invert(p);
    d3.select(this)
      .datum(datum)
      .attr("cx", p[0])
      .attr("cy", p[1]);
  }

  function dragend({ name, location }) {
    const latlon = {
      λ: deg_to_rad(location[0]),
      φ: deg_to_rad(location[1])
    };
    events.emit("station-location:" + name, latlon);
  }

  const refresh_zoom = _.debounce(() => {
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity);
  }, 100);

  refresh_zoom();

  const tracksContainer     = root.append("g").attr("class", "tracks"),
        passesContainer     = root.append("g").attr("class", "passes"),
        stationsContainer   = root.append("g").attr("class", "stations");

  d3.json("maps/world-50m.json", function(error, world) {
    if (error) throw error;

    land.datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

    borders.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
  });


  function noop() {}

  noop.track = function(name, { track, colour }) {
    if (!tracks[name]) {
      tracks[name] = tracksContainer.append("path")
        .attr("class", "ground-track " + name);
    }
    tracks[name].datum(track)
      .attr("d", path)
      .style("stroke", colour);
    return noop;
  };

  noop.station = function(name, [longitude, latitude]) {
    if (!stations[name]) {
      stations[name] = stationsContainer.append("circle")
        .attr("class", "station")
        .attr("r", 5)
        .style("fill", STATION_COLOURS[name])
        .call(drag);
    }
    const p = projection([longitude, latitude]);
    stations[name].datum({ name, location: [longitude, latitude] })
      .attr("cx", p[0])
      .attr("cy", p[1]);
    return noop;
  };

  noop.pass_tracks = function(name, { tracks, colour }) {

    if (!passes[name]) {
      passes[name] = passesContainer.append("g");
    }

    const update = passes[name].selectAll(".pass")
      .data(tracks);

    update.enter()
      .append("path")
      .attr("class", "pass")
      .style("stroke", colour)
    .merge(update)
      .attr("d", path);

    update.exit().remove();

    return noop;
  };

  noop.position = function([longitude, latitude]) {
    // TODO
    return noop;
  };

  return noop;
}
