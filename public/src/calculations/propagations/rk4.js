import { norm, pow } from "mathjs";

import rk4_generator from "./rk4-generator";

function calc_k(vector, h, GM) {
  const r = norm(vector);
  const product = 0.5 * h*h * (-GM) / pow(r, 3);
  return vector.map((x) => x * product);
}

export default rk4_generator(calc_k);
