# Design gaps — where the Mnemo design does not cover the app

The canvas "Mnemo Web" has eight artboards: Library, Title page, Discover, Stats, Friends, Profile,
Settings, Person. Wherever Radar does something those boards do not show, nothing was guessed at
length: a minimal version was built from the same tokens and listed here so you can decide.
Per-area detail (missing in design / what Radar does / stopgap built) is in `docs/gaps/`.

No database change was made for any of this. Mnemo reads and writes Radar's live Supabase project as it is.

## 1. Screens with no artboard at all

| Screen | Built as | Detail |
| --- | --- | --- |
| Sign in | Glass card: Google + email/password | below |
| Friend's shelf `/u/:id` | Header, favourites, rails, compare taste, watch together, library grid, their friends | [friends-settings](gaps/friends-settings.md) |
| Genre page `/genre/:id` | Person-style grid, "Show more" | [title](gaps/title.md) |
| Studio page `/studio/:id` | Same grid, studio logo | [title](gaps/title.md) |
| Genre view inside Discover | In-place grid, no route, no Back | [discover](gaps/discover.md) |
| Private-shelf / empty / error / loading states | Honest variants in the same style | all |
| Title not in your library | "Add to watchlist" in place of the status pill | [title](gaps/title.md) |
| Friend's Stats (`/stats?user=<id>`) | Same page, their data | [stats-profile](gaps/stats-profile.md) |

**Sign in.** The design has no signed-out state. Built: Google (needs the hosting URL on Supabase's
redirect allowlist) and email/password (works as soon as the account has a password). Decide the look.

## 2. Controls and panels the boards imply but never draw

- **Library:** filters panel, sort menu with direction, grid sizes, quick status menu on a card, random pick result, add control (the board has none), list-view layout.
- **Title:** save behaviour (built as autosave), watches panel (times watched, undated, last position), rewatch season, per-episode watch count, remove with confirm, friends' ratings, similar titles, back button.
- **Discover:** reroll (seed), "See all" destination, confirm before removing a title with history, add toast.
- **Stats:** period set differs from Radar; streak unit (design says weeks, Radar counts days); friend variant.
- **Profile:** edit validation and photo remove, ranked-years full page, favourites reorder, random pick spin.
- **Friends:** search results, activity filters, "N new updates", reactions and comments, remove friend.
- **Settings:** several rows drawn that nothing can store (below).

## 3. Drawn in the design, not buildable without a database change

These stay unbuilt because you said no database changes. Each needs a column, RPC or policy.

- **Dropped status** (Library chips, Title menu, Stats breakdown). Radar has no such state. Needs a new value or flag.
- **Delete account** (Settings). No RPC in Radar's schema.
- **Share activity with friends** (Settings). No column. Sharing follows shelf visibility today.
- **"Only me" still shares activity** (Friends copy). Radar's access rule hides activity along with the shelf, so the note text states the real behaviour.
- **Public shelf link for signed-out visitors.** The app sits behind sign-in. Anyone-with-the-link saves and copies but only opens for signed-in people. Needs a public route in the shell (policies already allow `anon` reads for public shelves).

## 4. Drawn, but needs an app-level decision (no schema involved)

- Settings: Coming soon toggle, card layout and size, Motion (System/On/Off), Film grain. Only a local preference is needed; not wired to avoid touching shared files.
- Help `?` button ("About and sync status") has no defined content.
- Shelf link shows `/u/<userId>`; the design shows `/u/<username>`.
- TMDB logo asset and attribution wording are text only.
- Radar features with no board and not ported: Recap (monthly/yearly), notifications and quiet hours, duplicate cleanup, manage-completions screens, manual add for titles TMDB lacks, Smart-fill / "Fix match".

## 5. Platform

- Web and desktop only. Mobile is a separate React Native app later; the Expo scaffold is at git tag `expo-scaffold`.
- Google sign-in does not complete inside the Electron window (the Google page opens in the system browser). Use email there until a desktop auth flow is designed.
