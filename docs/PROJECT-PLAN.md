# BidaWash Mobile App — Project Plan

Last updated: 2026-05-17

This is the source-of-truth planning document for the BidaWash customer-facing
mobile app (iOS + Android). It captures the chosen stack, phased roadmap,
risks, store-policy implications, and required credentials.

For per-store submission checklists, see [STORE-SUBMISSION.md](./STORE-SUBMISSION.md).
For contribution conventions (branches, commits), see [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## Table of contents

1. [Plan soundness review](#1-plan-soundness-review)
2. [Stack: React Native + Expo (EAS)](#2-stack-react-native--expo-eas)
3. [Backend: Supabase](#3-backend-supabase)
4. [Repo / folder structure](#4-repo--folder-structure)
5. [Hard blockers for store submission](#5-hard-blockers-for-store-submission)
6. [Credentials, accounts, documents](#6-credentials-accounts-documents)
7. [Cost implications](#7-cost-implications)
8. [Apple / Google policy implications](#8-apple--google-policy-implications)
9. [Phase 2 MVP scope](#9-phase-2-mvp-scope)
10. [Step-by-step roadmap](#10-step-by-step-roadmap)
11. [Assumptions and open questions](#11-assumptions-and-open-questions)

---

## 1. Plan soundness review

The three-phase plan (Foundation → Informational MVP → Commerce) is correct.
Three things to keep in mind:

- **Phase 2 → Phase 3 split is intentional.** Shipping an informational app
  through Apple/Google review first surfaces signing, provisioning, and
  listing issues before payments add risk.
- **iOS Individual → Organization is not a transfer.** Apple does not migrate
  apps between developer accounts that belong to different legal entities.
  Anything submitted under the Individual account (including TestFlight) is
  effectively throwaway. A fresh App Store Connect record will be created
  under the Organization once D-U-N-S is approved.

  *TestFlight is Apple's official beta-distribution service for iOS apps. It
  lets you ship pre-release builds to internal testers (your team, by Apple
  ID) and up to 10,000 external testers (by email invite or public link)
  without going through full App Store review. We'll use it for QA in
  Phase 2 and for closed-beta access in Phase 3.*
- **Google Play new-account testing requirement.** New developer accounts
  (especially personal, but increasingly orgs too) must run a closed test
  with **12+ testers for 14+ continuous days** before being eligible for
  production. The clock should start as early as possible with a stub build.

## 2. Stack: React Native + Expo (EAS)

Decision: **React Native + Expo (managed workflow) with EAS Build / EAS Submit.**

> **What is Expo and EAS?**
> **Expo** is an open-source framework on top of React Native. It bundles the
> tooling (CLI, dev client, push, updates, native modules) so you can build
> iOS and Android apps from one TypeScript/JavaScript codebase without
> touching Xcode or Android Studio day-to-day.
>
> **EAS** stands for **Expo Application Services**. It's Expo's hosted cloud
> service for the parts you can't (or don't want to) do locally:
> - **EAS Build** — compiles your iOS `.ipa` and Android `.aab` / `.apk` in
>   the cloud on Apple/Google's required hardware, so you don't need a Mac
>   for iOS builds or a beefy local toolchain for Android.
> - **EAS Submit** — uploads finished builds to TestFlight / Google Play.
> - **EAS Update** — over-the-air JS bundle updates so you can push bug
>   fixes without re-submitting to the stores.
>
> The "managed workflow" means Expo owns the native iOS/Android project
> files; we only write JS/TS. If a feature ever needs a custom native
> module, `expo prebuild` generates the native projects so we can drop down
> a level without rewriting the app.

Reasoning:

| Option | Verdict | Notes |
|---|---|---|
| **Expo (managed) + EAS** | Chosen | Fastest path. Handles iOS/Android builds, OTA updates, push, notifications, deep links, QR scanning, secure storage, maps. Config plugins solve the "I need native code" problem. |
| Bare React Native | No | More native control, but you own all the build/signing/upgrade pain. Not justified at this scope. |
| Flutter | No | Dart ecosystem for Maya/GCash is thin — most PH payment SDKs ship JS/web-checkout first. PH hiring pool also leans React/RN. |
| Native iOS + Android separately | No | Doubles cost/timeline for no advantage at this scope. |

Use a recent Expo SDK (currently scaffolded on SDK 52; update with
`npx expo install --fix` as needed). Stay on the managed workflow. Run
`expo prebuild` only if a specific native module demands it.

## 3. Backend: Supabase

Decision: **Supabase.**

| Option | Verdict | Notes |
|---|---|---|
| **Supabase** | Chosen | Postgres fits the domain (users → memberships → packages → transactions → redemptions is relational). Built-in auth, Row Level Security, Edge Functions, realtime, storage. Free tier covers Phase 2. Self-host escape hatch exists. |
| Firebase | No | Faster initial auth, but Firestore (NoSQL) makes the Phase 3 commerce/membership data model painful. FCM push is available via Expo regardless. |
| Custom (Node/Nest/Go) | No | Too much undifferentiated work for an MVP. Revisit only if Phase 3 reveals real backend needs Supabase can't cover. |

**Critical rule:** payment creation/capture lives in **Supabase Edge
Functions**, never in the app. The app must never hold Stripe / Maya / GCash
secret keys.

## 4. Repo / folder structure

> For a deeper walkthrough — where the iOS/Android code lives, what's
> shared, what gets generated at build time, the EAS Build flow — see
> [ARCHITECTURE.md](./ARCHITECTURE.md).

Single Expo app, feature-folder layout. No monorepo yet — add it later if a
web admin appears.

```
bidawash-mobile-app/
├── app.config.ts                    # Expo config (env-driven)
├── eas.json                          # EAS profiles: development / preview / production
├── package.json
├── tsconfig.json                     # TypeScript strict
├── .env.example                      # never commit real .env
├── assets/                           # icons, splash, fonts, images
├── src/
│   ├── api/                          # Supabase client + typed queries (Phase 2)
│   ├── auth/                         # auth context, hooks (Phase 2)
│   ├── components/                   # shared, dumb UI
│   ├── features/                     # feature folders, each self-contained
│   │   ├── onboarding/
│   │   ├── account/
│   │   ├── locations/
│   │   ├── services/
│   │   ├── membership/               # informational in Phase 2; expands in Phase 3
│   │   ├── faqs/
│   │   ├── support/
│   │   └── announcements/
│   ├── navigation/                   # React Navigation stacks/tabs (Phase 2)
│   ├── hooks/
│   ├── lib/                          # cross-cutting: sentry, env, logger, errors
│   ├── theme/                        # colors, typography, spacing
│   ├── types/                        # shared TS types, generated DB types
│   └── utils/
├── supabase/                         # added in Phase 2
│   ├── migrations/                   # SQL migrations, version-controlled
│   └── functions/                    # Edge Functions (payments in Phase 3)
└── docs/
    ├── PROJECT-PLAN.md               # this file
    └── STORE-SUBMISSION.md           # per-store checklists
```

Day-one conventions (all enforced by tooling in Phase 1):

- TypeScript strict mode.
- ESLint + Prettier on save.
- Absolute imports via `@/...`.
- Env vars via `app.config.ts` + `expo-constants`.
- Conventional commits (commitlint + Husky).
- Branch format: `MM-DD-YYYY/short-slug`.

## 5. Hard blockers for store submission

### iOS

- D-U-N-S number for the Organization account (free, 1–14 days; sometimes
  longer for PH entities).
- Legal entity name must match the D-U-N-S record exactly.
- Public privacy policy URL **before** first submission.
- Public support URL.
- App Privacy questionnaire (App Store Connect) — declare every data type
  collected.
- Age rating questionnaire.
- Export compliance declaration (encryption — almost certainly "uses standard
  encryption, exempt").
- Apple Sign-In is **required** if any other social login is offered
  (Guideline 4.8). Email/password-only avoids this.
- Account deletion in-app (Guideline 5.1.1(v)) — non-negotiable since 2022.
- Bundle ID chosen carefully; cannot be changed after first submission.
  Chosen: **`ph.bidawash.app`**.

### Android

- Google Play Console Org account + business verification (D-U-N-S not
  required, but business address/website are).
- 12+ closed testers for 14+ days before production eligibility — start
  early.
- Privacy policy URL.
- Data Safety form (similar to Apple's App Privacy).
- Target API level requirement (currently API 34; bumps each August).
- Account deletion in-app **and** via a public web URL.
- App signing by Google Play (default — let Google manage the upload key).

## 6. Credentials, accounts, documents

### Have now

- ✅ Apple Developer Individual ($99/yr).
- ✅ Domain: **bidawash.com**.
- ✅ Support email: **support@bidawash.com**.

### Needed for Phase 1

- ⬜ Google Play Console Organization ($25 one-time).
- ⬜ Expo / EAS account (free tier fine for Phase 2; paid for production OTA
  volume).
- ⬜ Supabase project (free tier).
- ⬜ Static hosting for **privacy policy + terms** (GitHub Pages, Vercel, or
  a stable Notion public page). Pages must be live before first store
  submission.
- ⬜ Sentry account (recommended; declare in privacy disclosures).
- ⬜ App icon (1024×1024) and splash assets — get these designed early;
  often the long pole.
- ⬜ Brand color palette (placeholders in `src/theme/index.ts` for now).

### Needed before public iOS launch

- ⬜ Apple Developer Organization ($99/yr) — requires D-U-N-S.
- ⬜ D-U-N-S number from Dun & Bradstreet (free for Apple).
- ⬜ Business registration documents (SEC/DTI in PH).

### Needed for Phase 3

- ⬜ Stripe account (verify PH availability for the business category).
- ⬜ Maya Business account (requires SEC registration).
- ⬜ GCash for Business account (requires business registration).
- ⬜ APNs Auth Key (.p8) for production push (Expo's dev push service is
  fine in Phase 2).
- ⬜ FCM service account JSON for Android push.

### Legal / policy documents

- ⬜ Privacy policy (covers: data collected, retention, third parties —
  Supabase, Sentry, payment providers, analytics).
- ⬜ Terms of Service.
- ⬜ EULA (Apple provides a default; only override if custom terms are
  required).
- ⬜ Refund / cancellation policy (linked from Phase 3 purchase flows).
- ⬜ PH Data Privacy Act 2012 compliance — if processing personal data of
  1,000+ people, register with the NPC.

## 7. Cost implications

Grouped by when each cost lands. All third-party prices are approximate and
based on each vendor's public pricing at the time of writing — **verify on
each vendor's site before committing budget**. Currency: USD unless stated.

### One-time

| Item                                  | Cost                | Notes                                                          |
|---------------------------------------|---------------------|----------------------------------------------------------------|
| Google Play Console (Org)             | **$25**             | Lifetime, one-off.                                             |
| D-U-N-S number (for Apple Org)        | Free via Apple      | 1–14 days; longer for some PH entities.                        |
| PH business registration (SEC/DTI)    | ~₱5,000–₱20,000     | Required for the business; not app-specific.                   |
| Brand asset design (icon, splash, palette) | ₱5,000–₱100,000+ | Designer-dependent; can DIY initially.                         |
| Legal review of privacy/terms         | ₱20,000–₱200,000+   | Optional in Phase 2; strongly recommended before Phase 3 launch. |

### Recurring (annual)

| Item                                  | Cost                | Notes                                                          |
|---------------------------------------|---------------------|----------------------------------------------------------------|
| Apple Developer (Individual)          | **$99/yr**          | Already paid. Keep current until the Org account is active.    |
| Apple Developer (Organization)        | **$99/yr**          | Required for public iOS launch. **Additional**, not a replacement during the transition window. |
| `bidawash.com` domain                 | ~$10–15/yr          | Already owned.                                                 |

### Subscriptions (free tier first; upgrade as usage grows)

| Service                               | Free tier covers                                | Paid plan when needed                                                                 |
|---------------------------------------|--------------------------------------------------|-----------------------------------------------------------------------------------------|
| **Expo / EAS** (build & ship)         | ~30 cloud builds/mo, 1 concurrent build, basic EAS Update | Production: **~$99/mo** for faster builds, more concurrency, higher OTA limits. Likely needed once we ship weekly. |
| **Supabase** (backend)                | 500 MB Postgres, 1 GB file storage, 50K MAU     | Pro: **$25/mo + usage** once you exceed free-tier MAU or storage.                       |
| **Sentry** (crash reporting)          | 5K errors/mo, 1 seat                            | Team: **~$26/mo** for multiple seats and higher event volume.                           |
| Privacy/terms hosting                 | GitHub Pages or Vercel free tier                | Free for the foreseeable future.                                                        |
| Push notifications                    | Expo push service is free; APNs + FCM are free | No paid tier needed.                                                                    |
| Google Maps (if used in Locations)    | $200/mo free Maps credit                        | ~$2–7 per 1,000 map loads past the free credit. Most likely free-tier for our volume.   |

### Phase 3 — payment processing (transactional, not subscription)

Per-transaction fees taken by the payment provider. **Apple and Google take
0%** because BidaWash sells physical car-wash services (see §8).

| Provider                              | Typical PH rate                                  |
|---------------------------------------|--------------------------------------------------|
| Stripe (cards, PH)                    | ~3.9% + ₱15 per transaction                      |
| Maya (cards / e-wallet)               | ~2.5–3.5% per transaction                        |
| GCash (e-wallet)                      | ~2–2.5% per transaction                          |

### Illustrative steady-state monthly OpEx

Excludes transaction fees, design, legal, and PH business-registration costs
(those are one-off or already sunk).

| Stage                                                       | Monthly run-rate                                |
|-------------------------------------------------------------|--------------------------------------------------|
| **Phase 2** (informational MVP, low traffic)               | Everything fits free tiers; amortized Apple/Google fees only ≈ **~$16/mo**. |
| **Phase 3 early** (a few hundred MAU)                       | Supabase Pro ($25) + Sentry Team ($26) ≈ **~$50–70/mo**. |
| **Phase 3 scaled** (thousands of MAU, weekly EAS builds)   | + EAS Production ($99) ≈ **~$170+/mo** plus payment processing fees. |

## 8. Apple / Google policy implications

### Payments — the big one

The car wash is a **real-world physical service**, which puts BidaWash in the
**"physical goods and services" carve-out**:

- **Apple Guideline 3.1.5(a):** physical goods/services delivered outside the
  app can use external payment (Stripe/Maya/GCash). Apple IAP is not
  required.
- **Google Play Payments Policy:** same carve-out — physical goods/services
  use any payment method.

**But:**

- Memberships must be clearly framed as **prepaid physical car wash
  services**, not as a digital subscription. Copy should read like
  "Unlimited car washes at BidaWash physical locations."
- Do **not** sell anything purely digital in the same app (digital coupons
  detached from a physical wash, etc.) — that re-triggers IAP requirements.
- Auto-renewing memberships via Stripe/Maya are fine, but the cancellation
  flow must be obvious and in-app. Both stores reject apps where users can
  subscribe but can't cancel.

### Other policy items

- **Apple ATT prompt:** only required if tracking users across other
  companies' apps/websites. First-party analytics (Supabase, Sentry) do not
  trigger it. Likely not needed.
- **Apple Sign-In requirement:** triggered only by other social logins.
  Starting email/password-only defers this.
- **Account deletion:** in-app and discoverable. Both stores. Build it in
  Phase 2.
- **Push notification consent:** must be requested at a sensible moment, not
  on first launch. Marketing pushes need explicit opt-in.
- **Permission strings (iOS Info.plist):** every permission (camera for QR,
  notifications, location for "find nearest branch") needs a user-facing
  reason string. Vague strings get rejected.
- **Reviewer test account:** both stores require a working demo account in
  review notes. Set up a permanent `reviewer@bidawash.com` with pre-seeded
  data.

## 9. Phase 2 MVP scope

Build only:

1. **Onboarding** — 3 screens max, skippable, value-prop only.
2. **Auth** — email + password via Supabase, plus forgot-password. Defer
   social logins (avoids Apple Sign-In requirement).
3. **Account** — name, email, phone, sign out, **delete account** (hard
   requirement).
4. **Locations** — list view + map view (react-native-maps), tap pin →
   details with hours, address, phone, "Get Directions" deep link.
5. **Services overview** — static content rendered from Supabase tables so
   it can be edited without redeploying.
6. **Membership info** — informational only, with a "Notify me when
   available" button that writes to Supabase.
7. **FAQs** — collapsible list from Supabase.
8. **Contact support** — `mailto:` + in-app form writing to Supabase.
9. **Announcements** — list from Supabase, optionally surfaced via push.
10. **Privacy / Terms** — in-app WebView pointing to the hosted pages.
11. **Push notifications** — register device tokens with Supabase, allow
    admin to send broadcasts. Keep simple.

Deferred to Phase 3 (already planned): purchases, QR, payment, redemption,
purchase history, refund flows.

**Aggressive but realistic timeline:** 4–6 weeks for one engineer if assets
and copy are ready; 8–10 weeks if designing as we go.

## 10. Step-by-step roadmap

### Phase 1 — Foundation (week 1–2, in parallel)

1. ⬜ Register Apple Developer Org application and start D-U-N-S process
   (long lead time — kick off ASAP).
2. ⬜ Create Google Play Console Org account; complete business
   verification.
3. ✅ Domain (`bidawash.com`) and `support@bidawash.com` mailbox.
4. ⬜ Stand up Supabase project; sketch schema (users, locations, services,
   faqs, announcements, support_messages, membership_interest).
5. ⬜ Stand up privacy policy + terms pages on a stable URL.
6. 🔧 Create Expo app with EAS configured for `development` / `preview` /
   `production` profiles. **(In progress)**
7. 🔧 Lock: bundle ID (`ph.bidawash.app`), app name (`BidaWash`), primary
   brand colors (placeholders), app icon (1024×1024) and splash (TBD —
   designer).
8. 🔧 Set up Sentry, ESLint, Prettier, TypeScript strict, commitlint,
   Husky.
9. ⬜ Create internal Apple TestFlight group and Google Play closed test
   track. **Start the 12-tester / 14-day Google clock immediately** with a
   stub build. *(Blocked on developer accounts.)*
10. 🔧 Document store-submission checklists in [STORE-SUBMISSION.md](./STORE-SUBMISSION.md).

### Phase 2 — Informational MVP (week 3–8)

11. ⬜ Auth + account + delete-account end-to-end on Supabase.
12. ⬜ Navigation skeleton (tabs: Home / Locations / Membership / Account).
13. ⬜ Build features in this order — each shippable to TestFlight / Internal
    track: Locations → Services → FAQs → Announcements → Membership info →
    Support → Onboarding polish.
14. ⬜ Add Expo push notifications + broadcast capability.
15. ⬜ QA pass on device matrix: 1 small iPhone, 1 large iPhone, 1 small
    Android, 1 large Android (minimum).
16. ⬜ First TestFlight submission and first Play closed-test build.
17. ⬜ App Store Connect + Play Console listings: screenshots, descriptions,
    privacy disclosures, Data Safety form.
18. ⬜ Submit for review (TestFlight external review for iOS;
    internal/closed only for Android until 14-day requirement is met).

### Phase 3 — Commerce (after Phase 2 is live)

19. ⬜ Finalize payment provider (recommendation: Stripe primary, Maya/GCash
    as wallet add-ons via Stripe's PH integrations if available, otherwise
    direct).
20. ⬜ Design Supabase schema for products, orders, transactions,
    memberships, redemptions; all amounts in centavos (integers).
21. ⬜ Implement payment **server-side** in Supabase Edge Functions; the app
    only calls the function, never the provider directly with secrets.
22. ⬜ Build purchase flow, purchase history, membership status, QR
    generation (signed JWT or short-lived token, not a raw ID).
23. ⬜ Build redemption flow — separate flow/role for the staff scanner.
    **Recommend a separate staff app** to keep customer-app review simple.
24. ⬜ Refund + cancellation flows; idempotent payment intents to prevent
    duplicate charges.
25. ⬜ Update privacy policy and Data Safety / App Privacy disclosures for
    payment data.
26. ⬜ Reviewer test account with pre-seeded membership and packages.
27. ⬜ Resubmit to both stores. Anticipate one round of policy clarification
    on the membership/IAP question — have the "physical service" rationale
    ready in review notes.

## 11. Assumptions and open questions

Held as assumptions — flag any that are wrong:

- **PH-only launch initially** (no US/other markets). Affects store regions,
  payment providers, tax/VAT.
- **English-only** in v1 (no Tagalog/Cebuano localization yet).
- **No staff/operator app in this codebase** — the QR scanner / redemption
  side is a separate concern for Phase 3+.
- **Memberships are prepaid physical-service plans, not digital
  subscriptions** — this is the basis for the external-payment policy
  argument.
- **No e-commerce of physical products** (e.g. shipping car wax) — keeps
  BidaWash firmly in the services carve-out.
- **Designer/design assets coming** — placeholders used until real assets
  arrive.
- **Legal owner drafts privacy/terms** (probably with a lawyer) — the app
  wires up the URLs but does not author legal text.

### Biggest risks (ranked)

1. **D-U-N-S and Apple Org verification timeline** — start now; this gates
   public iOS launch and is outside our control.
2. **Google Play 14-day / 12-tester rule** — start the closed test as early
   as humanly possible with even a stub build.
3. **Payment provider availability in PH for this business category** —
   verify Stripe PH onboarding before committing; have Maya/GCash as
   backups.
4. **Membership framing in store review** — easy to get rejected if it
   reads like a digital subscription. Copy and review notes matter.
5. **Apple Individual → Organization is a re-list, not a transfer** —
   don't over-invest in the Individual-account listing.
