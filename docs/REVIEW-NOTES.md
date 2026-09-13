# Review notes

For copy-paste into **App Store Connect → Version → App Review Information → Notes** and **Play Console → Testing → Closed testing → App content → App access**. Keep this file up to date each time you cut a build.

---

## Reviewer test account

- **Email:** `reviewer@bidawash.com`
- **Password:** _paste from 1Password vault at submission time — do not commit_

Account is pre-populated with:

- Verified email (no verification link needed)
- Favorite branch: GH Mall (Mandaluyong)
- Favorite service: Deluxe Foam Wash
- Opted in to BidaWash Premium launch waitlist

If you need a fresh account with no pre-set state, tap "Sign up" on the sign-in screen and create one with any email.

**Guest access:** the app can also be used without an account. On the Sign In screen, tap **"Continue as guest"** to browse locations, services, and FAQs. Account-linked features (favorites, launch waitlist, edit profile) will prompt for sign-up when tapped.

---

## What BidaWash is

BidaWash is a customer-facing app for **BidaWash**, a chain of touchless automated car-wash locations in Metro Manila, Philippines. Customers use the app to:

- Find nearby BidaWash branches with hours, directions, and available services
- Browse the wash package catalogue (Deluxe Foam Wash, Premium Wax Wash)
- Read customer FAQs and reach support
- Save a favorite branch and favorite service for quick access
- Join the launch waitlist for the upcoming BidaWash Premium loyalty programme

**The app does not process payments.** All car wash purchases happen in person at branches (BidaWash is cashless — cards + QRPh e-wallets, per Payments FAQ). The app is complementary customer info + engagement.

---

## Tab guide

| Tab | Contents |
|-----|----------|
| **Home** | Time-aware greeting, favorite-branch card, featured service tiles, latest announcements. |
| **Locations** | Two branches: GH Mall (open) and Parqal (marked "COMING SOON" — opens later this year). Search box + Sort by A–Z or Nearest. Each branch → detail with hours, directions handoff, favorite toggle. |
| **Membership** | Preview of upcoming BidaWash Premium loyalty programme with a functional "Notify me at launch" waitlist opt-in. |
| **Account** | Profile card (name, email, phone), Edit profile, verify email, FAQs, Support, Privacy policy, Terms of service, Sign out, Delete account. |

---

## How to test the key flows

### Continue as guest (Apple Guideline 5.1.1(v) compliance)

1. On Sign In screen, tap **Continue as guest**.
2. Locations, Services, FAQs, and Home content are fully browsable.
3. Try to favorite a branch → prompted to sign up.

### Favorite branch and favorite service

1. Sign in with the reviewer account.
2. Home → observe "Your favorite branch" red-outlined card.
3. Home → observe "★ Your usual" pill under the Deluxe Foam service tile.
4. Locations → tap GH Mall → the heart pill shows "Your favorite branch".
5. Tap it to unfavorite → Home card disappears.

### Find nearest branch (location permission)

1. Locations tab → tap **Nearest**.
2. iOS / Android prompt for location permission with our explanation ("BidaWash uses your location to show the nearest branch. Location is used only when you tap 'Sort by nearest' and never leaves your device.").
3. Grant → branches sort by distance; distance badge appears on each card.
4. Deny → a small hint appears; sort falls back to A–Z. No crash.

### Launch waitlist opt-in / opt-out

1. Membership tab → observe the reviewer account is already opted in ("★ You're on the list").
2. Tap **Leave the list** → returns to the "Notify me when memberships launch" button.
3. Tap **Notify me when memberships launch** → confirmation card returns.
4. Persists across app restart.

### FAQ search

1. Account tab → FAQs.
2. Search "wash" → list filters to matching questions in real time.
3. Tap a question → expands to reveal the answer.

### Account deletion (Guideline 5.1.1(v) / Play account-deletion policy)

1. Account tab → **Delete account**.
2. Confirm both dialogs.
3. User is signed out immediately; the account row and Supabase auth user are removed via a service-role Edge Function.
4. Attempting to sign back in with the same email fails ("Invalid credentials" — the account no longer exists).
5. In-app account deletion is documented at `https://www.bidawash.com/account-deletion`.

---

## Data collection

Mirror the App Privacy / Data Safety declarations below.

| Data | Purpose | Linked to user | Tracking |
|------|---------|----------------|----------|
| Email | Account management (auth, verification, password reset) | Yes | No |
| Name | Personalisation on Home tab | Yes | No |
| Phone (optional) | Account contact | Yes | No |
| Approximate / precise location | Sort branches by distance — **on-device only, never sent to servers** | No | No |
| Crash + performance data | Diagnostics (Sentry, anonymised) | No | No |

The app does **not** collect: contacts, photos, camera, microphone, health, or financial information.

---

## Payments (declaration)

This build does not offer any in-app purchases, subscriptions, tips, or digital goods. All BidaWash services are physical car wash services rendered at brick-and-mortar locations, paid in-branch.

When paid features are added in a future release, they will be prepayment for physical wash services, per:

- Apple App Store Review Guideline **3.1.5(a)** — "physical goods and services delivered outside the app"
- Google Play Payments Policy — "physical goods and services" exception

---

## Support & legal

- **Support:** [support@bidawash.com](mailto:support@bidawash.com)
- **Privacy policy:** https://www.bidawash.com/privacy
- **Terms of service:** https://www.bidawash.com/terms
- **Account deletion:** https://www.bidawash.com/account-deletion
- **Philippines Data Privacy Act (RA 10173) contact:** [support@bidawash.com](mailto:support@bidawash.com)

---

## Store-specific extras

### Apple App Store Connect

- Bundle ID: `com.bidawash.app`
- Categories: **Utilities** (primary) · **Business** (secondary) *(adjust if you prefer)*
- Age rating: 4+
- Encryption / export compliance: uses standard encryption (HTTPS/TLS) — **exempt**.
- `NSLocationWhenInUseUsageDescription` is set via the `expo-location` plugin. The location permission is optional; the app is fully usable without it.

### Google Play Console

- Application ID: `com.bidawash.app`
- Category: **Auto & Vehicles**
- Target audience: Adults 18+ (drivers)
- Location permission (`ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION`) is user-optional and only requested on tap. Data Safety declaration: Location collected on demand, not shared, not stored.
- No advertising IDs used.
- Account deletion is in-app **and** documented at the public URL above.
