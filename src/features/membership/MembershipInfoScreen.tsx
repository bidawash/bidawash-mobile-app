import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { theme } from '@/theme';

const BENEFITS = [
  'Unlimited washes across all branches',
  'Member-only express lane',
  'Priority booking during peak hours',
  '15% off detailing and add-ons',
  'Birthday wash on the house',
];

export function MembershipInfoScreen() {
  const [notified, setNotified] = useState(false);

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.tag}>Coming soon</Text>
        <Text style={styles.title}>BidaWash Members</Text>
        <Text style={styles.subtitle}>
          Unlimited washes and member perks. Launching with our next release.
        </Text>
      </View>

      <Section title="Planned benefits">
        <Card>
          {BENEFITS.map((b) => (
            <Text key={b} style={styles.benefit}>
              • {b}
            </Text>
          ))}
        </Card>
      </Section>

      {notified ? (
        <Card>
          <Text style={styles.confirmTitle}>You&apos;re on the list.</Text>
          <Text style={styles.confirmBody}>
            We&apos;ll send a push notification the moment memberships are live.
          </Text>
        </Card>
      ) : (
        <Button title="Notify me when available" onPress={() => setNotified(true)} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: theme.spacing.xs },
  tag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 15, color: theme.colors.muted, lineHeight: 22 },
  benefit: { fontSize: 14, color: theme.colors.text, paddingVertical: 3 },
  confirmTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.success },
  confirmBody: { fontSize: 14, color: theme.colors.muted, lineHeight: 20 },
});
