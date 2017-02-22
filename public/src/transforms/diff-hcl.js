import { eci_to_hcl } from "./coordinates";
import { subtract, dot } from "../utils/vectors";

export default function(a, b) {
  const Δx = subtract(a.r, b.r);
  const { h, c, l } = eci_to_hcl(a);
  return [h, c, l].map((basis) => dot(basis, Δx));
}
