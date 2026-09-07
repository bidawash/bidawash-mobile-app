import { Alert, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { VerifyEmailBanner } from '@/components/VerifyEmailBanner';
import type { AccountScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

export function AccountScreen({ navigation }: AccountScreenProps<'AccountHome'>) {
  const { user, signOut, deleteAccount } = useAuth();

  function confirmSignOut() {
    Alert.alert('Sign out?', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void signOut() },
    ]);
  }

  function confirmDeleteAccount() {
    // Two-step confirm: this is irreversible. Required for Apple Guideline
    // 5.1.1(v) and Google Play account-deletion policy.
    Alert.alert(
      'Delete account?',
      'This permanently removes your BidaWash account and any saved data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you sure?',
              'Tap Delete again to confirm. You will be signed out immediately.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteAccount();
                    } catch {
                      Alert.alert(
                        'Could not delete account',
                        'Please try again, or contact support@bidawash.com if the problem persists.',
                      );
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  }

  return (
    <Screen>
      <Card onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
        {user?.phone ? <Text style={styles.email}>{user.phone}</Text> : null}
        {user?.emailVerified ? <Text style={styles.verifiedPill}>✓ Email verified</Text> : null}
        <Text style={styles.editHint}>Tap to edit</Text>
      </Card>

      <VerifyEmailBanner />

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
        <Text style={styles.versionLabel}>BidaWash v0.1.0</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  email: { fontSize: 14, color: theme.colors.muted },
  verifiedPill: { fontSize: 12, fontWeight: '600', color: theme.colors.success, marginTop: 4 },
  editHint: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  linkTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  linkBody: { fontSize: 13, color: theme.colors.muted, lineHeight: 18 },
  footer: { alignItems: 'center', marginTop: theme.spacing.md },
  versionLabel: { fontSize: 12, color: theme.colors.muted },
});
