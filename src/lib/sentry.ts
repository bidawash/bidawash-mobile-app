import * as Sentry from '@sentry/react-native';

import { env } from '@/lib/env';

let initialized = false;

// Idempotent so calling from App.tsx and from anywhere else (e.g. tests) is
// safe. No-ops when the DSN is empty — we don't want local dev or PR-preview
// builds polluting the production Sentry project.
export function initSentry(): void {
  if (initialized) return;
  if (!env.sentryDsn) return;

  Sentry.init({
    dsn: env.sentryDsn,
    // Keep traces light by default; tune in production once we have signal.
    tracesSampleRate: 0.1,
    // Surface stack traces in dev so we can spot init issues immediately.
    debug: __DEV__,
  });

  initialized = true;
}

export { Sentry };
