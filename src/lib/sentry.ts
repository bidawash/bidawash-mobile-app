import * as Sentry from '@sentry/react-native';

import { env } from '@/lib/env';

let initialized = false;

// Sentry only runs in production builds. We skip init in development because:
//   1. Expo Go doesn't include Sentry's native module — calling init() there
//      throws "Native Client is not available, can't start on native".
//   2. Even in a dev client build, we don't want dev errors polluting the
//      production Sentry project.
//
// To smoke-test Sentry locally, build a release client with
// `eas build --profile preview` instead of running `expo start`.
export function initSentry(): void {
  if (initialized) return;
  if (!env.sentryDsn) return;
  if (__DEV__) return;

  Sentry.init({
    dsn: env.sentryDsn,
    // Keep traces light by default; tune in production once we have signal.
    tracesSampleRate: 0.1,
    debug: false,
  });

  initialized = true;
}

export { Sentry };
