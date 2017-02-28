import * as d3 from "d3";
import _ from "lodash";

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

export default function({ container, height_container, extent, width }) {

  let height = 500;

  const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height);

  const root = svg.append("g")
      .attr("transform", `translate(0, 20)`);

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

  function adjust_height() {
    height = height_container.property("offsetHeight");
    svg.attr("height", height);
    axis.tickSize(-height)(axisElem);
  }

  const adjust_height_debounced = _.debounce(adjust_height, 10);

  function noop() {}

  noop.append = function(graph, options) {
    const result = graph({ x, ...options });
    adjust_height_debounced();
    return result;
  };

  return noop;

}

/*



*/
