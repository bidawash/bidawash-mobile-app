import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';

type SectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: theme.spacing.sm },
  title: { fontSize: 22, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.muted, marginTop: -4 },
  body: { gap: theme.spacing.sm, marginTop: theme.spacing.xs },
});
