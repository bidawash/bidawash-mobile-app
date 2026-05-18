# Contributing

Conventions for working in the BidaWash mobile app repo.

## Branches

Format: `MM-DD-YYYY/short-slug`

Examples:

```
05-17-2026/phase-1-scaffold
05-18-2026/locations-screen
05-22-2026/fix-auth-token-refresh
```

- Use the date the branch is created (not the merge date).
- Slugs are lowercase, kebab-case, descriptive.
- One concern per branch; keep PRs small.

## Commits

Conventional Commits (enforced by commitlint on commit-msg hook).

Format:

```
<type>(<optional scope>): <subject>

<optional body>

<optional footer>
```

Allowed types:

| Type       | Use for                                             |
|------------|------------------------------------------------------|
| `feat`     | New user-facing functionality                        |
| `fix`      | Bug fix                                              |
| `chore`    | Tooling, config, dependencies, build                 |
| `docs`     | Documentation only                                   |
| `refactor` | Code change with no behavior change                  |
| `test`     | Adding or updating tests                             |
| `style`    | Formatting only (no code change)                     |
| `perf`     | Performance improvement                              |
| `ci`       | CI configuration                                     |
| `build`    | Build system / external dependencies                 |
| `revert`   | Reverting a previous commit                          |

Examples:

```
feat(locations): add map view with branch pins
fix(auth): refresh access token before Supabase calls
chore: bump expo to SDK 53
docs: add STORE-SUBMISSION checklist
```

Subject lines:

- Imperative mood ("add", not "added" or "adds").
- No trailing period.
- ≤ 72 characters.

## Pull requests

- Reference any related Linear/issue tracker ticket in the description.
- Include a short test plan (what you manually verified).
- Screenshots for UI changes (light + dark if applicable).
- Keep PRs focused — one type of change per PR.

## Local setup

```bash
npm install            # installs deps + sets up Husky
npm run start          # Expo dev server
npm run ios            # iOS simulator (requires Xcode)
npm run android        # Android emulator (requires Android Studio)
npm run lint           # ESLint
npm run typecheck      # TypeScript
```

### Environment variables

Copy `.env.example` to `.env` and fill in values. **Never commit `.env`.**

Values are loaded via `app.config.ts` and exposed to the app through
`expo-constants`. See [src/lib/env.ts](src/lib/env.ts) for the typed
accessor.

## Code style

- TypeScript strict mode is on. No `any` without a `// TODO` and a reason.
- Functional components + hooks. No class components.
- Co-locate feature code in `src/features/<feature>/`.
- Shared UI in `src/components/`. Resist premature abstraction — copy twice,
  abstract on the third use.
- Use the absolute import alias: `import { something } from '@/lib/env'`.
- Comments are for the WHY, not the WHAT. Prefer well-named identifiers
  over comments.
