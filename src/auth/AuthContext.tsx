import * as Linking from 'expo-linking';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { supabase } from '@/api/supabase';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  // True once the user has tapped the magic link we send via
  // sendEmailVerification. See supabase/migrations/0002_email_verification.sql.
  emailVerified: boolean;
  // Persistent per-user preferences set via heart toggles in the app.
  // Both default to null; see supabase/migrations/0003_favorites_and_faqs.sql.
  favoriteLocationId: string | null;
  favoriteServiceId: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  // True while a user-initiated action (signIn/signUp) is in flight. Drives
  // button spinners.
  isLoading: boolean;
  // True only during cold-start session restore. Drives the root splash so
  // we don't flash the AuthStack to a signed-in user.
  isInitializing: boolean;
  // True once the user has tapped a password-reset link and we're holding
  // them on the "set new password" screen until they submit.
  passwordRecovery: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  completePasswordReset: (newPassword: string) => Promise<void>;
  cancelPasswordReset: () => Promise<void>;
  // Sends a magic-link email to the signed-in user's address. Tapping the
  // link opens the app via bidawash://verify-email and stamps emailVerified.
  sendEmailVerification: () => Promise<void>;
  // Updates editable profile fields (name, phone). Email + password have
  // their own dedicated flows.
  updateProfile: (updates: { name?: string; phone?: string | null }) => Promise<void>;
  // Sets the customer's preferred branch and/or service. Pass null to
  // clear one; undefined leaves that field untouched.
  updateFavorites: (updates: {
    favoriteLocationId?: string | null;
    favoriteServiceId?: string | null;
  }) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Redirect targets for email links. Both must be registered in
