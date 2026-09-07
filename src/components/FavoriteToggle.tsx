import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/theme';

type FavoriteToggleProps = {
  isFavorite: boolean;
  onToggle: () => void;
  labelWhenFavorite: string;
  labelWhenNot: string;
};

// Compact heart pill. Filled + brand-red when favorited; outlined + muted
// when not. Self-aligned to flex-start so it doesn't stretch inside cards.
export function FavoriteToggle({
  isFavorite,
  onToggle,
  labelWhenFavorite,
  labelWhenNot,
}: FavoriteToggleProps) {
  const label = isFavorite ? labelWhenFavorite : labelWhenNot;
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFavorite }}
      hitSlop={8}
      style={({ pressed }) => [
        styles.wrap,
        isFavorite ? styles.wrapActive : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={16}
        color={isFavorite ? theme.colors.brand : theme.colors.muted}
      />
      <Text style={[styles.label, isFavorite ? styles.labelActive : null]}>{label}</Text>
    </Pressable>
  );
}

const ACTIVE_BG = '#FFF5F5';

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  wrapActive: {
    borderColor: theme.colors.brand,
    backgroundColor: ACTIVE_BG,
  },
  pressed: { opacity: 0.7 },
  label: { fontSize: 12, fontWeight: '600', color: theme.colors.muted },
  labelActive: { color: theme.colors.brand },
});
