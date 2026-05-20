# App Surface

Living reference for what users see in the app today: every screen, every
flow, and exactly what's real vs stubbed. **Update this file whenever a
screen, route, or user flow changes.**

For overall strategy / roadmap, see [PROJECT-PLAN.md](./PROJECT-PLAN.md).
For code architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md).
For store submission, see [STORE-SUBMISSION.md](./STORE-SUBMISSION.md).

---

## Status snapshot

| Field                  | Value                                                                   |
|------------------------|-------------------------------------------------------------------------|
| **Current phase**      | Phase 2 — informational MVP (no backend wired yet)                      |
| **Auth**               | Stub: in-memory, resets on reload. Any valid-shape email + 6+ char pw works. |
| **Data**               | All mock — lives in `src/features/*/mock*.ts`                            |
| **Payments / QR**      | Not built (Phase 3)                                                     |
| **Push notifications** | Not yet (planned in Phase 2 backend pass)                                |
| **Last updated**       | 2026-05-20                                                              |

## How to keep this doc honest

When you change a screen or flow:

1. Update the affected section below (purpose, actions, stubbed flags).
2. Update the **State: stubbed vs real** table if a behavior moved.
3. Add a row to the **Changelog** at the bottom.
4. Bump **Last updated** above.

---

## Navigation tree

```
RootNavigator                                       (src/navigation/RootNavigator.tsx)
│  switches on auth state from src/auth/AuthContext.tsx
│
├── AuthStack (signed out)                          (src/navigation/AuthStack.tsx)
│   ├── Onboarding  ← entry point
│   ├── SignIn
│   ├── SignUp
│   └── ForgotPassword
│
└── AppTabs (signed in) — 4 bottom tabs              (src/navigation/AppTabs.tsx)
    │
    ├── Home tab          → HomeStack
    │                     ├── HomeScreen   (tab root)
    │                     └── Services
    │
    ├── Locations tab     → LocationsStack
    │                     ├── LocationsList (tab root)
    │                     └── LocationDetail
    │
    ├── Membership tab    → MembershipStack
    │                     └── MembershipInfo (tab root)
    │
    └── Account tab       → AccountStack
                          ├── AccountHome  (tab root)
                          ├── Faqs
                          ├── Support
                          ├── Privacy
                          └── Terms
```

Param-list types for every stack live in
[src/navigation/types.ts](../src/navigation/types.ts).

---

## Customer flows

### First-time visitor

```
Onboarding (3 slides)
   ├── "Next" (slides 1, 2)        → next slide
   ├── "Get started" (slide 3)     → SignUp
   └── "Skip" (any slide)          → SignIn
SignUp
   ├── valid fields → "Create account" → signed in → AppTabs[Home]
   └── "Sign in"                       → SignIn
```

### Returning visitor (current behavior)

```
Onboarding (always shown today)
   └── "Skip"                       → SignIn
SignIn
   ├── valid creds → "Sign in"      → signed in → AppTabs[Home]
   ├── "Forgot password?"           → ForgotPassword
   └── "Create one"                 → SignUp
```

> **Open question:** once we add AsyncStorage, Onboarding should auto-skip
> on subsequent launches. See **Open product questions** below.

### Forgot password

```
SignIn → "Forgot password?" → ForgotPassword
   → enter email → "Send reset link" → success card → "Back to sign in"
```

### Signing out

```
Account tab → AccountHome → "Sign out" (with confirm dialog)
   → back to AuthStack[Onboarding]
```

### Finding a branch

```
Locations tab → LocationsList → tap a card → LocationDetail
   ├── "Call"           → opens phone dialer (tel:)
   └── "Get directions" → opens Google Maps (browser/maps app)
```

### Browsing services

```
Home tab → HomeScreen → "See all services" → Services
```

### Reading FAQs

```
Account tab → AccountHome → "FAQs" card → Faqs
   → tap a question → expands inline (accordion)
```

### Contacting support

```
Account tab → AccountHome → "Contact support" card → Support
   → "Email support" → opens email client to support@bidawash.com
```

### Privacy / Terms

```
Account tab → AccountHome → "Privacy policy" or "Terms of service"
   → in-app summary screen
   → "View full policy/terms" → in-app browser (expo-web-browser)
   → opens bidawash.com/privacy or bidawash.com/terms
```

### Membership interest

```
Membership tab → MembershipInfo → "Notify me when available"
   → local "you're on the list" confirmation
   → (today: nothing persisted; Phase 2 backend will write to Supabase)
```

---

## Screen reference

### AuthStack

