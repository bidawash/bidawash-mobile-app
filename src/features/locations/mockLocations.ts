// Bundled fallback for the Locations feature. When the Supabase
// `locations` table is empty or the fetch fails, LocationsScreen /
// LocationDetailScreen / HomeScreen render this list so the UI never
// blank-flashes. Source of truth is the DB — see
// supabase/seed/content.sql — keep this small and roughly in sync.

export type LocationHours = {
  day: string;
  open: string;
  close: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  // Address string optimised for opening in a maps app — typically a
  // Plus Code or short query that map apps resolve unambiguously.
  mapsQuery: string;
  // Populated for the "find nearest branch" flow. Null-safe so the
  // sort can gracefully skip branches without coordinates.
  latitude: number | null;
  longitude: number | null;
  hours: LocationHours[];
  // Service NAMES offered at this branch (resolved from the
  // location_services join in the API layer for live data).
  features: string[];
  // When true, LocationsScreen shows a COMING SOON pill on the card
  // and LocationDetailScreen shows a red banner instead of implying
  // the branch is operating.
  isComingSoon: boolean;
};

const standardWeek: LocationHours[] = [
  { day: 'Mon', open: '08:00', close: '19:00' },
  { day: 'Tue', open: '08:00', close: '19:00' },
  { day: 'Wed', open: '08:00', close: '19:00' },
  { day: 'Thu', open: '08:00', close: '19:00' },
  { day: 'Fri', open: '08:00', close: '19:00' },
  { day: 'Sat', open: '08:00', close: '19:00' },
  { day: 'Sun', open: '08:00', close: '19:00' },
];

export const mockLocations: Location[] = [
  {
    id: 'gh-mall',
    name: 'GH Mall',
    address: 'O-Square 1 Parking Lot, J22X+M3R, A & E Building, Ortigas Ave, Mandaluyong City',
    mapsQuery: 'J22X+M3R Mandaluyong City',
    latitude: 14.601915,
    longitude: 121.047407,
    hours: standardWeek,
    features: ['Deluxe Foam Wash', 'Premium Wax Wash'],
    isComingSoon: false,
  },
  {
    id: 'parqal',
    name: 'Parqal',
    address: 'GXHP+53Q Parañaque, Metro Manila',
    mapsQuery: 'GXHP+53Q Parañaque',
    latitude: 14.527577,
    longitude: 120.985872,
    hours: standardWeek,
    features: ['Deluxe Foam Wash', 'Premium Wax Wash'],
    isComingSoon: true,
  },
];
