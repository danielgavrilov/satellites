import rk4_generator from "./rk4-generator";
import { magnitude } from "../utils/vectors";

function calc_k(vector, h, GM) {
  const r = magnitude(vector);
  return vector.map((x) => x * 0.5 * (h*h) * (-GM) / (r*r*r));
}

export default rk4_generator(calc_k);