#### Onboarding
- **File:** [src/features/onboarding/OnboardingScreen.tsx](../src/features/onboarding/OnboardingScreen.tsx)
- **Shows:** 3 slides (Welcome / Find your branch / Memberships coming soon), dot indicator, Skip (top right), Next or Get-started (bottom).
- **Actions:** Next advances. Skip → SignIn. Get started (slide 3) → SignUp.
- **Stubbed:** Always shown. No "seen-before" persistence yet.

#### SignIn
- **File:** [src/features/auth/SignInScreen.tsx](../src/features/auth/SignInScreen.tsx)
- **Shows:** Email, password, Sign in button, "Forgot password?" link, "Create one" link.
- **Actions:** Sign in (stub accepts any `*@*` email + ≥6 chars). → Forgot or SignUp.
- **Stubbed:** No real auth. No error messages tied to backend.

#### SignUp
- **File:** [src/features/auth/SignUpScreen.tsx](../src/features/auth/SignUpScreen.tsx)
- **Shows:** Full name, email, password, Create account button, "Sign in" link.
- **Actions:** Create account (stub) → AppTabs[Home]. → SignIn.
- **Stubbed:** Same caveats as SignIn.

#### ForgotPassword
- **File:** [src/features/auth/ForgotPasswordScreen.tsx](../src/features/auth/ForgotPasswordScreen.tsx)
- **Shows:** Email field, Send reset link, Back to sign in. After submit: success card.
- **Actions:** Submit triggers stub success state. → Back to SignIn.
- **Stubbed:** No email actually sent.

### Home tab

#### Home (tab root)
- **File:** [src/features/home/HomeScreen.tsx](../src/features/home/HomeScreen.tsx)
- **Shows:** "Hi, {firstName}" greeting, 3 announcement cards, "See all services" button.
- **Actions:** Tap "See all services" → Services.
- **Stubbed:** Greeting uses email-prefix as name when SignIn is used (form parses); SignUp uses the real entered name.
- **Mock data:** [mockAnnouncements.ts](../src/features/home/mockAnnouncements.ts)

#### Services
- **File:** [src/features/services/ServicesScreen.tsx](../src/features/services/ServicesScreen.tsx)
- **Shows:** Card per service with name, description, duration, starting price (PHP).
- **Actions:** Read only.
- **Mock data:** [mockServices.ts](../src/features/services/mockServices.ts)

### Locations tab

#### LocationsList (tab root)
- **File:** [src/features/locations/LocationsScreen.tsx](../src/features/locations/LocationsScreen.tsx)
- **Shows:** Card per branch (name, address, first 3 features).
- **Actions:** Tap a card → LocationDetail.
- **Mock data:** [mockLocations.ts](../src/features/locations/mockLocations.ts) — 3 branches (BGC, Makati, QC).

#### LocationDetail
- **File:** [src/features/locations/LocationDetailScreen.tsx](../src/features/locations/LocationDetailScreen.tsx)
- **Shows:** Name, address, phone, Call + Get-directions buttons, opening hours table, available services list.
- **Actions:** Call → `tel:` deep link. Get directions → `https://www.google.com/maps/search/?api=1&query=...`.
- **Stubbed:** No in-app map. Hours are static (no "open now" computation).

### Membership tab

#### MembershipInfo (tab root)
- **File:** [src/features/membership/MembershipInfoScreen.tsx](../src/features/membership/MembershipInfoScreen.tsx)
- **Shows:** "Coming soon" hero, planned-benefits card, "Notify me" button (or confirmation if tapped).
- **Actions:** "Notify me" flips local state only.
- **Stubbed:** Nothing written anywhere yet.

### Account tab

#### AccountHome (tab root)
- **File:** [src/features/account/AccountScreen.tsx](../src/features/account/AccountScreen.tsx)
- **Shows:** Profile card (name + email), Information section (FAQs, Contact support), Legal section (Privacy, Terms), Account section (Sign out, Delete account), version footer.
- **Actions:** Navigate to each subsection. Sign out (with confirm) → back to AuthStack. Delete account → placeholder alert.
- **Stubbed:** Profile is whatever the stub auth captured. Delete account is alert-only (real flow comes with Supabase + store-compliance review).

#### Faqs
- **File:** [src/features/faqs/FaqsScreen.tsx](../src/features/faqs/FaqsScreen.tsx)
- **Shows:** Accordion list. Tap a question to expand the answer.
- **Mock data:** [mockFaqs.ts](../src/features/faqs/mockFaqs.ts) — 5 questions.

