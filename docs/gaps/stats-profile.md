# Gaps: Stats + Profile

Where `Stats.dc.html` / `Profile.dc.html` do not cover what Radar does. Format: missing in design / what Radar does / stopgap built.

## Stats

- **Friend variant (`?user=<id>`)**: design has none / Radar shows a friend's stats from their public shelf / same page and layout, title line "<name>'s stats", reads `usePublicMovies`, a private shelf (`can_view_user` false) shows a plain empty state. Streak goals are Radar defaults (2 films, 5 episodes), because `user_settings` is owner-only; the legend says so.
- **Period set**: design has two years + All time / Radar has All time, 30 days, 90 days, This year / chips: this year, last year, 30 days, 90 days, All time. Streaks and calendars always read the whole library (the grid is 53 weeks whatever the period); everything else is scoped with `scopeMoviesToPeriod`.
- **Streak unit**: design reads "6 wk" / "3-week streak" / / Radar streaks are consecutive days under a weekly threshold / shown in days ("6 days", "best 11"). The design's week wording would be a behaviour change.
- **Dropped status**: design lists Watched / Watching / Watchlist / Dropped / Radar has no Dropped status (Completed, Watching, Watchlist) / only the three Radar statuses are drawn; "Completed" is relabelled "Watched". Counts overlap (a rewatch is watched and on the watchlist) exactly as Radar's.
- **"You rate a little above TMDB" note, "+N on last year" note**: design copy is a fictional comparison / Radar has neither / avg-rating note says "Out of 5"; titles-watched note compares with the previous calendar year only on year chips.
- **Recent activity rail (Radar's HistoryPill row)**: not in design / Radar shows the last activity events as pills that open Edit / a plain list "Recent activity" (verb + title + when) at the foot of the page, non-interactive.
- **Hall of Fame sort, Top actors, Top genre / completion-rate tiles, tap-through to Library facets or to manage-completions**: not in design / Radar has an actor ranking, a completion %, quick-stat taps that open Library filtered, and calendar day taps that open the completion manager / not built. `computeStats` still returns `topActors` and `completionRate`, ready to wire in.
- **Directors "See all" link**: design links to Discover / no list page exists / link omitted; each director opens `/person/<id>`.

## Profile

- **Ranked years page** (`radar/src/app/ranked`): design's card and "All years" tile link to `#` / Radar has a full ranked-year screen with every entry / card shows the top 6 of the selected year; "All years" toggles a row of year chips that switch the card. No full list, no reorder.
- **Random pick spin**: design shows the result card only / Radar spins a poster reel (`RandomPickSheet`) / instant pick, "Another" redraws and avoids repeating the same title. Scopes are "On my services" (needs owned services set in Settings, button is disabled with a tooltip otherwise) and "Whole watchlist".
- **Favourites editor sheet**: design edits inline with a picker grid / Radar has a reorder-capable bottom sheet / inline picker only; every pin or unpin saves immediately to `profiles.favorites`. No drag reordering (`moveFavorite` exists in `lib/favorites`, not wired).
- **Edit profile errors and photo removal**: design shows no validation or error state, no remove-photo / Radar validates username (lowercase letters, digits, underscore; unique) / inline error line under the form; extra "Remove" button next to "Upload photo".
- **Header backdrop**: design uses generated art / Radar uses a title backdrop / uses the first favourite's poster blurred, generated art when there are none.
- **Share**: design shows a "Share" pill / Radar shares the shelf link via the system sheet / copies `<origin>/u/<userId>` to the clipboard ("Link copied").
- **Recap** (`radar/src/features/recap`): not in the design / large wrapped-style feature / not ported.
- **Stats triple in header**: design shows three unnamed numbers / mapped to films watched, finished this year, average rating (`shelfStats`, as Radar's shelf header).
