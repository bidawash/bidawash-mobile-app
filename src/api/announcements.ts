import { type Announcement } from '@/features/home/mockAnnouncements';

import { supabase } from './supabase';

type AnnouncementNav = NonNullable<Announcement['navigateTo']>;

// Fetch active announcements from Supabase. Returns [] when the query
// errors or nothing is available; HomeScreen falls back to the bundled
// mockAnnouncements in that case.
export async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select(
      'id, title, body, published_at, is_pinned, navigate_to_tab, navigate_to_screen, navigate_to_params',
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  return data.map((row) => {
    const r = row as Record<string, unknown>;
    const tab = r.navigate_to_tab as string | null;
    const navigateTo: AnnouncementNav | undefined = tab
      ? {
          tab: tab as AnnouncementNav['tab'],
          screen: (r.navigate_to_screen as string | null) ?? undefined,
          params: (r.navigate_to_params as Record<string, unknown> | null) ?? undefined,
        }
      : undefined;
    return {
      id: String(r.id),
      title: String(r.title),
      body: String(r.body),
      publishedAt: String(r.published_at),
      isPinned: Boolean(r.is_pinned),
      navigateTo,
    };
  });
}
