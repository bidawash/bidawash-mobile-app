import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { friendlyAuthError } from '@/auth/errors';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { theme } from '@/theme';

// Rendered by RootNavigator when AuthContext.passwordRecovery is true,
// i.e. the user tapped the email reset link and we hold them here until
// they pick a new password.
export function ResetPasswordScreen() {
  const { completePasswordReset, cancelPasswordReset, isLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const matches = password.length > 0 && password === confirm;
  const canSubmit = password.length >= 6 && matches && !isLoading;

  async function handleSubmit() {
    setError(null);
    try {
      await completePasswordReset(password);
    } catch (err) {
      setError(friendlyAuthError(err, 'Could not update your password. Try the email link again.'));
    }
  }

  return (
    <Screen safeAreaTop>
      <View style={styles.header}>
        <BrandMark size="sm" />
        <Text style={styles.title}>Set a new password</Text>
        <Text style={styles.subtitle}>
          Choose a new password for your account. You&apos;ll be signed in once it&apos;s saved.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="New password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="At least 6 characters"
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <TextField
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          placeholder="Re-enter the password"
          autoComplete="new-password"
          textContentType="newPassword"
        />
        {confirm.length > 0 && !matches ? (
          <Text style={styles.error}>Passwords don&apos;t match.</Text>
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Save password"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!canSubmit}
        />
        <Button title="Cancel" variant="ghost" onPress={cancelPasswordReset} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: theme.spacing.xs, marginBottom: theme.spacing.md },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.primary },
  subtitle: { fontSize: 15, color: theme.colors.muted, lineHeight: 22 },
  form: { gap: theme.spacing.md },
  error: { color: theme.colors.danger, fontSize: 13 },
});
