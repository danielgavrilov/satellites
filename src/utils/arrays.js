const TAKE = 1,
      LEAVE = 0;

/**
 * Groups consecutive elements for which the predicate evaluates to true and
 * omits elements for which the predicate evaluates to false.
 *
 * It is used when, for example, we have an array of elevations, and we want to
 * get the ones which are > mask angle. This creates groups where the "rise"
 * will be the first element and "set" the last of every group.
 *
 * @example
 *   group_consecutive([-1, 1, 2, 3, -3, -4, 1, 2], (number) => number > 0)
 *   => [[1,2,3], [1,2]]
 *
 * @param  {Array} array
 * @param  {Function} predicate
 * @return {Array}
 */
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
