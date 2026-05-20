import type { ExpoConfig, ConfigContext } from 'expo/config';

// Read env-driven values once so we can validate them in one place later.
const SENTRY_DSN = process.env.SENTRY_DSN ?? '';
const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';

// Values surfaced to the app at runtime via `expo-constants`.
// Read with the typed helper in src/lib/env.ts — do not pull from
// Constants directly elsewhere.
const extra = {
  sentryDsn: SENTRY_DSN,
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'BidaWash',
  slug: 'bidawash',
  scheme: 'bidawash',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'ph.bidawash.app',
    supportsTablet: false,
    // Per-permission usage strings get added here as features are built.
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'ph.bidawash.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-asset',
    'expo-font',
    [
      '@sentry/react-native/expo',
      {
        // Project-level config goes here when we wire up source maps in CI.
        // For now Sentry is initialized at runtime in src/lib/sentry.ts.
      },
    ],
  ],
  extra,
});
