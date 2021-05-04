// Change to human-readable form

export function displayLocation(location) {
  return `${location.city}, ${location.province}, ${location.country}`;
}

export function displayDate(date) {
  return date.toDateString();
}
