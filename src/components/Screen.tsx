import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
  // Opt-in to a top safe-area inset. Default is false because most
  // screens live under a React Navigation header that already accounts
  // for the status bar / notch. Set true on screens with no header
  // (e.g. Onboarding, ResetPassword) so content doesn't slide under
  // the notch.
  safeAreaTop?: boolean;
};

// Standard screen wrapper. Adds a padded scroll view, plus side / bottom
// safe-area insets. The top inset is opt-in via `safeAreaTop` because
// double-counting it (header + SafeAreaView) leaves a visible gap.
export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  safeAreaTop = false,
}: ScreenProps) {
  const inner = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.content, contentContainerStyle]}>{children}</View>
  );

  const edges: ('top' | 'left' | 'right')[] = safeAreaTop
    ? ['top', 'left', 'right']
    : ['left', 'right'];

  return (
    <SafeAreaView style={styles.flex} edges={edges}>
      {inner}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
});
