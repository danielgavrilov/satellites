import { rad_to_deg } from "../utils/angles";

/**
 * Converts longitude & latitude from radians to degrees, in a format required
 * by the plotting library.
 * @param  {Number} λ Longitude
 * @param  {Number} φ Latitude
 * @return {Array}
 */
export function latlon_to_plot({ λ, φ }) {
  return [
    rad_to_deg(λ),
    rad_to_deg(φ)
  ];
}

/**
 * Given a track containing lat/long points, it converts it into a
 * GeoJSON LineString geometry, to be passed onto the plotting library.
 * @param  {Array} track
 * @return {Object} GeoJSON LineString geometry
 */
export function track_to_plot(track) {
  const coords = track.map(({ latlon }) => latlon_to_plot(latlon));
  return {
    type: "LineString",
    coordinates: coords
  };
}

/**
 * Converts azimuth and elevation from radians to degrees, in a format required
 * by the plotting library.
 * @param  {Number} azimuth
 * @param  {Number} elevation
 * @return {Array}
 */
export function relative_point_to_plot({ azimuth, elevation }) {
  return [
    rad_to_deg(azimuth),
    rad_to_deg(elevation)
  ]
}

/**
 * Given a track containing azimuth/elevation points, it converts it into a
 * GeoJSON LineString geometry, to be passed onto the plotting library.
 * @param  {Array} relative_track
 * @return {Object} GeoJSON LineString geometry
 */
export function relative_track_to_plot(relative_track) {
  const coords = relative_track.map(relative_point_to_plot);
  return {
    type: "LineString",
    coordinates: coords
  };
}
