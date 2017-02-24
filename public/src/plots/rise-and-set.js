import { STATION_COLOURS } from "../constants";

const BAR_HEIGHT = 10,
      MID_HEIGHT = BAR_HEIGHT / 2,
      PADDING = 10;

export default function({ container, x, width }) {

  let stations = {};

  function append(container, name) {
    const element = container.append("g")
      .attr("class", "rise-and-set")
      .attr("transform", `translate(0, ${name * (BAR_HEIGHT + PADDING)})`);
    element.append("line")
      .attr("class", "rise-and-set-guide")
      .attr("stroke-width", BAR_HEIGHT)
      .attr("x1", 0)
      .attr("y1", MID_HEIGHT)
      .attr("x2", width)
      .attr("y2", MID_HEIGHT);
    element.append("text")
      .attr("y", MID_HEIGHT)
      .attr("dy", ".1em")
      .attr("class", "ground-station-label")
      .attr("transform", "translate(-10, 0)")
      .text("Station " + name);
    return element;
  }

  function noop() {}

  noop.intervals = function(name, intervals) {

    if (!stations[name]) {
      stations[name] = append(container, name);
    }

    const update = stations[name].selectAll(".interval")
      .data(intervals);

    update.enter().append("rect")
      .attr("class", "interval")
      .attr("y", 0)
      .attr("height", BAR_HEIGHT)
      .style("fill", STATION_COLOURS[name])
    .merge(update)
      .attr("x", (d) => x(d.rise))
      .attr("width", (d) => x(d.set) - x(d.rise))

    update.exit().remove();

    return noop;
  };

  return noop;
}
