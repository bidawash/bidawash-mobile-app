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
    } catch (err) {
      setError(friendlyAuthError(err, 'Could not sign in. Please try again.'));
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <BrandMark size="md" />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter email"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter password"
          autoComplete="current-password"
          textContentType="password"
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
        <Button title="Sign up" variant="ghost" onPress={() => navigation.navigate('SignUp')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  title: { fontSize: 34, fontWeight: '800', color: theme.colors.primary, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text, lineHeight: 21 },
  form: { gap: theme.spacing.md },
  error: { color: theme.colors.danger, fontSize: 13 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  footerText: { color: theme.colors.text, fontSize: 14 },
});
