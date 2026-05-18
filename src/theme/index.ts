// Placeholder design tokens. Final brand palette is TBD with the designer
// (see docs/PROJECT-PLAN.md §6). Update this single file when the real
// palette arrives — every screen consumes from here.

export const colors = {
  primary: '#0EA5E9',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  danger: '#EF4444',
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
