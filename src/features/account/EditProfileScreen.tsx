import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { friendlyAuthError } from '@/auth/errors';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import type { AccountScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

export function EditProfileScreen({ navigation }: AccountScreenProps<'EditProfile'>) {
  const { user, updateProfile, isLoading } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  // Disable Save when nothing has actually changed, or the name is empty.
  const nameChanged = trimmedName !== (user?.name ?? '');
  const phoneChanged = trimmedPhone !== (user?.phone ?? '');
  const canSubmit = trimmedName.length > 1 && (nameChanged || phoneChanged) && !isLoading;

  async function handleSave() {
    setError(null);
    setSavedFlash(false);
    try {
      await updateProfile({
        name: nameChanged ? trimmedName : undefined,
        // Empty phone string saves as null so the column is properly clear.
        phone: phoneChanged ? (trimmedPhone === '' ? null : trimmedPhone) : undefined,
      });
      setSavedFlash(true);
    } catch (err) {
      setError(friendlyAuthError(err, 'Could not save your changes. Please try again.'));
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Edit profile</Text>
        <Text style={styles.subtitle}>Update your name and phone number.</Text>
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
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          placeholder="+63 9XX XXX XXXX"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />

        <View style={styles.readonly}>
          <Text style={styles.readonlyLabel}>Email</Text>
          <Text style={styles.readonlyValue}>{user?.email ?? ''}</Text>
          <Text style={styles.readonlyHint}>
            Changing your email isn&apos;t supported yet. Contact support to update it.
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {savedFlash ? <Text style={styles.success}>Saved.</Text> : null}

        <Button
          title="Save changes"
          onPress={handleSave}
          loading={isLoading}
          disabled={!canSubmit}
        />
        <Button title="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.primary, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: theme.colors.text, fontWeight: '600' },
  form: { gap: theme.spacing.md },
  readonly: {
    gap: 4,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  readonlyLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.muted },
  readonlyValue: { fontSize: 15, color: theme.colors.text },
  readonlyHint: { fontSize: 12, color: theme.colors.muted, marginTop: 2 },
  error: { color: theme.colors.danger, fontSize: 13 },
  success: { color: theme.colors.success, fontSize: 13, fontWeight: '600' },
});
