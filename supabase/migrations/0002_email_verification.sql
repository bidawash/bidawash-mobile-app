-- 0002_email_verification.sql
-- Soft email verification. The Supabase auth setting "Confirm email" stays
-- OFF (sign-up is instant) and we track verification ourselves: when the
-- user taps the magic link we send via signInWithOtp, the app stamps this
-- column. UI uses it to gate nags and, in Phase 3, sensitive actions.
--
-- This is "soft" verification — we trust the client to stamp the column
-- after the magic-link session arrives. Sufficient for "we can reach this
-- user". For identity-grade verification (e.g. payments), move the stamp
-- to a SECURITY DEFINER RPC or Edge Function that inspects the session.

alter table public.profiles
  add column if not exists email_verified_at timestamptz;
