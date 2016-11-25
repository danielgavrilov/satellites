function normalise_angle(x) {
  x = x % (2*π);
  if (x < 0) x += 2*π;
  return x;
}

function normalise_keplerian(k) {
  k.ω = normalise_angle(k.ω);
  k.Ω = normalise_angle(k.Ω);
  k.ν = normalise_angle(k.ν);
  return k;
}

function equals(x, y) {
  return Math.abs(x - y) < 1e-8;
}

function test_cart2kep(data) {

  let errors = 0;

  _.forEach(data, function(d, name) {

    const actual = normalise_keplerian(cart2kep(d));
    const expected = normalise_keplerian(d.keplerian);

    _.keys(expected).forEach(function(key) {
      if (!equals(expected[key], actual[key])) {
        console.error("failed for key: " + key, expected[key], actual[key]);
        errors++;
      }
    });

  });

  if (errors === 0) {
    console.log("All passed.");
  } else {
    console.log(errors + " errors found");
  }

}
