/**
 * Calculates the Eccentric anomaly E in radians given the mean anomaly M and the eccentricity of the ellipse e
 */

function solveKepler(e, M){
  let E = M;
/**
 * Solve keplers equation using the newtonian method. Keep going until E is very close to 0
 */
  while(abs(f(E, M, e)) > 0.00000001){
    E = E - (E - e * sin(E) -M)/(1 - e * cos(E));
  }

  return E;
}

function f(E, M, e){
/**
 * Keplers equation is M = E - e * sin(E)
 * We want to find some E such that E - e * sin(E) -M = 0
 */
  return E - e * sin(E) - M;
}