// Supabase → Authentication → URL Configuration → Redirect URLs.
const PASSWORD_RESET_REDIRECT = 'bidawash://reset-password';
const EMAIL_VERIFICATION_REDIRECT = 'bidawash://verify-email';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Restore any persisted session on mount.
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mountedRef.current) return;
      const next = await resolveUser(data.session?.user ?? null);
      if (!mountedRef.current) return;
      setUser(next);
      setIsInitializing(false);
    });

    // Stay in sync with sign-in / sign-out / token-refresh events.
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const next = await resolveUser(session?.user ?? null);
      if (!mountedRef.current) return;
      setUser(next);
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true);
      }
    });

    // Handle our two email deep-links. Both arrive as
    //   bidawash://<path>#access_token=...&refresh_token=...&type=<type>
    // - type=recovery → password reset (triggers PASSWORD_RECOVERY above)
    // - type=magiclink → verification proof; we stamp profiles.email_verified_at
    //   then refresh the resolved user so the UI updates.
    async function handleUrl(url: string | null) {
      if (!url) return;
      const params = parseUrlFragment(url);
      const type = params.get('type');
      if (type !== 'recovery' && type !== 'magiclink') return;
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (!access_token || !refresh_token) return;
      const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error || type !== 'magiclink' || !data.user) return;
      const userId = data.user.id;
      await supabase
        .from('profiles')
        .update({ email_verified_at: new Date().toISOString() })
        .eq('id', userId);
      const next = await resolveUser(data.user);
      if (mountedRef.current) setUser(next);
    }

    Linking.getInitialURL().then(handleUrl);
    const urlSub = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => {
      sub.subscription.unsubscribe();
      urlSub.remove();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isInitializing,
      passwordRecovery,
      async signIn(email, password) {
        setIsLoading(true);
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
        } finally {
          if (mountedRef.current) setIsLoading(false);
        }
      },
      async signUp(email, password, name) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
          });
          if (error) throw error;
          // When "Confirm email" is ON in Supabase, signUp succeeds but no
          // session is created until the user clicks the email link. Tell
          // the caller so it can show a "check your email" message rather
          // than silently looking frozen.
          return { needsEmailConfirmation: !data.session };
        } finally {
          if (mountedRef.current) setIsLoading(false);
        }
      },
      async signOut() {
        await supabase.auth.signOut();
      },
      async resetPassword(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: PASSWORD_RESET_REDIRECT,
        });
        if (error) throw error;
      },
      async completePasswordReset(newPassword) {
        setIsLoading(true);
        try {
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) throw error;
          if (mountedRef.current) setPasswordRecovery(false);
        } finally {
          if (mountedRef.current) setIsLoading(false);
        }
      },
      async cancelPasswordReset() {
        // Drop the recovery session entirely so the user lands back on SignIn.
        await supabase.auth.signOut();
        if (mountedRef.current) setPasswordRecovery(false);
      },
      async sendEmailVerification() {
        if (!user?.email) throw new Error('Not signed in.');
        const { error } = await supabase.auth.signInWithOtp({
          email: user.email,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: EMAIL_VERIFICATION_REDIRECT,
          },
        });
        if (error) throw error;
      },
      async updateProfile(updates) {
        if (!user) throw new Error('Not signed in.');
        setIsLoading(true);
        try {
          const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
          if (error) throw error;
          // Refresh local user so the UI reflects the new values.
          const { data } = await supabase.auth.getUser();
          const next = await resolveUser(data.user ?? null);
          if (mountedRef.current) setUser(next);
        } finally {
          if (mountedRef.current) setIsLoading(false);
        }
      },
      async updateFavorites(updates) {
        if (!user) throw new Error('Not signed in.');
        const payload: Record<string, string | null> = {};
        if ('favoriteLocationId' in updates) {
          payload.favorite_location_id = updates.favoriteLocationId ?? null;
        }
        if ('favoriteServiceId' in updates) {
          payload.favorite_service_id = updates.favoriteServiceId ?? null;
        }
        if (Object.keys(payload).length === 0) return;
        // Optimistic local update — heart toggles feel instant. If the DB
        // write fails, re-read the profile so state converges.
        setUser((prev) =>
          prev
            ? {
                ...prev,
                ...('favoriteLocationId' in updates
                  ? { favoriteLocationId: updates.favoriteLocationId ?? null }
                  : {}),
                ...('favoriteServiceId' in updates
                  ? { favoriteServiceId: updates.favoriteServiceId ?? null }
                  : {}),
              }
            : prev,
        );
        const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
        if (error) {
          const { data } = await supabase.auth.getUser();
          const next = await resolveUser(data.user ?? null);
          if (mountedRef.current) setUser(next);
          throw error;
        }
      },
      async deleteAccount() {
        const { data, error } = await supabase.functions.invoke('delete-account', {
          method: 'POST',
        });
        if (error) throw error;
        if (data && typeof data === 'object' && 'error' in data && data.error) {
          throw new Error(String((data as { error: unknown }).error));
        }
        await supabase.auth.signOut();
      },
    }),
    [user, isLoading, isInitializing, passwordRecovery],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

function parseUrlFragment(url: string): URLSearchParams {
  const hashIdx = url.indexOf('#');
  if (hashIdx === -1) return new URLSearchParams();
  return new URLSearchParams(url.substring(hashIdx + 1));
}

// Map a Supabase auth user to our AuthUser shape. Reads name/phone/favorites
// from the profiles table; falls back to the user_metadata name (set at
// sign-up) and finally to the email's local-part so the UI always has
// something to show.
async function resolveUser(
  authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null,
): Promise<AuthUser | null> {
  if (!authUser) return null;

  const fallbackName =
    (typeof authUser.user_metadata?.name === 'string'
      ? (authUser.user_metadata.name as string)
      : null) ??
    authUser.email?.split('@')[0] ??
    'Customer';

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, phone, email_verified_at, favorite_location_id, favorite_service_id')
    .eq('id', authUser.id)
    .maybeSingle();

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    name: profile?.name?.trim() ? profile.name : fallbackName,
    phone: profile?.phone ?? null,
    emailVerified: Boolean(profile?.email_verified_at),
    favoriteLocationId: profile?.favorite_location_id ?? null,
    favoriteServiceId: profile?.favorite_service_id ?? null,
  };
}
