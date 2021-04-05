// Change to human-readable form

export function displayLocation(location) {
  if (!location) return "";
  return `${location.city}, ${location.province}, ${location.country}`;
}
