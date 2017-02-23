import * as d3 from "d3";

import { STATION_COLOURS } from "../constants";

function flipped_stereographic(λ, φ)  {
  const cosλ = Math.cos(λ),
      cosφ = Math.cos(φ),
      k = 1 / (1 + cosλ * cosφ);
  return [
    k * cosφ * Math.sin(λ),
    -k * Math.sin(φ)
  ];
}

export default function({ container, width, height, padding, name, mask_angle }) {

  const scale = width * .4;

  const wrapper = container.append("div")
      .attr("class", "station-view-wrapper")
      .style("margin-right", padding + "px");

  const root = wrapper.append("svg")
      .attr("width", width)
      .attr("height", height)

  const description = wrapper.append("div");

  function update_description({ name, latitude, longitude }) {
    description.html(`
      <h2>Ground Station ${name}</h2>
      <p>
        latitude: <b>${latitude.toFixed(4)}°</b><br />
        longitude: <b>${longitude.toFixed(4)}°</b>
      </p>
    `);
  }

  const formatTime = d3.timeFormat("%-I %p"),
        formatNumber = d3.format(".1f"),
        formatAngle = function(d) { return formatNumber(d) + "°"; };

  const projection = d3.geoProjection(flipped_stereographic)
      .scale(scale)
      .clipAngle(130)
      .rotate([0, -90])
      .translate([width / 2 + .5, height / 2 + .5])
      .precision(.1);

  const path = d3.geoPath(projection);

  root.append("path")
      .datum(d3.geoCircle().center([0, 90]).radius(90))
      .attr("class", "horizon")
      .attr("d", path);

  const wrapping_circle = d3.geoCircle().center([0, 90]).radius(180);
  const circle_hole = d3.geoCircle().center([0, 90]).radius(90 - mask_angle);

  root.append("path")
      .attr("class", "mask")
      .attr("fill-rule", "evenodd")
      .attr("d", path(wrapping_circle()) + " " + path(circle_hole()));

  root.append("path")
      .datum(d3.geoGraticule())
      .attr("class", "graticule")
      .attr("d", path);

  const ticksAzimuth = root.append("g")
      .attr("class", "ticks ticks--azimuth");

  ticksAzimuth.selectAll("line")
      .data(d3.range(0, 360, 30))
    .enter().append("line")
      .each(function(d) {
        const p0 = projection([d, 0]),
              p1 = projection([d, d % 10 ? -1 : -2]);

        d3.select(this)
            .attr("x1", p0[0])
            .attr("y1", p0[1])
            .attr("x2", p1[0])
            .attr("y2", p1[1]);
      });

  ticksAzimuth.selectAll("text")
      .data(d3.range(0, 360, 30))
    .enter().append("text")
      .each(function(d) {
        const p = projection([d, -8]);

        d3.select(this)
            .attr("x", p[0])
            .attr("y", p[1]);
      })
      .attr("dy", ".35em")
      .text(function(d) { return d === 0 ? "N" : d === 90 ? "E" : d === 180 ? "S" : d === 270 ? "W" : d + "°"; });

  root.append("g")
      .attr("class", "ticks ticks--elevation")
    .selectAll("text")
      .data(d3.range(30, 91, 30))
    .enter().append("text")
      .each(function(d) {
        const p = projection([0, d]);

        d3.select(this)
            .attr("x", p[0])
            .attr("y", p[1]);
      })
      .attr("dy", ".35em")
      .text(function(d) { return d + "°"; });

  const tracksContainer = root.append("g");

  function noop() {}

  noop.tracks = function(tracks) {

    const update = tracksContainer.selectAll(".track")
      .data(tracks);

    update.enter()
      .append("path")
      .attr("class", "track")
      .style("stroke", STATION_COLOURS[name])
    .merge(update)
      .attr("d", path);

    update.exit().remove();

    return noop;
  };

  noop.station = function([longitude, latitude]) {
    update_description({ name, longitude, latitude });
    return noop;
  };

  noop.satellite = function(position) {
    // TODO
    if (position == null) {
      return;
    }
    const [azimuth, elevation] = position;
    return noop;
  };

  return noop;
}
