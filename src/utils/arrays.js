const TAKE = 1,
      LEAVE = 0;

export function group_consecutive(array, predicate) {

  let state = LEAVE,
      groups = [],
      temp = [];

  array.forEach((x) => {

    const p = predicate(x);

    if (state === LEAVE && p) {
      state = TAKE;
    }

    if (state === TAKE) {
      if (!p) {
        state = LEAVE;
        groups.push(temp);
        temp = [];
      } else {
        temp.push(x);
      }
    }
  });

  if (state === TAKE) {
    groups.push(temp);
  }

  return groups;
}
