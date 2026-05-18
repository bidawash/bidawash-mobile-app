export type Announcement = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  pinned?: boolean;
};

export const mockAnnouncements: Announcement[] = [
  {
    id: 'bgc-open',
    title: 'BGC branch now open',
    body: 'Our flagship BGC location is now serving customers daily from 7 AM to 9 PM.',
    publishedAt: '2026-05-10',
    pinned: true,
  },
  {
    id: 'memberships-soon',
    title: 'Memberships coming soon',
    body: 'Pre-paid wash packages and unlimited memberships launching in our next release. Tap "Notify me" on the Membership tab.',
    publishedAt: '2026-05-05',
  },
  {
    id: 'holiday-hours',
    title: 'Holiday hours',
    body: 'All branches will close at 6 PM on national holidays. Check each location for exact hours.',
    publishedAt: '2026-04-28',
  },
];
