// Bundled fallback for the Services feature. When the Supabase
// `services` table is empty or the fetch fails, ServicesScreen /
// HomeScreen render this list. Source of truth is the DB — see
// supabase/seed/content.sql — keep this small and roughly in sync.

export type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  startingPricePhp: number;
  // Highlighted on the Home tab as a service tile. If none of the
  // active services are featured, HomeScreen falls back to showing
  // every service.
  isFeatured: boolean;
};

export const mockServices: Service[] = [
  {
    id: 'deluxe-foam',
    name: 'Deluxe Foam Wash',
    description:
      '5-step touchless clean:\n1. Under-chassis wash\n2. Neutral pH pre-soak\n3. Shampoo wash\n4. High-pressure rinse\n5. Drying\n\nGentle on paint, tough on grime.',
    durationMinutes: 10,
    startingPricePhp: 320,
    isFeatured: true,
  },
  {
    id: 'premium-wax',
    name: 'Premium Wax Wash',
    description:
      'Everything in the Deluxe Foam Wash, plus a water-wax application before drying for extra shine and environmental protection.',
    durationMinutes: 10,
    startingPricePhp: 380,
    isFeatured: true,
  },
];
