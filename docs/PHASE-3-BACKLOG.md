# Phase 3 backlog

Cross-cutting "we should fix this later" items surfaced during Phase 2. The
top-level commerce roadmap (payments, memberships, QR redemption) lives in
[PROJECT-PLAN.md §10](./PROJECT-PLAN.md#10-step-by-step-roadmap) — this file
is just for the deferred polish + hardening work.

## Auth

- [ ] **Universal Links / Android App Links.** Replace the `bidawash://`
      custom scheme with `https://bidawash.com/verify-email` and
      `https://bidawash.com/reset-password`. Lets email links work even
      when tapped in a desktop browser, with a graceful fallback web page
      when the app isn't installed. Needs an AASA file +
      `assetlinks.json` hosted on `bidawash.com`, plus `associatedDomains`
      config in `app.config.ts` and the Apple team ID linkage.
- [ ] **Phone number signup as an alternative to email.** Phone + OTP via
      Supabase + Twilio. Code is ~1–2 days; real cost is Twilio setup,
      ~$0.05/SMS to PH, and PH-carrier sender-ID registration. Best
      bundled with the Phase 3 payment-OTP work so Twilio pays for itself.
- [ ] **Identity-grade email verification.** Today's stamp of
      `profiles.email_verified_at` happens client-side after the
      magic-link session lands — fine for "we can reach this user", not
      enough for gating payments. Move it into a SECURITY DEFINER RPC or
      Edge Function that inspects the session before writing.

## Backend / data

- [ ] **Restore branch phone numbers + Call button.** Removed from
      Phase 2 location detail until we have a real phone-number per
      branch and a tap-to-call flow we like. Add `phone` back to the
      `Location` type, re-add the "Call" button to LocationDetail, and
      wire the `tel:` link.

## Store submission

Hard blockers per store live in [STORE-SUBMISSION.md](./STORE-SUBMISSION.md).
Phase-3-only items (payment disclosures, refund flows) get added there as
we build them.
