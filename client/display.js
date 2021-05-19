// Change to human-readable form

export function displayLocation(location) {
  return `${location.city}, ${location.province}, ${location.country}`;
}

const dateFormat = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export function displayDate(date) {
  return dateFormat.format(date);
}
