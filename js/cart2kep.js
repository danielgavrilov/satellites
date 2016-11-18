const {sin, cos, sqrt, pow, abs, atan2, PI:π} = Math;
const {dot, cross, norm} = math;

function cart2kep({ r, v, GM }) {

    const h = cross(r, v);
    const i = calc_i(h);
    const Ω = calc_Ω(h);
    const a = calc_a(r, v, GM);
    const p = calc_p(h, GM);
    const e = calc_e(p, a);
    const n = calc_n(a, GM);
    const E = calc_E(r, v, a, n);
    const ν = calc_ν(e, E);
    const u = calc_u(r, i, Ω);
    const ω = calc_ω(u, ν);

    return [
        a,
        e,
        i,
        ω,
        Ω,
        ν
    ];
}

function calc_ν(e, E) {
    return atan2(
      sqrt(1 - pow(e,2)) * sin(E),
      cos(E) - e
    );
}

function calc_i(h) {

    hMag = norm(h);
    Wx = h[0] / hMag;
    Wy = h[1] / hMag;
    Wz = h[2] / hMag;

    return atan2(
      sqrt(pow(Wx, 2) + pow(Wy,2)),
      Wz
    );
}

function calc_Ω(h) {
    hMag = norm(h);
    Wx = h[0] / hMag;
    Wy = h[1] / hMag;
    return atan2(Wx, -Wy);
}

function calc_a(r, v, GM) {
    temp = (2 / norm(r)) - (pow(norm(v), 2) / GM);
    if (abs(temp) < 0.000001) {
        console.log("shit");
    }
    return 1 / temp;
}

function calc_p(h, GM) {
    return pow(norm(h), 2) / GM;
}

function calc_e(p, a) {
    return sqrt(1 - (p/a));
}

function calc_n(a, GM) {
    return sqrt(GM / pow(a, 3));
}

function calc_E(r, v, a, n) {
    return atan2(
      dot(r, v) / (pow(a, 2) * n),
      1 - norm(r) / a
    );
}

function calc_u(r, i, Ω) {
    [x,y,z] = r;
    return atan2(
      z / sin(i),
      x * cos(Ω) + y * sin(Ω)
    );
}

function calc_ω(u, ν) {
    return u - ν;
}
