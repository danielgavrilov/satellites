import * as d3 from "d3";

const DEFAULT_COLOURS = d3.schemeCategory10;
const LEGEND_ITEM_HEIGHT = 10;
const LEGEND_ITEM_PADDING = 4;

/**
 * Given an array of "difference" vectors, it produces 3 arrays: one of only
 * X vaues, one of only Y values and one of only Z values.
 * @param  {Array} vectors
 * @return {Array}
 */
function unzip(vectors) {
  return [0,1,2].map((i) => {
    return vectors.map((d) => {
      return {
        time: d.time,
        value: d.vector[i]
      };
    });
  });
}

export default function({ container, x, height, width }) {

  const root = container.append("g")
      .attr("class", "multi-line-graph");

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

  const legend = root.append("g")
      .attr("class", "legend");

  const unitElem = root.append("g")
      .attr("transform", `translate(-30, ${height/2}) rotate(-90)`)
    .append("text")
      .attr("class", "unit");

  function noop() {}

  noop.plot = function(vectors, { labels=[], colours=DEFAULT_COLOURS, unit="" }) {

    const lines = unzip(vectors);

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

    const legend_height = LEGEND_ITEM_HEIGHT * labels.length + LEGEND_ITEM_PADDING + (labels.length - 1);

    legend.attr("transform", `translate(-60, ${height/2 - legend_height/2})`);

    const legend_update = legend.html("").selectAll(".label")
        .data(labels)
      .enter().append("g")
        .attr("transform", (d, i) => `translate(0, ${i * (LEGEND_ITEM_HEIGHT + LEGEND_ITEM_PADDING)})`);

    legend_update.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", LEGEND_ITEM_HEIGHT)
        .attr("height", LEGEND_ITEM_HEIGHT)
        .style("fill", (d, i) => colours[i]);

    legend_update.append("text")
        .attr("x", -LEGEND_ITEM_PADDING)
        .attr("y", 9)
        .text((d) => d);

    return noop;
  };

  return noop;
}
