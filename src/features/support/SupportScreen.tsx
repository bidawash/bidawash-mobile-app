import { Linking, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { theme } from '@/theme';

const SUPPORT_EMAIL = 'support@bidawash.com';

export function SupportScreen() {
  function emailSupport() {
    Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('BidaWash app — support request')}`,
    ).catch(() => {});
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>We&apos;re here to help</Text>
        <Text style={styles.subtitle}>
          Email our support team and we&apos;ll get back to you within one business day.
        </Text>
      </View>

      <Card>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.email}>{SUPPORT_EMAIL}</Text>
      </Card>

      <Button title="Email support" onPress={emailSupport} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: theme.spacing.xs },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 15, color: theme.colors.muted, lineHeight: 22 },
  label: { fontSize: 12, fontWeight: '600', color: theme.colors.muted, textTransform: 'uppercase' },
  email: { fontSize: 17, fontWeight: '600', color: theme.colors.primary, marginTop: 4 },
});
