import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { requireEnv } from '@/lib/env';

import { secureStorage } from './secureStorage';

// Single shared Supabase client for the app. Session tokens persist in
// expo-secure-store (iOS Keychain / Android Keystore) via a chunked adapter
// — see ./secureStorage.ts for why chunking is necessary.
export const supabase = createClient(requireEnv('supabaseUrl'), requireEnv('supabaseAnonKey'), {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    // React Native has no URL bar — Supabase's web detection would otherwise
    // try to parse window.location and crash.
    detectSessionInUrl: false,
  },
});
