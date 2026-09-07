import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { theme } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
} & Omit<PressableProps, 'onPress' | 'disabled' | 'style'>;

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  ...rest
}: ButtonProps) {
  const isInactive = disabled || loading;
  const variantStyle = variantStyles[variant];
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        pressed && !isInactive ? styles.pressed : null,
        isInactive ? styles.disabled : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.label.color as string} />
      ) : (
        <Text style={[styles.labelBase, variantStyle.label]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  labelBase: { fontSize: 16, fontWeight: '600' },
});

const variantStyles: Record<Variant, { container: ViewStyle; label: TextStyle }> = {
  primary: {
    container: { backgroundColor: theme.colors.primary },
    label: { color: '#FFFFFF' },
  },
  secondary: {
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    label: { color: theme.colors.text },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: theme.colors.primary },
  },
  // Charcoal-blue used by the membership Notify-me CTA so it visually
  // pairs with the dark Premium Card image above it.
  dark: {
    container: { backgroundColor: '#1F2937' },
    label: { color: '#FFFFFF' },
  },
};
