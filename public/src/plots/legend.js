import { schemeCategory10 } from "d3";

export default function({ container, height, labels, item_size, padding, orient="left", colours=schemeCategory10 }) {

  const left = orient === "left";

  const legend = container.append("g");

  const legend_height = item_size * labels.length + padding + (labels.length - 1);

  legend.attr("transform", `translate(0, ${height/2 - legend_height/2})`);

  const legend_update = legend.html("").selectAll(".label")
      .data(labels)
    .enter().append("g")
      .attr("transform", (d, i) => `translate(0, ${i * (item_size + padding)})`);

  legend_update.append("rect")
      .attr("x", left ? -item_size : 0)
      .attr("y", 0)
      .attr("width", item_size)
      .attr("height", item_size)
      .style("fill", (d, i) => colours[i]);

  legend_update.append("text")
      .attr("x", (left ? -1 : 1) * (padding + item_size))
      .attr("y", 9)
      .style("font-size", item_size + "px")
      .text((d) => d);

  return legend;
}
