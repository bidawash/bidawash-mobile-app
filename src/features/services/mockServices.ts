// Placeholder service catalogue. Phase 3 will replace with a `services`
// Supabase table once pricing and packages are finalized.

export type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  startingPricePhp: number;
};

export const mockServices: Service[] = [
  {
    id: 'express',
    name: 'Express Wash',
    description: 'Quick exterior wash with hand-dry. Back on the road in 15 minutes.',
    durationMinutes: 15,
    startingPricePhp: 150,
  },
  {
    id: 'premium',
    name: 'Premium Wash',
    description: 'Full exterior plus interior vacuum, dashboard wipe, and tire shine.',
    durationMinutes: 35,
    startingPricePhp: 350,
  },
  {
    id: 'detailing',
    name: 'Detailing',
    description: 'Deep clean: clay-bar treatment, paint correction, and interior shampoo.',
    durationMinutes: 180,
    startingPricePhp: 2500,
  },
  {
    id: 'wax',
    name: 'Wax & Polish',
    description: 'Hand-applied carnauba wax for shine and weather protection.',
    durationMinutes: 60,
    startingPricePhp: 800,
  },
  {
    id: 'interior',
    name: 'Interior Deep Clean',
    description: 'Shampoo seats and carpets, condition leather, dress interior plastics.',
    durationMinutes: 90,
    startingPricePhp: 1200,
  },
];
