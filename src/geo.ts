export const GEOFENCE_RADIUS_M = 120;

export const LOCATIONS = [
  { id: "quintbridge", name: "NTT西日本本社", lat: 34.699494, lng: 135.530389 },
  { id: "osakajo", name: "大阪城", lat: 34.687315, lng: 135.526201 },
] as const;

export type LocationId = (typeof LOCATIONS)[number]["id"];

export function getLocation(id: LocationId) {
  return LOCATIONS.find((l) => l.id === id)!;
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isWithinGeofence(
  pos: { lat: number; lng: number } | null,
  locationId: LocationId
): boolean {
  if (!pos) return false;
  const loc = getLocation(locationId);
  return haversineDistance(pos.lat, pos.lng, loc.lat, loc.lng) <= GEOFENCE_RADIUS_M;
}

