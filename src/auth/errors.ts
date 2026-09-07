// Maps Supabase auth error messages to user-friendly copy. Raw Supabase
// strings are technically accurate but jargon-y ("Invalid login credentials")
// — these read better and don't change between Supabase versions.

const MAP: Record<string, string> = {
  'invalid login credentials': 'Wrong email or password.',
  'email not confirmed': 'Please confirm your email first. Check your inbox for the link.',
  'user already registered': 'That email is already in use. Try signing in instead.',
  'email rate limit exceeded':
    'Too many attempts from this device. Please wait a few minutes and try again.',
  'over email send rate limit': 'Too many emails sent. Please wait an hour, or contact support.',
  'error sending magic link email':
    'Could not send the email — likely an email rate limit. Wait an hour and try again.',
  'error sending confirmation email':
    'Could not send the email — likely an email rate limit. Wait an hour and try again.',
  'error sending recovery email':
    'Could not send the email — likely an email rate limit. Wait an hour and try again.',
  'signup is disabled': 'New sign-ups are temporarily disabled. Please try again later.',
  'password should be at least 6 characters':
    'Please choose a password with at least 6 characters.',
  'new password should be different from the old password':
    'Your new password must be different from your current one.',
  'unable to validate email address: invalid format': 'That email address looks invalid.',
};

export function friendlyAuthError(err: unknown, fallback: string): string {
  if (!(err instanceof Error)) return fallback;
  const key = err.message.trim().toLowerCase();
  return MAP[key] ?? err.message;
}
