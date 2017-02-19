import moment from "moment";

import { J2000 } from "../utils";

export function date_to_j2000_seconds(date) {
  return ((+date) - (+J2000)) / 1000;
}
