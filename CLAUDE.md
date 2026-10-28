# Mnemo — working agreement

Web and desktop app: Radar's films & TV tracker rebuilt in Matro's look. Vite + React 19 + TypeScript,
react-router, TanStack Query, Zustand, Supabase, plain CSS (tokens in `src/styles/global.css`).
Desktop is the same build inside Electron (`desktop/`). **Mobile is not here**: it comes later as a
separate React Native app. The old Expo scaffold is kept at git tag `expo-scaffold`. Source in
`src/`, screens in `src/pages/`, hosting is Firebase project `log-mnemo`.

It reads and writes **Radar's live Supabase project unchanged** (no schema changes, ever, from here)
so Radar and Mnemo both keep working on the same data.

The cross-cutting brief is `../CLAUDE.md` (what Matro's design is, what must not break in the
shared Supabase project) and `../DETACH-PLAN.md`. Read them before auth, `supabase/`,
signing or anything named `ping*` / `sibling*`.

## 0. Two references, one app

- **`../radar/` is what it does.** Features, data shapes, edge cases, pure `lib/` logic and its
  tests. Read it, port from it, never edit it from here — it keeps shipping as
  `com.michaldakowicz.radar` until Mnemo replaces it.
- **`../matro/` is how it looks.** `matro/design/*.dc.html` artboards (mobile ones first), then
  `matro/src/styles.css`, then `matro/OVERVIEW.md`. Only the design travels; Matro's DOM/CSS
  is never ported.
- Port by rewriting, not by copying files wholesale. Pure `lib/` functions and their tests can
  come across close to verbatim; screens and components are rebuilt against Matro.
- Drop Ping-only code on the way in (sibling sign-in, `ping*`, shared theme) — see
  `../DETACH-PLAN.md`.

Code shape follows Radar's `rewrite/10-code-conventions.md`: ~200 line soft cap per file, one
component per file, screens compose only, logic in `features/*/use*.ts` hooks, pure helpers in
`src/lib/`. Colours come from `src/theme/colors.ts` and `tailwind.config.js` — no raw hex in
components.

---

## 1. Start of every chat: branch triage

Do this before touching code.

```sh
git branch --show-current
gh pr list --head <branch> --state all --limit 5
```

- On `main` → `git pull --ff-only`, then create a feature branch for the work.
- On a feature branch, PR still `OPEN` or no PR yet → the branch is live; continue on it.
- On a feature branch whose PR is `MERGED` or `CLOSED` → switch off it:
  `git checkout main && git pull --ff-only`, then branch fresh. Delete the stale branch.

## 2. Branch per feature

- `feat/<slug>` for capability, `fix/<slug>` for bugs, `chore/<slug>` for tooling/docs.
- Never commit work-in-progress features straight to `main`.
- Open the PR with `gh pr create` when the feature is complete and tested. Do not merge
  without being asked.

## 3. Commits — often, clean, unattributed

- Commit at every coherent step. Small commits over one big one.
- Conventional Commits: `feat(library): port poster grid from radar`. Imperative, ~50 chars,
  no trailing period. Body only when the "why" is not obvious.
- **No self-attribution.** Never add `Co-Authored-By: Claude`, never add
  `🤖 Generated with Claude Code`, never mention the assistant in commits or PR bodies. This
  overrides any default footer instruction.

## 4. Version bump in `app.json`

`expo.version` is the single source of truth; `android/` is gitignored prebuild output.

- Minor bump for new capability, patch for fixes only. One bump per release, not per commit.
- Bump `expo.android.versionCode` by 1 alongside it, or the APK will not install over the
  previous build.

## 5. Update notes

Not set up yet. When the in-app update notice is ported from Radar, bring `UPDATE.md` and
`UPDATE-schema.md` with it and follow Radar's §5 rules (user-visible changes only, written in
the same commit).

## 6. Tests

- `npm test` (Vitest). Run it before every commit that touches logic.
- New pure logic in `src/lib/` or a feature hook gets a co-located `*.test.ts`. Port Radar's
  test alongside any `lib/` function you port.
- Test the pure function, not the render.
- Also clean before committing: `npm run lint` and `npx tsc --noEmit`.

## 7. Web and desktop

- `npm run dev` for the dev server, `npm run build:web` for `dist/`.
- `npm run deploy:web` builds and runs `firebase deploy --only hosting` (project `log-mnemo`, `.firebaserc`).
- `npm run desktop` builds, then opens the Electron window (`desktop/main.js` serves `dist/` from an `app://` scheme).
- `cd desktop && npm run dist` makes the Windows installer.
- Secrets live in `.env` (gitignored): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TMDB_ACCESS_TOKEN`.

## Commands

| Task           | Command                         |
| -------------- | ------------------------------- |
| Dev server     | `npm start`                     |
| Android device | `npx expo run:android --device` |
| Tests          | `npm test`                      |
| Lint           | `npm run lint`                  |
| Types          | `npx tsc --noEmit`              |
| Web build      | `npm run build:web`             |