#### Support
- **File:** [src/features/support/SupportScreen.tsx](../src/features/support/SupportScreen.tsx)
- **Shows:** Hero copy, support email card (`support@bidawash.com`), "Email support" button.
- **Actions:** Tap → opens email client with pre-filled subject.
- **Stubbed:** No in-app message form. Backend support table comes in Phase 2 backend pass.

#### Privacy
- **File:** [src/features/legal/PrivacyScreen.tsx](../src/features/legal/PrivacyScreen.tsx)
- **Shows:** Placeholder summary + "View full policy" button.
- **Actions:** Tap → in-app browser to `https://bidawash.com/privacy`.
- **Stubbed:** Summary is placeholder copy. Live URL not yet hosted.

#### Terms
- **File:** [src/features/legal/TermsScreen.tsx](../src/features/legal/TermsScreen.tsx)
- **Shows:** Placeholder summary + "View full terms" button.
- **Actions:** Tap → in-app browser to `https://bidawash.com/terms`.
- **Stubbed:** Same as Privacy.

---

## State: stubbed vs real

| Behavior                                  | Today                              | Becomes real when                                  |
|-------------------------------------------|-------------------------------------|----------------------------------------------------|
| Auth (sign in / sign up)                  | In-memory; resets on reload        | Supabase auth wired                                |
| Auth persistence across launches          | None                                | AsyncStorage + Supabase session                    |
| Forgot password                           | Stub success message                | Supabase + email template                          |
| Onboarding "seen" flag                    | Always shown                       | AsyncStorage flag                                  |
| User profile data                         | Email/name from form input         | Supabase `users` table                             |
| Account deletion                          | Alert placeholder                   | Supabase + Apple/Google compliance flow            |
| Locations data                            | Mock TS file (3 branches)           | Supabase `locations` table (read with RLS)         |
| Services data                             | Mock TS file (5 services)           | Supabase `services` table                          |
| FAQs data                                 | Mock TS file (5 questions)          | Supabase `faqs` table                              |
| Announcements                             | Mock TS file (3 items)              | Supabase `announcements` table                     |
| Membership "Notify me"                    | Local state only                    | Supabase `membership_interest` table               |
| Contact support                           | Opens email client                  | Supabase `support_messages` table + in-app form    |
| Push notifications                        | None                                | Expo push + Supabase `device_tokens` table         |
| In-app map for Locations                  | External Google Maps link           | `react-native-maps` + Google Maps API key          |
| Privacy / Terms content                   | Placeholder text + link              | Hosted policy/terms pages                          |
| Sentry crash reporting                    | Disabled in dev                     | Already wired; activates in production builds      |
| QR / wash passes / payments               | Not built                          | Phase 3                                            |

---

## Mock data sources

| File                                                                                       | Consumed by                          |
|--------------------------------------------------------------------------------------------|---------------------------------------|
| [src/features/locations/mockLocations.ts](../src/features/locations/mockLocations.ts)     | LocationsList, LocationDetail         |
| [src/features/services/mockServices.ts](../src/features/services/mockServices.ts)         | Services                              |
| [src/features/faqs/mockFaqs.ts](../src/features/faqs/mockFaqs.ts)                          | Faqs                                  |
| [src/features/home/mockAnnouncements.ts](../src/features/home/mockAnnouncements.ts)       | Home                                  |

When Supabase lands, each mock file is replaced by a typed query in
`src/api/`. The shape of the exported types should not need to change.

---

## Open product questions

Things we haven't decided yet — flag here so they don't get lost.

- **Onboarding skip-after-first-run** — assumed yes, not implemented.
- **Social login** — currently email/password only. Adding Apple Sign-In triggers Apple's "if you offer any other social login" requirement.
- **Map view for Locations** — list-only today. Adding a real map needs a Google Maps API key (cost: usually $0 within the free tier).
- **FAQ depth** — 5 placeholder questions. Need real product input on common customer questions.
- **Membership tab when memberships aren't live** — landing page only today, with "Notify me" stub. Could also offer a waitlist form.
- **Service catalog** — informational only today. Phase 3 question: does it become a "tap to buy" flow, or do we keep purchase on the Membership tab?
- **Reviewer test account** — both stores need a permanent demo account before submission. Decision: `reviewer@bidawash.com` (see [STORE-SUBMISSION.md](./STORE-SUBMISSION.md)).
- **In-app support form vs. mailto** — mailto today. Phase 2 backend pass can add a Supabase-backed form if we want a record of tickets.

---

## Changelog

| Date       | Change                                                                                |
|------------|----------------------------------------------------------------------------------------|
| 2026-05-20 | Initial app-surface doc covering Phase 2 placeholder navigation, screens, and flows.  |
