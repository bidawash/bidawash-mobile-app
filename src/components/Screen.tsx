import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
};

// Standard screen wrapper. Adds top safe-area inset (the tab bar handles
// the bottom one) and a default padded scroll view. Pass `scroll={false}`
// for screens with their own scroll container (e.g. FlatList).
export function Screen({ children, scroll = true, contentContainerStyle }: ScreenProps) {
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

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
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
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
});
