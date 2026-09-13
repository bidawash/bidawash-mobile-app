import { type Service } from '@/features/services/mockServices';

import { supabase } from './supabase';

// Fetch active services from Supabase. Returns [] when the query
// errors or nothing is available; ServicesScreen and HomeScreen fall
// back to the bundled mockServices in that case.
export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, starting_price_php, duration_minutes, is_featured')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id),
      name: String(r.name),
      description: String(r.description),
      startingPricePhp: Number(r.starting_price_php),
      durationMinutes: Number(r.duration_minutes),
      isFeatured: Boolean(r.is_featured),
    };
  });
}
