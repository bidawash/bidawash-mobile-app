import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { friendlyAuthError } from '@/auth/errors';
import { theme } from '@/theme';

type Status = 'idle' | 'sending' | 'sent' | 'error';

// Mounted on screens that should nag unverified users (Home today, plus the
// Account row). No dismiss button — Phase 2 wants users to verify before
// Phase 3 ships sensitive flows. Revisit when that becomes annoying.
export function VerifyEmailBanner() {
  const { user, sendEmailVerification } = useAuth();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  if (!user || user.emailVerified) return null;

  async function handleSend() {
    setStatus('sending');
    setError(null);
    try {
      await sendEmailVerification();
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(friendlyAuthError(err, 'Could not send the verification email. Please try again.'));
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.copy}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.body}>
          {status === 'sent'
            ? `We sent a link to ${user.email}. Tap it to verify — you can keep using the app in the meantime.`
            : 'Verifying lets us reach you about your account and recover it if you lose access.'}
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      {status !== 'sent' ? (
        <Pressable
          onPress={handleSend}
          disabled={status === 'sending'}
          style={({ pressed }) => [
            styles.button,
            pressed && status !== 'sending' ? styles.buttonPressed : null,
          ]}
          accessibilityRole="button"
        >
          {status === 'sending' ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={styles.buttonLabel}>{status === 'error' ? 'Try again' : 'Send link'}</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  copy: { flex: 1, gap: 4 },
  title: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  body: { fontSize: 13, color: theme.colors.text, lineHeight: 18 },
  error: { fontSize: 12, color: theme.colors.danger },
  button: {
    minHeight: 36,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  buttonLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
});
