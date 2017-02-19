import data from "./data";
import kep2cart from "./calculations/kep2cart";
import cart2kep from "./calculations/cart2kep";
import propagate_kepler from "./calculations/propagate-kepler";

const { keplerian, cartesian, GM, time } = data["jason-2"];

const { a, e, i, ω, Ω, ν } = keplerian;
const { r, v } = cartesian;

// console.log(kep2cart({a, e, i, ω, Ω, ν, GM}));
// console.log(cart2kep({r, v, GM}));

const propagate = propagate_kepler({r, v, GM, t: time});
window.propagate = propagate;
console.log([10, 100, 1000, 10000, 10000000].map(propagate));
