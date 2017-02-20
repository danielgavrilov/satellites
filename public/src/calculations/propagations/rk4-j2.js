import { norm, pow } from "mathjs";

import rk4_generator from "./rk4-generator";

const C2_0 = -0.4841653711736 * 1e-3;
const a = 6378136.3 / 1e3; // km

function calc_k(vector, h, GM) {
  const r = norm(vector);
  const z = vector[2];
  return vector.map((x, i) => {
    const coef = (i === 2) ? 3 : 1;
    return 0.5 * h*h * (
      -GM * x / pow(r, 3) +
      1.5 * GM * a*a / pow(r, 5) * C2_0 * x * (coef - 5 * z*z / (r*r))
    );
  });
}

export default rk4_generator(calc_k);
