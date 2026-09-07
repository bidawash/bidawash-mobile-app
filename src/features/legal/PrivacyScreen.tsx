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
        <Text style={styles.sectionHeading}>What we collect</Text>
        <Text style={styles.body}>
          Account details you give us (name, email, and optional phone), plus anonymous crash and
          performance data to keep the app working smoothly. We never collect your precise location,
          contacts, or photos.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionHeading}>How we use it</Text>
        <Text style={styles.body}>
          To create and manage your account, deliver our wash services, and improve the app. We do
          not sell your personal data and we do not use it for advertising.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionHeading}>Your rights</Text>
        <Text style={styles.body}>
          Under the Philippines Data Privacy Act (RA 10173), you can access, correct, or delete your
          data at any time. Delete your account from the Account tab, or email support@bidawash.com.
        </Text>
      </Card>

      <Button title="Read the full policy" variant="secondary" onPress={openFull} />
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
