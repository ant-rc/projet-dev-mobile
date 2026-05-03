export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radii = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Palette = {
  primary: '#0a7ea4',
  primaryDark: '#075e7a',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  white: '#ffffff',
  borderLight: '#d4d4d8',
  borderDark: '#3f3f46',
  mutedLight: '#71717a',
  mutedDark: '#a1a1aa',
} as const;

export type SpacingToken = keyof typeof Spacing;
export type RadiiToken = keyof typeof Radii;
export type FontSizeToken = keyof typeof FontSize;
