import { StyleSheet, Text, View, type TextStyle } from 'react-native';

import { theme } from '@/theme';

type Size = 'sm' | 'md' | 'lg';

type BrandMarkProps = {
  size?: Size;
  // Optional override for both halves — useful on coloured backgrounds
  // (e.g. the red splash) where we want the wordmark in solid white.
  monochrome?: string;
};

// Two-tone "BidaWash" wordmark from the June 2026 brand pack. "Bida"
// renders in brand red, "Wash" in primary blue — matching the welcome
// slide. Replaces every inline <Text>BidaWash</Text> across screens so
// the brand reads consistently.
export function BrandMark({ size = 'md', monochrome }: BrandMarkProps) {
  const fontSize = SIZE_TO_FONT[size];
  const sharedTextStyle: TextStyle = { fontSize, fontWeight: '800', letterSpacing: -0.5 };
  const bidaColor = monochrome ?? theme.colors.brand;
  const washColor = monochrome ?? theme.colors.primary;

  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="BidaWash">
      <Text style={[sharedTextStyle, { color: bidaColor }]}>Bida</Text>
      <Text style={[sharedTextStyle, { color: washColor }]}>Wash</Text>
    </View>
  );
}

const SIZE_TO_FONT: Record<Size, number> = {
  sm: 16,
  md: 22,
  lg: 26,
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline' },
});
