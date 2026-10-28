# Gaps: Friends, friend shelf, Settings

Format: missing in design / what Radar does / the stopgap built. No database changes were made for any of these.

## Friends (Friends.dc.html)

- **Find people / search results.** Design: only a search input, no result state. Radar: Find tab with username/display-name search and Add. Stopgap: results section above Requests, rows use the request-row styling, button becomes "Request sent" once sent.
- **Activity filters and "N new updates".** Design: a plain "Last 7 days" list. Radar: filter chips (All, Ratings, Watched, In progress, Watchlist), 60-row feed, new-update pill from realtime. Stopgap: chips reuse `.chip`, pill reuses `.pill.primary`. The list is the latest 60 events, not strictly 7 days.
- **Reactions and comments on activity.** Design: omitted. Radar: fire/eyes/heart reactions and a comment thread per activity row (`activity_reactions`, `activity_comments`). Stopgap: small reaction chips and an expandable thread under each row. Hidden automatically if those tables are missing.
- **Remove friend.** Design: friend card is a plain link. Radar: action sheet with remove. Stopgap: remove (two-step confirm) lives on the friend's shelf page header.
- **Request meta.** Design: "N titles in common" for a requester. That needs the sender's library, which RLS may hide. Stopgap: Radar's "N friends in common" (empty when none).
- **Friend card numbers.** "Sorted by recent activity" is derived from the loaded feed. A friend with a private shelf shows no posters/numbers ("Nothing shared yet").
- **"Only me" and activity.** The artboard says friends still see your activity when your shelf is private. In Radar's RLS, activity uses the same `can_view` rule as the shelf, so "Only me" hides activity too. The note text states the real behaviour.
- **"Anyone with the link" (public) for signed-out visitors.** `main.tsx` wraps everything in `AuthGate`, so a signed-out visitor cannot open `/u/<id>` yet. The value is saved and the link copied, but it only works for signed-in people until the shell allows public routes.
- **Shelf link format.** Design shows `[domain]/u/[username]`; routes are `/u/<userId>` (see `lib/shelfLink`), so the link shows the user id, not the username.
- **Help button (`?`).** Design has a floating "About and sync status" button. Not built (no content defined).

## Friend shelf (`/u/:id`)

- **No artboard.** Built from tokens only: header (avatar, name, @handle, watched / this year / avg score), friend action (Add / Accept / Friends / Remove), Favourites, Watching now, Recently finished rails, Compare taste (ring, agree / split / they-love-you-have-not-rated), Watch together (shared watchlist), full read-only library with status chips, and their friends list.
- **Private shelves.** Radar distinguishes private from empty via `can_view_user`; same here with a "This shelf is private" panel.
- Radar's separate Compare and Watch-together screens are folded into the shelf page. No dedicated "tonight's pick" or activity detail page.

## Settings (Settings.dc.html)

Built and wired: Profile (links to `/profile` for editing), Recently added (switch + days), Streaming region, Privacy visibility, Stats goals (steppers + from-now / whole-history scope, as Radar), Refresh metadata (web runner, progress, stop), Import/Export JSON, Account (email, sign out).

Not built, because nothing stores or reads them:
- **Coming soon toggle and Cards layout/size (Grid/List, Compact/Normal/Large).** No `user_settings` column and no library consumer exists yet. Needs a local-storage preference plus the Library page reading it.
- **Share activity with friends.** No such column. Radar has `notify_friend_activity` (notifications, not sharing). Sharing is governed by shelf visibility.
- **Motion (reduce motion System/On/Off) and Film grain toggle.** Needs an app-level preference applied at startup (`main.tsx`/`AppShell`); the grain element belongs to `AppShell`. Not wired to avoid editing shared files. Reduced motion is still honoured through `prefers-reduced-motion` in the CSS.
- **Edit profile fields (name, username, photo) in Settings.** The design puts them here; the brief puts editing on the Profile page, so Settings links there.
- **Delete account.** No RPC or policy exists in Radar's schema, and no schema changes are allowed. Not built.
- **Theme control.** Mnemo is dark-only; Radar's theme setting (`user_settings.theme`) is left untouched.
- **Radar-only settings not ported:** notification toggles, quiet hours, app update control, duplicate cleanup (push/native or not in the design).
- **Footer version and "Up to date".** No version/update source on the web yet; footer shows the TMDB notice only (no TMDB logo asset).
- **Refresh metadata** has no background task or resume across tabs (Radar's WorkManager/lock). A stopped or closed run leaves the rest for the next run.
- **Import** reads a JSON file only (Radar also had a paste box).
