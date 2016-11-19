const {GM, keplerian} = data["jason-2"];
const {a, e, i, ω, Ω, ν} = keplerian;

console.log(kep2cart({a, e, i, ω, Ω, ν, GM}));
