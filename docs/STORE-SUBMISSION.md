# Store Submission Checklist

Operational reference for each store submission. Pair with
[PROJECT-PLAN.md](./PROJECT-PLAN.md) for the broader strategy.

---

## Shared (both stores)

- [ ] App name: **BidaWash**
- [ ] Bundle ID / Application ID: **`ph.bidawash.app`**
- [ ] Versioning: SemVer in `app.config.ts` (`version`); per-platform build
      numbers auto-bumped by EAS Submit.
- [ ] Privacy policy URL live and reachable.
- [ ] Terms of service URL live and reachable.
- [ ] Support URL: `https://bidawash.com/support` (or similar).
- [ ] Support email: `support@bidawash.com`.
- [ ] Reviewer account: `reviewer@bidawash.com` with pre-seeded data; note
      credentials in each store's review notes.
- [ ] App icon (1024×1024, no alpha, no rounded corners — stores apply
      masks).
- [ ] Splash screen.
- [ ] Screenshots per device size (use Mockuuups, Screenshots.pro, or
      similar to standardize).
- [ ] Short description / promotional text.
- [ ] Long description.
- [ ] Marketing keywords / category.
- [ ] Age rating questionnaire answered consistently across both stores.
- [ ] Account deletion path is in-app **and** documented at a public URL.

---

## Apple — TestFlight & App Store

> **TestFlight** is Apple's official beta-distribution service for iOS apps.
> It lets us ship pre-release builds to **internal testers** (team members
> added by Apple ID, up to 100) and **external testers** (anyone, by email
> invite or public link, up to 10,000) without going through full App Store
> review. External builds do require a short Beta App Review on the first
> submission, but it's much lighter than full App Store review. We use
> TestFlight for QA in Phase 2 and for closed-beta payments testing in
> Phase 3.

### Pre-submission

- [ ] Apple Developer membership active (Individual for Phase 2 testing,
      Organization for public launch).
- [ ] D-U-N-S number on file (Org only).
- [ ] Legal entity name matches D-U-N-S exactly.
- [ ] Bundle ID registered in Apple Developer Portal.
- [ ] APNs Auth Key (.p8) uploaded for production push (deferred until
      Phase 2 push work).
- [ ] App Store Connect record created.
- [ ] Encryption / export compliance answered (almost always "uses standard
      encryption, exempt").

### App Privacy (data declarations)

- [ ] Email (auth) — Linked to user, used for app functionality.
- [ ] Name (account) — Linked to user, used for app functionality.
- [ ] Phone (account, optional) — Linked to user, used for app
      functionality.
- [ ] Push token (Expo / APNs) — Not linked.
- [ ] Crash / performance data (Sentry) — Not linked, used for analytics.
- [ ] Location (if "find nearest branch" enabled) — Not linked, used for
      app functionality.
- [ ] Payment info (Phase 3 only) — Not collected by the app; processed by
      Stripe/Maya/GCash directly.

### iOS-specific Info.plist usage descriptions

When the relevant capability is added, set a user-facing reason:

- `NSCameraUsageDescription` — "BidaWash uses the camera to scan your
  membership QR code at the wash bay."
- `NSPhotoLibraryUsageDescription` — only if photo upload is added.
- `NSLocationWhenInUseUsageDescription` — "BidaWash uses your location to
  show the nearest branch and operating hours."
- `NSUserTrackingUsageDescription` — only if cross-app tracking is added
  (likely never).

### Account-related guideline checks (5.1.1)

- [ ] Account creation is optional where possible (browsing locations, FAQs
      should not require an account).
- [ ] Account deletion is in-app, completes within 30 days, and is
      reachable without contacting support.
- [ ] Email verification before any sensitive action.

### Payments (Phase 3)

- [ ] Membership / package purchase copy clearly references **physical car
      wash services** at named locations.
- [ ] No digital-only goods, coupons, or content sold in the same app.
- [ ] Review notes explicitly cite Guideline 3.1.5(a) — "physical goods
      and services delivered outside the app" — and explain that the
      membership is prepayment for in-person wash services.
- [ ] In-app cancellation path for any auto-renewing membership.

### TestFlight

- [ ] Internal testing group created (Apple ID-based).
- [ ] External testing group created (requires Beta App Review for the
      first build).
- [ ] Test information page filled in (what to test, contact email).

---

## Google Play — Internal/Closed/Production

### Pre-submission

- [ ] Google Play Console Org account created and business-verified.
- [ ] Application ID registered: `ph.bidawash.app`.
- [ ] FCM service account JSON uploaded (deferred until Phase 2 push work).
- [ ] App signing by Google Play enabled (default).
- [ ] Internal test track set up with all team device emails.
- [ ] Closed test track set up with 12+ external testers.
- [ ] **14-day clock started** on the closed test — required before
      production eligibility.

### Data Safety form

Mirror the Apple App Privacy answers. Categories to declare:

- [ ] Personal info: email, name, phone (collected, encrypted in transit,
      can be deleted).
- [ ] App activity: crash logs (Sentry).
- [ ] Device or other IDs: push tokens.
- [ ] Location (if used).
- [ ] Financial info (Phase 3 only) — declare provider-processed, not
      collected by the app.

### Android-specific

- [ ] Target API level meets Play's current minimum (currently 34; bumps
      each August).
- [ ] `adaptive-icon` configured (foreground + background).
- [ ] Permissions in `AndroidManifest.xml` minimized; each justified in
      review notes.
- [ ] Account deletion: in-app **and** publicly documented at
      `https://bidawash.com/account-deletion` (or similar).

### Payments (Phase 3)

- [ ] Same "physical service" framing as Apple.
- [ ] In-app cancellation flow for any subscription.
- [ ] Refund/cancellation policy linked from purchase screens.
- [ ] If using Stripe Checkout / web flow: ensure the redirect deep link
      back to the app is handled.

---

## Submission notes template

When uploading a build for review, include in the reviewer notes:

```
Reviewer account
  Email: reviewer@bidawash.com
  Password: <from 1Password vault>

What this build includes
  - <phase-appropriate feature list>

Payment model (Phase 3 builds only)
  BidaWash sells prepaid car-wash service packages and memberships that are
  redeemed in person at BidaWash physical locations in the Philippines.
  These are physical services delivered outside the app, so external
  payment (Stripe / Maya / GCash) is used per:
    - Apple App Store Review Guideline 3.1.5(a)
    - Google Play Payments Policy "physical goods and services" exception

Support contact
  support@bidawash.com
```
