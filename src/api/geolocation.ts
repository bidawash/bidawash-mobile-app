import * as ExpoLocation from 'expo-location';

export type Coords = { latitude: number; longitude: number };
export type LocationPermissionState = 'undetermined' | 'granted' | 'denied';

// Check + optionally request the app's foreground location permission.
// When `request` is false, this only reads the current state without
// triggering the system prompt.
export async function ensureLocationPermission(request = true): Promise<LocationPermissionState> {
  const current = await ExpoLocation.getForegroundPermissionsAsync();
  if (current.status === 'granted') return 'granted';
  if (current.status === 'denied' && !current.canAskAgain) return 'denied';
  if (!request) return 'undetermined';

  const requested = await ExpoLocation.requestForegroundPermissionsAsync();
  if (requested.status === 'granted') return 'granted';
  return requested.status === 'denied' ? 'denied' : 'undetermined';
}

export async function getCurrentCoords(): Promise<Coords | null> {
  try {
    const position = await ExpoLocation.getCurrentPositionAsync({
      accuracy: ExpoLocation.Accuracy.Balanced,
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch {
    return null;
  }
}

// Great-circle distance in kilometres between two points (Haversine).
export function distanceKm(a: Coords, b: Coords): number {
  const R = 6371; // Earth radius, km.
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// "342 m" / "1.2 km" / "12 km" — for display alongside a branch card.
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
