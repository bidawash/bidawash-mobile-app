// Type augmentation for `process.env` values read in app.config.ts.
// Runtime app code should use src/lib/env.ts instead — these vars are not
// available in the JS bundle at runtime.

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SENTRY_DSN?: string;
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
    }
  }
}
