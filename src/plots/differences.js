import * as d3 from "d3";

const COLOURS = d3.schemeCategory10;

function unzip(differences) {
  return [0,1,2].map((i) => {
    return differences.map((d) => {
      return {
        time: d.time,
        value: d.vector[i]
      };
    });
  });
}

export default function({ container, x, height, width }) {

  const y = d3.scaleLinear()
      .range([height, 0]);

  const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickPadding(10)
      .tickSize(-width);

  const yAxisElem = container.append("g")
      .attr("class", "y-axis");

  const line = d3.line()
      .curve(d3.curveLinear)
      .x((d) => x(d.time))
      .y((d) => y(d.value));

  function noop() {}

  noop.plot = function(differences) {

    const lines = unzip(differences);

    y.domain([
      d3.min(lines, (c) => { return d3.min(c, (d) => d.value); }),
      d3.max(lines, (c) => { return d3.max(c, (d) => d.value); })
    ]);

    const update = container.selectAll(".line").data(lines);

    update.enter().append("path")
      .attr("class", "line")
    .merge(update)
      .attr("d", line)
      .style("stroke", (d, i) => COLOURS[i]);

    update.exit().remove();

    yAxisElem.call(yAxis);

    return noop;
  };

  return noop;
}
