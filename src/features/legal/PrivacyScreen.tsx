import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { theme } from '@/theme';

const PRIVACY_URL = 'https://bidawash.com/privacy';

export function PrivacyScreen() {
  function openFull() {
    WebBrowser.openBrowserAsync(PRIVACY_URL).catch(() => {});
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Privacy policy</Text>
        <Text style={styles.subtitle}>How we collect, use, and protect your data.</Text>
      </View>

      <Card>
        <Text style={styles.body}>
          This is a placeholder summary. The full, legally-binding privacy policy will be hosted at{' '}
          <Text style={styles.link}>{PRIVACY_URL}</Text> before app launch.
        </Text>
        <Text style={styles.body}>
          BidaWash collects only what we need to run your account and operate our car-wash services:
          your name, email, phone number, and the locations / services you book or purchase. We do
          not sell your personal data.
        </Text>
      </Card>

      <Button title="View full policy" variant="secondary" onPress={openFull} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: theme.spacing.xs },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 15, color: theme.colors.muted },
  body: { fontSize: 14, color: theme.colors.text, lineHeight: 22 },
  link: { color: theme.colors.primary },
});
