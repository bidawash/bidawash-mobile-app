import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { theme } from '@/theme';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
};

export function Card({ children, onPress }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  pressed: { opacity: 0.85 },
});
