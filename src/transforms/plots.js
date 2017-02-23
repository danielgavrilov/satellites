import { rad_to_longitude, rad_to_latitude, rad_to_deg } from "../utils/angles";

const π = Math.PI;

export function track_to_plot(track) {
  const coords = track.map(({ latlon }) => point_to_plot(latlon));
  return {
    type: "LineString",
    coordinates: coords
  };
}

export function relative_track_to_plot(relative_track) {

  const coords = relative_track.map(({ elevation, azimuth }) => {
    if (azimuth < 0) azimuth += 2*π;
    return [
      rad_to_deg(azimuth),
      rad_to_deg(elevation)
    ]
  });

  return {
    type: "LineString",
    coordinates: coords
  };
}

export function point_to_plot({ λ, φ }) {
  return [
    rad_to_longitude(λ),
    rad_to_latitude(φ)
  ];
}
