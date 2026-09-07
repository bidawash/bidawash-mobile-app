// Design tokens for the BidaWash mobile app. Colors come from the
// June 2026 brand pack (see docs/PROJECT-PLAN.md §6 and the design PDF):
// vivid red and a deep navy blue. Update this file when the palette
// evolves — every screen consumes from here.

export const colors = {
  // Primary brand blue. Used for headlines, primary buttons, links,
  // active tab tint, and field-focus borders.
  primary: '#1E3A8A',
  // Vivid signature red. Used for the splash background, the "Wash"
  // half of the wordmark, the selected timeslot, and destructive
  // actions like Delete Account.
  brand: '#E30613',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  // Alias kept so existing screens still resolve; both map to the same
  // brand red.
  danger: '#E30613',
  warning: '#F59E0B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const theme = {
  colors,
  spacing,
  radius,
} as const;

export type Theme = typeof theme;
