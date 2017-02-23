import { rad_to_longitude, rad_to_latitude, rad_to_deg } from "../utils/angles";

const π = Math.PI;

export function latlon_to_plot({ λ, φ }) {
  return [
    rad_to_longitude(λ),
    rad_to_latitude(φ)
  ];
}

export function track_to_plot(track) {
  const coords = track.map(({ latlon }) => latlon_to_plot(latlon));
  return {
    type: "LineString",
    coordinates: coords
  };
}

export function relative_point_to_plot({ azimuth, elevation }) {
  return [
    rad_to_deg(azimuth),
    rad_to_deg(elevation)
  ]
}

export function relative_track_to_plot(relative_track) {
  const coords = relative_track.map(relative_point_to_plot);
  return {
    type: "LineString",
    coordinates: coords
  };
}
