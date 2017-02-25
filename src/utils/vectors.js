import _ from "lodash";

/**
 * Given a vector, it returns it's magnitude.
 * @param  {Array} vector
 * @return {Number}
 */
export function magnitude(vector) {
  const sum = _.sumBy(vector, (x) => x * x);
  return Math.sqrt(sum);
}

/**
 * Given two 3D vectors, it returns their dot product.
 * @param  {Array} a First vector
 * @param  {Array} b Second vector
 * @return {Number}
 */
export function dot(a, b) {
  return a[0] * b[0] +
         a[1] * b[1] +
         a[2] * b[2];
}

/**
 * Given two 3D vectors, it returns the first subtracted by the second.
 * If the second parameter is a scalar, then all dimensions of the first vector
 * are subtracted by the scalar.
 * @param  {Array} a The first vector
 * @param  {Array|Number} b The second vector (or could be a scalar)
 * @return {Array} The resulting vector
 */
export function subtract(a, b) {
  if (_.isNumber(b)) {
    // vector - scalar
    return a.map((x) => x - b);
  } else {
    // vector - vector
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }
}

/**
 * Multiplies two 3D vectors, or multiplies a vector by a scalar.
 * @param  {Array} a The first vector
 * @param  {Array|Number} b The second vector or scalar
 * @return {Array} The resulting vector
 */
export function multiply(a, b) {
  if (_.isNumber(b)) {
    // vector × scalar
    return a.map((x) => x * b);
  } else {
    // matrix × vector
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

/**
 * Divides a vector by a scalar.
 * @param  {Array} vec
 * @param  {Number} scalar
 * @return {Array}
 */
export function divide(vec, scalar) {
  return vec.map((x) => x / scalar);
}

/**
 * Calculates the cross product of two 3D vectors.
 * @param  {Array} a
 * @param  {Array} b
 * @return {Array}
 */
export function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}
