import * as d3 from "d3";

import rise_and_set_graph from "./rise-and-set";
import multi_line_graph from "./differences";

var formatMillisecond = d3.timeFormat(".%L"),
    formatSecond = d3.timeFormat(":%S"),
    formatMinute = d3.timeFormat("%H:%M"),
    formatHour = d3.timeFormat("%H:%M"),
    formatDay = d3.timeFormat("%d %b %Y");

function multiFormat(date) {
  return (d3.timeSecond(date) < date ? formatMillisecond
      : d3.timeMinute(date) < date ? formatSecond
      : d3.timeHour(date) < date ? formatMinute
      : d3.timeDay(date) < date ? formatHour
      : formatDay)(date);
}

export default function({ container, extent, width }) {

  const margin = {top: 20, bottom: 0, left: 80, right: 20},
        height = 500;

  const svg = container.append("svg")
      .attr("width", width + margin.left)
      .attr("height", height)
      .style("margin-left", -margin.left + "px");

  const root = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleTime()
      .domain(extent)
      .range([0, width]);

  const axis = d3.axisTop(x)
      .tickFormat(multiFormat)
      .tickSize(-height)
      .tickPadding(10)
      .ticks(12);

  const axisElem = root.append("g")
      .attr("class", "x-axis axis")
      .call(axis);

  axisElem.selectAll(".tick")
      .classed("day", (d) => +d3.timeDay(d) == +d);

  const rise_and_set_container = root.append("g")
    .attr("class", "rise-and-set-container")
    .attr("transform", "translate(0, 10)");

  const rise_and_set = rise_and_set_graph({
    container: rise_and_set_container,
    x,
    width
  });

  const differences_container = root.append("g")
    .attr("class", "differences-container")
    .attr("transform", "translate(0, 130)");

  const differences = multi_line_graph({
    container: differences_container,
    x,
    width,
    height: 100
  });

  return {
    rise_and_set,
    differences
  };
}

/*



*/
