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

Bundle ID / Application ID: `ph.bidawash.app`

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
