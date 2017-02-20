import rk4_generator from "./rk4-generator";
import { magnitude } from "../utils";

function calc_k(vector, h, GM) {
  const r = magnitude(vector);
  const product = 0.5 * (h*h) * (-GM) / (r*r*r);
  return vector.map((x) => x * product);
}

export default rk4_generator(calc_k);
