# BidaWash Mobile App

Customer-facing mobile app for **BidaWash**, an automated car wash business
in the Philippines. Built with React Native + Expo for iOS and Android.

## Status

🚧 **Phase 1 — Foundation.** No user-facing features yet; this commit
contains the project scaffold, tooling, and planning documents.

- [docs/PROJECT-PLAN.md](docs/PROJECT-PLAN.md) — phased roadmap, risks,
  policy notes, costs.
- [docs/APP-SURFACE.md](docs/APP-SURFACE.md) — living reference for every
  screen, every flow, and what's stubbed vs real today.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the repo is laid out,
  where the iOS/Android code lives, what's shared.
- [docs/STORE-SUBMISSION.md](docs/STORE-SUBMISSION.md) — per-store
  checklists for App Store and Play Console.
- [CONTRIBUTING.md](CONTRIBUTING.md) — branch naming and commit format.

## Tech stack

| Layer        | Choice                                          |
|--------------|-------------------------------------------------|
| App          | React Native + **Expo (managed) SDK 52**        |
| Build / ship | **EAS** (Expo Application Services): EAS Build + EAS Submit + EAS Update |
| Language     | TypeScript (strict)                             |
| Backend      | **Supabase** (Postgres, Auth, Edge Functions)   |
| Errors       | **Sentry** (`@sentry/react-native`)             |
| Lint/format  | ESLint + Prettier                               |
| Commits      | Conventional Commits (commitlint + Husky)       |

**Expo** is a framework on top of React Native that bundles tooling, native
modules, and a managed iOS/Android project. **EAS** (Expo Application
Services) is Expo's hosted cloud — it builds our `.ipa` / `.aab` files,
uploads them to TestFlight / Google Play, and ships over-the-air JS updates
between store releases. See [docs/PROJECT-PLAN.md §2](docs/PROJECT-PLAN.md#2-stack-react-native--expo-eas)
for the full rationale.

Bundle ID / Application ID: `com.bidawash.app`

## Quick start

```bash
# 1. Install dependencies (also wires up Husky hooks).
npm install

# 2. Copy env template and fill in values when you have them.
cp .env.example .env

# 3. Start the Expo dev server.
npm run start
```

Then press `i` for iOS Simulator, `a` for Android emulator, or scan the QR
code with Expo Go on a physical device.

## Supabase setup

The app talks to a Supabase project for auth and (in Phase 2) feature data.
To run end-to-end locally:

1. **Create a project** at [supabase.com](https://supabase.com), region
   *Southeast Asia (Singapore)*. Copy the Project URL and the **anon** key
   from Settings → API into your `.env`:
   ```env
   SUPABASE_URL=https://<ref>.supabase.co
   SUPABASE_ANON_KEY=<anon-key>
   ```
2. **Apply the schema.** Open the SQL editor in the Supabase dashboard and
   paste each migration in `supabase/migrations/` in order:
   - [0001_auth_profiles.sql](supabase/migrations/0001_auth_profiles.sql) — `profiles` table, RLS, sign-up trigger.
   - [0002_email_verification.sql](supabase/migrations/0002_email_verification.sql) — adds `email_verified_at` for soft email verification.
   - [0003_favorites_and_faqs.sql](supabase/migrations/0003_favorites_and_faqs.sql) — favorite-branch and favorite-service columns on `profiles`, plus the `faqs` table with RLS.
   - [0004_content_tables.sql](supabase/migrations/0004_content_tables.sql) — `locations`, `services`, `location_services`, and `announcements` tables with RLS.
   - [0005_locations_coming_soon.sql](supabase/migrations/0005_locations_coming_soon.sql) — adds `is_coming_soon` on `locations` so a not-yet-open branch can appear with a COMING SOON badge.
   - [0006_membership_interest.sql](supabase/migrations/0006_membership_interest.sql) — adds `membership_interest_at` on `profiles` for the BidaWash Premium launch waitlist.
   - [0007_public_content_reads.sql](supabase/migrations/0007_public_content_reads.sql) — opens `locations`, `services`, `location_services`, `announcements`, and `faqs` to unauthenticated reads so guest-mode users can browse without signing up.

   Then paste both seed files: [supabase/seed/faqs.sql](supabase/seed/faqs.sql) (customer FAQs from [docs/faqs.csv](docs/faqs.csv)) and [supabase/seed/content.sql](supabase/seed/content.sql) (branches, services, announcements). Both use `on conflict do update`, so re-run whenever the source content changes.
3. **Deploy the `delete-account` Edge Function.** Required for the in-app
   "Delete account" button (App Store + Play Store policy).
   ```bash
   brew install supabase/tap/supabase   # or: npm i -g supabase
   supabase login
   supabase link --project-ref <ref>
   supabase functions deploy delete-account
   ```
   The function reads `SUPABASE_SERVICE_ROLE_KEY` from the function-runtime
   secrets that Supabase populates for you — no manual secret setup needed.
4. **Configure auth URLs.** Authentication → URL Configuration:
   - Site URL: `bidawash://`
   - Redirect URLs: add both `bidawash://reset-password` and
     `bidawash://verify-email`
   These let the password-reset and email-verification links bounce back
   into the app.

## Scripts

| Command              | Purpose                                       |
|----------------------|------------------------------------------------|
| `npm run start`      | Start the Expo dev server                      |
| `npm run ios`        | Open the iOS Simulator                         |
| `npm run android`    | Open the Android emulator                      |
| `npm run lint`       | Run ESLint                                     |
| `npm run lint:fix`   | Run ESLint with `--fix`                        |
| `npm run typecheck`  | Run `tsc --noEmit`                             |
| `npm run format`     | Run Prettier on the repo                       |

## Project layout

See the "Repo / folder structure" section of [docs/PROJECT-PLAN.md](docs/PROJECT-PLAN.md).

## Conventions

Branches, commits, and PR style are documented in [CONTRIBUTING.md](CONTRIBUTING.md).
