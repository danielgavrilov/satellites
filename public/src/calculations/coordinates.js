import {date_to_j2000_seconds} from "./time";

export function eci_to_ecef(position, date) {
  const seconds = date_to_j2000_seconds(date);
  const days = seconds / 60 / 60 / 24;
  const Θ = 280.4606 + 360.9856473662 * days;
  return rotate_z(position, Θ);
}
