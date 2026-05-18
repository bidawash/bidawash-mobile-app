import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// Phase 2 placeholder auth. The public API of `useAuth` should not change
// once Supabase is wired up — only the implementations of signIn/signUp/etc.
// will start hitting the network instead of mutating local state.

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      async signIn(email, _password) {
        setIsLoading(true);
        try {
          // Pretend network latency so the UI loading state is exercised.
          await new Promise((resolve) => setTimeout(resolve, 400));
          setUser({ id: 'mock-user', email, name: email.split('@')[0] ?? 'Customer' });
        } finally {
          setIsLoading(false);
        }
      },
      async signUp(email, _password, name) {
        setIsLoading(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 400));
          setUser({ id: 'mock-user', email, name });
        } finally {
          setIsLoading(false);
        }
      },
      signOut() {
        setUser(null);
      },
      async resetPassword(_email) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      },
    }),
    [user, isLoading],
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
