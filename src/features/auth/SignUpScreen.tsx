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

export function SignUpScreen({ navigation }: AuthScreenProps<'SignUp'>) {
  const { signUp, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const canSubmit =
    name.trim().length > 1 && email.includes('@') && password.length >= 6 && !isLoading;

  async function handleSubmit() {
    setError(null);
    setPendingEmail(null);
    try {
      const trimmedEmail = email.trim();
      const result = await signUp(trimmedEmail, password, name.trim());
      if (result.needsEmailConfirmation) {
        setPendingEmail(trimmedEmail);
      }
    } catch (err) {
      setError(friendlyAuthError(err, 'Could not create your account. Please try again.'));
    }
  }

  if (pendingEmail) {
    return (
      <Screen>
        <View style={styles.header}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a confirmation link to {pendingEmail}. Tap it to finish creating your account,
            then come back here to sign in.
          </Text>
        </View>
        <View style={styles.form}>
          <Button title="Back to sign in" onPress={() => navigation.navigate('SignIn')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <BrandMark size="md" />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill in the details to create your account</Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
        />
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
          placeholder="Create password"
          autoComplete="new-password"
          textContentType="newPassword"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Sign up" onPress={handleSubmit} loading={isLoading} disabled={!canSubmit} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Button title="Sign in" variant="ghost" onPress={() => navigation.navigate('SignIn')} />
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
