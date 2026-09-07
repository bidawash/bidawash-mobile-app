import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { friendlyAuthError } from '@/auth/errors';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import type { AuthScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

export function ForgotPasswordScreen({ navigation }: AuthScreenProps<'ForgotPassword'>) {
  const { resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.includes('@') && !isLoading;

  async function handleSubmit() {
    setError(null);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(friendlyAuthError(err, 'Could not send a reset link. Please try again.'));
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <BrandMark size="sm" />
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>
          We&apos;ll send a reset link to the email associated with your account.
        </Text>
      </View>

      {sent ? (
        <View style={styles.success}>
          <Text style={styles.successTitle}>Check your inbox</Text>
          <Text style={styles.successBody}>
            If an account exists for {email}, a reset link is on its way.
          </Text>
          <Button title="Back to sign in" onPress={() => navigation.navigate('SignIn')} />
        </View>
      ) : (
        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="you@example.com"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title="Send reset link"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={!canSubmit}
          />
          <Button
            title="Back to sign in"
            variant="ghost"
            onPress={() => navigation.navigate('SignIn')}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: theme.spacing.xs, marginBottom: theme.spacing.md },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.primary },
  subtitle: { fontSize: 15, color: theme.colors.muted, lineHeight: 22 },
  form: { gap: theme.spacing.md },
  error: { color: theme.colors.danger, fontSize: 13 },
  success: { gap: theme.spacing.md },
  successTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  successBody: { fontSize: 15, color: theme.colors.muted, lineHeight: 22 },
});
