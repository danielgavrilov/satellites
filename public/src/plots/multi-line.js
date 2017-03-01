import * as d3 from "d3";

import legend from "./legend";

export default function({ container, x, width, height }) {

  const overflow = { top: 5, bottom: 5, left: 160, right: 10 };

  const svg = container.append("svg")
      .attr("width", width + overflow.left + overflow.right)
      .attr("height", height + overflow.top + overflow.bottom)
      .attr("class", "multi-line-graph")
      .style("margin-top", -overflow.top + "px")
      .style("margin-bottom", -overflow.bottom + "px")
      .style("margin-left", -overflow.left + "px")
      .style("margin-right", -overflow.right + "px");

  const root = svg.append("g")
      .attr("transform", `translate(${overflow.left}, ${overflow.top})`);

  const y = d3.scaleLinear()
      .range([height, 0]);

  const ticks = Math.ceil(height / 15);

  const yAxis = d3.axisLeft(y)
      .ticks(ticks)
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
      .attr("transform", "translate(-60, 0)");

  const unitElem = root.append("g")
      .attr("transform", `translate(-45, ${height/2}) rotate(-90)`)
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
      item_size: 11,
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
