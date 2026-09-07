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
        <Text style={styles.sectionHeading}>Your account</Text>
        <Text style={styles.body}>
          Keep your login details accurate and confidential. You are responsible for activity on
          your account.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionHeading}>Our services</Text>
        <Text style={styles.body}>
          BidaWash operates automated car-wash branches in the Philippines. Service availability,
          hours, and pricing may vary by branch.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionHeading}>Fair use</Text>
        <Text style={styles.body}>
          Please do not resell or reverse-engineer the app, and treat our staff and branches with
          respect. We may suspend accounts that violate these terms.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionHeading}>Governing law</Text>
        <Text style={styles.body}>
          These terms are governed by the laws of the Republic of the Philippines.
        </Text>
      </Card>

      <Button title="Read the full terms" variant="secondary" onPress={openFull} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: theme.spacing.xs },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 15, color: theme.colors.muted },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  body: { fontSize: 14, color: theme.colors.text, lineHeight: 22 },
});
