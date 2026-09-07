// Placeholder data for the Locations feature. In Phase 2 backend work
// this gets replaced with a Supabase query. Shape lives here so screens
// can be built and demoed before the backend exists.

export type LocationHours = {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
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
  hours: LocationHours[];
  features: string[];
};

// All current branches share these hours (8 AM – 7 PM every day).
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
    hours: standardWeek,
    features: ['Deluxe Foam Wash', 'Premium Wax Wash'],
  },
  {
    id: 'parqal',
    name: 'Parqal',
    address: 'GXHP+53Q Parañaque, Metro Manila',
    mapsQuery: 'GXHP+53Q Parañaque',
    hours: standardWeek,
    features: ['Deluxe Foam Wash', 'Premium Wax Wash'],
  },
];

export function findLocation(id: string): Location | undefined {
  return mockLocations.find((loc) => loc.id === id);
}
