export const USER_LAT = 51.4545;
export const USER_LNG = -2.5879;

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function kmToMiles(km: number): number {
  return km * 0.621371;
}

export function distanceMilesFromUser(lat: number, lng: number): number {
  return kmToMiles(haversineKm(USER_LAT, USER_LNG, lat, lng));
}

export function midpoint(coords: Array<{ lat: number; lng: number }>): { lat: number; lng: number } {
  if (coords.length === 0) return { lat: 0, lng: 0 };
  return {
    lat: coords.reduce((s, c) => s + c.lat, 0) / coords.length,
    lng: coords.reduce((s, c) => s + c.lng, 0) / coords.length,
  };
}
