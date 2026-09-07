import { type Faq } from '@/features/faqs/mockFaqs';

import { supabase } from './supabase';

// Fetch FAQs from Supabase. Returns [] when the table is empty or the
// query errors; the FAQ screen falls back to the bundled mockFaqs in
// that case so there's never a blank state.
export async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('id, question, answer, category, sort_order')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    question: String(row.question),
    answer: String(row.answer),
    category: row.category ? String(row.category) : undefined,
  }));
}
