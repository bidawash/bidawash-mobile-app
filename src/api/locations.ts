import { type Location, type LocationHours } from '@/features/locations/mockLocations';

import { supabase } from './supabase';

// Fetch active locations from Supabase, including the services offered
// at each branch (many-to-many via location_services). Returns [] when
// the query errors or nothing is available; callers fall back to the
// bundled mockLocations in that case.
export async function fetchLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(
      'id, name, address, maps_query, latitude, longitude, hours, is_coming_soon, location_services(services(name))',
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  return data.map((row) => {
    const r = row as Record<string, unknown>;
    // Row shape from the embed:
    //   { ..., location_services: [{ services: { name: '...' } }, ...] }
    const embed =
      (r.location_services as { services?: { name?: unknown } | null }[] | undefined) ?? [];
    const features = embed
      .map((ls) => ls.services?.name)
      .filter((n): n is string => typeof n === 'string');

    const rawHours = Array.isArray(r.hours) ? (r.hours as unknown[]) : [];
    const hours: LocationHours[] = rawHours
      .map((h) => h as Record<string, unknown>)
      .filter(
        (h) =>
          typeof h.day === 'string' && typeof h.open === 'string' && typeof h.close === 'string',
      )
      .map((h) => ({
        day: String(h.day),
        open: String(h.open),
        close: String(h.close),
      }));

    return {
      id: String(r.id),
      name: String(r.name),
      address: String(r.address),
      mapsQuery: String(r.maps_query),
      latitude: r.latitude == null ? null : Number(r.latitude),
      longitude: r.longitude == null ? null : Number(r.longitude),
      hours,
      features,
      isComingSoon: Boolean(r.is_coming_soon),
    };
  });
}
