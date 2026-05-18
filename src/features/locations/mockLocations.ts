// Placeholder data for the Locations feature. In Phase 2 backend work this
// gets replaced with a Supabase query. Shape lives here so screens can be
// built and demoed before the backend exists.

export type LocationHours = {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  open: string;
  close: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: LocationHours[];
  features: string[];
};

const standardWeek: LocationHours[] = [
  { day: 'Mon', open: '07:00', close: '21:00' },
  { day: 'Tue', open: '07:00', close: '21:00' },
  { day: 'Wed', open: '07:00', close: '21:00' },
  { day: 'Thu', open: '07:00', close: '21:00' },
  { day: 'Fri', open: '07:00', close: '22:00' },
  { day: 'Sat', open: '08:00', close: '22:00' },
  { day: 'Sun', open: '08:00', close: '20:00' },
];

export const mockLocations: Location[] = [
  {
    id: 'bgc',
    name: 'BidaWash BGC',
    address: '5th Ave cor. 32nd St, Bonifacio Global City, Taguig',
    phone: '+63 2 8123 4567',
    hours: standardWeek,
    features: ['Express wash', 'Premium wash', 'Detailing bay', 'Indoor lounge'],
  },
  {
    id: 'makati',
    name: 'BidaWash Makati',
    address: 'Ayala Ave near Paseo de Roxas, Makati City',
    phone: '+63 2 8987 6543',
    hours: standardWeek,
    features: ['Express wash', 'Premium wash', 'Interior cleaning'],
  },
  {
    id: 'qc',
    name: 'BidaWash Quezon City',
    address: 'Tomas Morato Ave near Scout Borromeo, Quezon City',
    phone: '+63 2 8555 0099',
    hours: [
      { day: 'Mon', open: '07:00', close: '20:00' },
      { day: 'Tue', open: '07:00', close: '20:00' },
      { day: 'Wed', open: '07:00', close: '20:00' },
      { day: 'Thu', open: '07:00', close: '20:00' },
      { day: 'Fri', open: '07:00', close: '21:00' },
      { day: 'Sat', open: '08:00', close: '21:00' },
      { day: 'Sun', open: '09:00', close: '18:00' },
    ],
    features: ['Express wash', 'Premium wash', 'Wax & polish'],
  },
];

export function findLocation(id: string): Location | undefined {
  return mockLocations.find((loc) => loc.id === id);
}
