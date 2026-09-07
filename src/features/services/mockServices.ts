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
    id: 'deluxe-foam',
    name: 'Deluxe Foam Wash',
    description:
      '5-step touchless clean:\n1. Under-chassis wash\n2. Neutral pH pre-soak\n3. Shampoo wash\n4. High-pressure rinse\n5. Drying\n\nGentle on paint, tough on grime.',
    durationMinutes: 10,
    startingPricePhp: 320,
  },
  {
    id: 'premium-wax',
    name: 'Premium Wax Wash',
    description:
      'Everything in the Deluxe Foam Wash, plus a water-wax application before drying for extra shine and environmental protection.',
    durationMinutes: 10,
    startingPricePhp: 380,
  },
];
