import { pow, norm } from "mathjs";

export default function({ r, v, time, GM }, steps, step_size) {

  let predictions = [];

  for (let i = 0; i < steps; i++) {
    predictions.push({ r, v, time });
    ({ r, v } = step({ r, v, GM }, step_size));
    time = new Date(+time + step_size * 1e3);
  }

  return predictions;
}

function precalc_k_product(h, GM, r) {
  return 0.5 * h*h * (-GM) / pow(r, 3);
}

function step({ r: x0, v: v0, GM }, h) {

  const dimensions = 3;

  let x = [],
      r = norm(x0),
      k = [],
      P = [],
      Q = [],
      k_product,
      x1 = [],
      v1 = [];

  let k1, k2, k3, k4;

  k_product = precalc_k_product(h, GM, r);

  for (let i = 0; i < dimensions; i++) {
    k[i] = k_product * x0[i];
    x[i] = x0[i] + 0.5 * h * v0[i] + k[i] / 4;
  }

  k1 = k.slice();
  r = norm(x);
  k_product = precalc_k_product(h, GM, r);

  for (let i = 0; i < dimensions; i++) {
    k[i] = k_product * x[i];
  }

  k2 = k.slice();

  for (let i = 0; i < dimensions; i++) {
    x[i] = x0[i] + h * v0[i] + k[i];
  }

  k3 = k.slice();
  r = norm(x);
  k_product = precalc_k_product(h, GM, r);

  for (let i = 0; i < dimensions; i++) {
    k[i] = k_product * x[i];
  }

  k4 = k.slice();

  for (let i = 0; i < dimensions; i++) {
    P[i] = (k1[i] +   k2[i] +   k3[i]) / 3;
    Q[i] = (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]) / 3;
  }

  for (let i = 0; i < dimensions; i++) {
    x1[i] = x0[i] + h * v0[i] + P[i];
    v1[i] = v0[i] + Q[i] / h;
  }

  return {
    r: x1,
    v: v1
  }

}
