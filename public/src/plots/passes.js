const BAR_HEIGHT = 10,
      COVERAGE_BAR_HEIGHT = 20,
      COVERAGE_COLOUR = "#e7ba52",
      PADDING = 10,
      ITEM_HEIGHT = BAR_HEIGHT + PADDING;

function count_keys(object) {
  let total = 0;
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      total++;
    }
  }
  return total;
}

export default function({ container, x, width }) {

  let stations = {};

  const coverage = append(container, "Coverage", COVERAGE_BAR_HEIGHT);

  function append(container, label, bar_height=BAR_HEIGHT) {
    const count = count_keys(stations);
    const element = container.append("g")
      .attr("class", "passes")
      .attr("transform", `translate(0, ${count * ITEM_HEIGHT})`);
    element.append("line")
      .attr("class", "passes-guide")
      .attr("stroke-width", bar_height)
      .attr("x1", 0)
      .attr("y1", bar_height / 2)
      .attr("x2", width)
      .attr("y2", bar_height / 2);
    element.append("text")
      .attr("y", bar_height / 2)
      .attr("dy", ".1em")
      .attr("class", "ground-station-label")
      .attr("transform", "translate(-10, 0)")
      .text(label);
    if (coverage) {
      coverage.attr("transform", `translate(0, ${(count + 1) * ITEM_HEIGHT})`);
    }
    return element;
  }

  function noop() {}

  function update_pass(container, { passes, colour }, bar_height=BAR_HEIGHT) {

    const update = container.selectAll(".pass")
      .data(passes);

    update.enter().append("rect")
      .attr("class", "pass")
      .attr("y", 0)
      .attr("height", bar_height)
      .style("fill", colour)
    .merge(update)
      .attr("x", (d) => x(d.rise))
      .attr("width", (d) => x(d.set) - x(d.rise))

    update.exit().remove();
  }

  noop.passes = function(name, x) {
    if (!stations[name]) {
      const label = "Station " + name;
      stations[name] = append(container, label);
    }
    update_pass(stations[name], x);
    return noop;
  };

  noop.coverage = function(passes) {
    update_pass(coverage, { passes, colour: COVERAGE_COLOUR }, COVERAGE_BAR_HEIGHT);
    return noop;
  };

  return noop;
}
