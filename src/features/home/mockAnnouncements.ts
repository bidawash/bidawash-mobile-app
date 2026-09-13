import type { AppTabsParamList } from '@/navigation/types';

export type Announcement = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  isPinned: boolean;
  // Optional navigation target. When set, the Home card becomes
  // pressable. Pass just `tab` to jump to a tab root, or also include
  // `screen` + `params` to drill into a nested stack screen (e.g. open
  // a specific location's detail page).
  navigateTo?: {
    tab: keyof AppTabsParamList;
    screen?: string;
    params?: Record<string, unknown>;
  };
};

// Bundled fallback for the Home "Latest Updates" section. When the
// Supabase `announcements` table is empty or the fetch fails,
// HomeScreen renders this list. Source of truth is the DB — see
// supabase/seed/content.sql — keep this small and roughly in sync.
export const mockAnnouncements: Announcement[] = [
  {
    id: 'gh-mall-opening',
    title: 'GH Mall branch — soft opening October 1',
    body: 'BidaWash GH Mall opens its doors on October 1. Come by for the official soft opening.',
    publishedAt: '2026-09-08',
    isPinned: true,
    navigateTo: {
      tab: 'LocationsTab',
      screen: 'LocationDetail',
      params: { locationId: 'gh-mall' },
    },
  },
  {
    id: 'hero-promo',
    title: 'Hero Promo — daily discount',
    body: 'The first 20 cars at any branch each day get a discount on their wash. First come, first served.',
    publishedAt: '2026-06-26',
    isPinned: false,
  },
  {
    id: 'premium-loyalty',
    title: 'Ask about BidaWash Premium',
    body: 'Loyalty rewards and branch-exclusive seasonal offers. Tap to learn more.',
    publishedAt: '2026-06-26',
    isPinned: false,
    navigateTo: { tab: 'MembershipTab' },
  },
];
