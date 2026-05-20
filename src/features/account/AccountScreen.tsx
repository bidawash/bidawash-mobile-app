import { Alert, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import type { AccountScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

export function AccountScreen({ navigation }: AccountScreenProps<'AccountHome'>) {
  const { user, signOut } = useAuth();

  function confirmSignOut() {
    Alert.alert('Sign out?', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Delete account?',
      'This is a placeholder. Real deletion will be wired up in Phase 2 backend work.',
      [{ text: 'OK' }],
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
      </Card>

      <Section title="Information">
        <Card onPress={() => navigation.navigate('Faqs')}>
          <Text style={styles.linkTitle}>FAQs</Text>
          <Text style={styles.linkBody}>Common questions about washes, hours, and payments.</Text>
        </Card>
        <Card onPress={() => navigation.navigate('Support')}>
          <Text style={styles.linkTitle}>Contact support</Text>
          <Text style={styles.linkBody}>Email or message our team.</Text>
        </Card>
      </Section>

      <Section title="Legal">
        <Card onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.linkTitle}>Privacy policy</Text>
        </Card>
        <Card onPress={() => navigation.navigate('Terms')}>
          <Text style={styles.linkTitle}>Terms of service</Text>
        </Card>
      </Section>

      <Section title="Account">
        <Button title="Sign out" variant="secondary" onPress={confirmSignOut} />
        <Button title="Delete account" variant="ghost" onPress={confirmDeleteAccount} />
      </Section>

      <View style={styles.footer}>
        <Text style={styles.versionLabel}>BidaWash v0.1.0 (Phase 2 preview)</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  email: { fontSize: 14, color: theme.colors.muted },
  linkTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  linkBody: { fontSize: 13, color: theme.colors.muted, lineHeight: 18 },
  footer: { alignItems: 'center', marginTop: theme.spacing.md },
  versionLabel: { fontSize: 12, color: theme.colors.muted },
});
