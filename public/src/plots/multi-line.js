import * as d3 from "d3";

import legend from "./legend";

export default function({ container, x, width, height }) {

  const overflow = { left: 160, right: 0 };

  const svg = container.append("svg")
      .attr("width", width + overflow.left + overflow.right)
      .attr("height", height)
      .attr("class", "multi-line-graph")
      .style("margin-left", -overflow.left + "px")
      .style("margin-right", -overflow.right + "px");

  const root = svg.append("g")
      .attr("transform", `translate(${overflow.left}, 0)`);

  const y = d3.scaleLinear()
      .range([height, 0]);

  const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickPadding(10)
      .tickSize(-width);

  const yAxisElem = root.append("g")
      .attr("class", "y-axis");

  const line = d3.line()
      .curve(d3.curveLinear)
      .x((d) => x(d.time))
      .y((d) => y(d.value));

  const legend_container = root.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(-50, 0)");

  const unitElem = root.append("g")
      .attr("transform", `translate(-30, ${height/2}) rotate(-90)`)
    .append("text")
      .attr("class", "unit");

  function noop() {}

  noop.plot = function(lines, { labels, colours=d3.schemeCategory10, unit="" }) {

    y.domain([
      d3.min(lines, (c) => { return d3.min(c, (d) => d.value); }),
      d3.max(lines, (c) => { return d3.max(c, (d) => d.value); })
    ]);

    const update = root.selectAll(".line").data(lines);

    update.enter().append("path")
        .attr("class", "line")
      .merge(update)
        .attr("d", line)
        .style("stroke", (d, i) => colours[i]);

    update.exit().remove();

    yAxisElem.call(yAxis);

    unitElem.text(unit);

    legend({
      container: legend_container,
      item_size: 12,
      padding: 5,
      orient: "left",
      height,
      labels,
      colours
    });

    return noop;
  };

  return noop;
}
