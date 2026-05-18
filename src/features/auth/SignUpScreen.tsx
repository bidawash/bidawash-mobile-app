import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
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

  const canSubmit =
    name.trim().length > 1 && email.includes('@') && password.length >= 6 && !isLoading;

  async function handleSubmit() {
    setError(null);
    try {
      await signUp(email.trim(), password, name.trim());
    } catch {
      setError('Could not create your account. Try again.');
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.brand}>BidaWash</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>It only takes a minute.</Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Juan dela Cruz"
          autoCapitalize="words"
        />
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
        <Button
          title="Create account"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!canSubmit}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Button title="Sign in" variant="ghost" onPress={() => navigation.navigate('SignIn')} />
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
