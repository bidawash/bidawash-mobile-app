import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { theme } from '@/theme';

const TERMS_URL = 'https://bidawash.com/terms';

export function TermsScreen() {
  function openFull() {
    WebBrowser.openBrowserAsync(TERMS_URL).catch(() => {});
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Terms of service</Text>
        <Text style={styles.subtitle}>The rules of using the BidaWash app and our services.</Text>
      </View>

      <Card>
        <Text style={styles.body}>
          This is a placeholder summary. The full, legally-binding terms will be hosted at{' '}
          <Text style={styles.link}>{TERMS_URL}</Text> before app launch.
        </Text>
        <Text style={styles.body}>
          By using BidaWash, you agree to follow branch rules, treat staff respectfully, and accept
          our refund and cancellation policies (detailed in the full terms).
        </Text>
      </Card>

      <Button title="View full terms" variant="secondary" onPress={openFull} />
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
