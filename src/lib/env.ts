import Constants from 'expo-constants';

// Single, typed entry point for runtime env values. Anything added to
// `extra` in app.config.ts must be mirrored here.
type Env = {
  sentryDsn: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Partial<Env>;

export const env: Env = {
  sentryDsn: extra.sentryDsn ?? '',
  supabaseUrl: extra.supabaseUrl ?? '',
  supabaseAnonKey: extra.supabaseAnonKey ?? '',
};

// Use at app boundaries (e.g. Supabase client init) to fail loud in dev
// when a required value is missing, rather than silently proceeding.
export function requireEnv<K extends keyof Env>(key: K): string {
  const value = env[key];
  if (!value) {
    throw new Error(
      `Missing required env value: ${String(key)}. ` +
        `Add it to your .env file and restart the Expo dev server.`,
    );
  }
  return value;
}
