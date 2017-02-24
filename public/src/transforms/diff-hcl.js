import { eci_to_hcl } from "./coordinates";
import { subtract, dot } from "../utils/vectors";

/**
 * Given two instances in an ECI frame, it computes the difference of their
 * position vectors in an HCL frame.
 *
 * The instances are simply objects containing both position and velocity.
 *
 * @param  {Object} a The first instance in ECI frame
 * @param  {Object} b The second instance in ECI frame
 * @return {Array} The resulting vector in HCL frame
 */
export default function(a, b) {
  const Δx = subtract(a.r, b.r);
  const { h, c, l } = eci_to_hcl(a);
  return [h, c, l].map((basis) => dot(basis, Δx));
}
