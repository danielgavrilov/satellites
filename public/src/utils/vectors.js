export function magnitude(vector) {
  let sum = 0;
  const dimensions = vector.length;
  for (let i = 0; i < dimensions; i++) {
    sum += vector[i] * vector[i];
  }
  return Math.sqrt(sum);
}
