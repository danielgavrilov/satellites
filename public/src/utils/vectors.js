import _ from "lodash";

export function magnitude(vector) {
  const sum = _.sumBy(vector, (x) => x*x);
  return Math.sqrt(sum);
}

export function dot(a, b) {
  return _.sum(_.zipWith(a, b, (a, b) => a*b));
}

export function subtract(a, b) {
  if (_.isNumber(b)) {
    return a.map((x) => x - b);
  } else {
    return _.zipWith(a, b, (x, y) => x - y);
  }
}

export function multiply(a, b) {
  if (_.isNumber(b)) {
    return a.map((x) => x * b);
  } else {
    const cols = a.length;
    const rows = a[0].length;
    let result = [];
    for (let col = 0; col < cols; col++) {
      let sum = 0;
      for (let row = 0; row < rows; row++) {
        sum += a[col][row] * b[row];
      }
      result[col] = sum;
    }
    return result;
  }
}

export function divide(vec, scalar) {
  return vec.map((x) => x / scalar);
}

export function cross(a, b) {
  return [
    (a[1] * b[2]) - (a[2] * b[1]),
    (a[2] * b[0]) - (a[0] * b[2]),
    (a[0] * b[1]) - (a[1] * b[0])
  ];
}
