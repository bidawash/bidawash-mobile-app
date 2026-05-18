import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import type { AuthScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

export function SignInScreen({ navigation }: AuthScreenProps<'SignIn'>) {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.includes('@') && password.length >= 6 && !isLoading;

  async function handleSubmit() {
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch {
      setError('Could not sign in. Check your email and password.');
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.brand}>BidaWash</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account.</Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="At least 6 characters"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Sign in" onPress={handleSubmit} loading={isLoading} disabled={!canSubmit} />
        <Button
          title="Forgot password?"
          variant="ghost"
          onPress={() => navigation.navigate('ForgotPassword')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account?</Text>
        <Button title="Create one" variant="ghost" onPress={() => navigation.navigate('SignUp')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: theme.spacing.xs, marginBottom: theme.spacing.md },
  brand: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 15, color: theme.colors.muted },
  form: { gap: theme.spacing.md },
  error: { color: theme.colors.danger, fontSize: 13 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  footerText: { color: theme.colors.muted, fontSize: 14 },
});
