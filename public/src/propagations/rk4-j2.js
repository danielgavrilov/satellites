import rk4_generator from "./rk4-generator";
import { magnitude } from "../utils/vectors";

const { pow, sqrt } = Math;

const C2_0 = -0.484165371736 * 1e-3 * sqrt(5); // denormalised
const a = 6378136.3 / 1e3; // km

function calc_k(vector, h, GM) {
  const r = magnitude(vector);
  const z = vector[2];
  return vector.map((x, i) => {
    // in Z calculation, the coefficient is 3, otherwise 1.
    const coef = (i === 2) ? 3 : 1;
    return 0.5 * h*h * (
      -GM * x / pow(r, 3) +
      1.5 * GM * a*a / pow(r, 5) * C2_0 * x * (coef - 5 * z*z / (r*r))
    );
  });
}

export default rk4_generator(calc_k);
