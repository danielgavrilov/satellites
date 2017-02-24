import { J2000 } from "../constants";

/**
 * Given a Date object, it returns the number of seconds from J200 until that
 * date.
 * @param  {Date} date [description]
 * @return {Number}    Number of seconds
 */
export function date_to_j2000_seconds(date) {
  return ((+date) - (+J2000)) / 1000;
}
