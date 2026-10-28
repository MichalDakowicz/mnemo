# Gaps: title detail, edit, person, genre, studio

Each bullet: missing in design / what Radar does / the stopgap built. No database change was made for any of them.

## Title page (Detail.dc.html)

- **Dropped status.** Design menu has Watchlist, Watching, Completed, Dropped. Radar has no dropped state (three flags: watchlist, in progress, watched). Stopgap: menu offers the three Radar states; Dropped is not offered because it cannot be stored without a schema change.
- **Status model.** Design is one radio. Radar stores three independent flags plus a count. Stopgap: the radio maps onto the flags with Radar's own helpers (setToWatchlist, setToInProgress, setToWatched). Picking Completed clears the watchlist flag; picking Watchlist on a watched title keeps it watched (Radar's "want to rewatch").
- **Save button.** Design has none; Radar saves with a button. Stopgap: every change autosaves 700ms later using Radar's buildMoviePayload, and again when leaving the page. A film left with no status is never deleted by autosave (Radar's Save would delete it); removal is only the confirmed Remove button. Saves are silent in the activity feed unless status flags or the overall rating changed, so edits do not flood friends' feeds with "updated".
- **Times watched, undated watches, last watched position.** Design has no place for them; Radar's StatusPicker has a watched stepper, "Watched before, no date" stepper and a last-position field. Stopgap: a small "Your watches" panel with those controls. Film "Log another watch" button in the hero adds a dated watch.
- **Watch dates per film.** Radar writes them (watch_dates) but shows no list. Not listed here either.
- **Rewatch season.** Not in design. Radar has it with a confirm. Stopgap: a text button beside "Mark season watched" and a confirm dialog.
- **Per-episode watch count stepper.** Not in design. Radar shows a minus/plus on a watched episode. Stopgap: a small stepper next to the air date.
- **Episode thumbnails and runtimes.** Design shows stills and "46m". The season cache Radar built keeps only number, name, air date and overview. Stopgap: generated art per episode (hue from the name) with the S/E code, and the air date in place of the runtime.
- **Film layout.** Design shows only a series. For films the Episodes panel is not shown and the ratings drawer shows the four category ticks (Radar's movie ratings) without season chips.
- **Title not in the library.** Design only shows an owned series. Stopgap: primary button is "Add to watchlist"; status pill, ratings drawer, notes, watches panel are hidden; the episode list is read-only (no check buttons).
- **Friends rating and panel.** Radar's title screen has none. Built from existing tables: friends' rows for the same tmdb_id and type (RLS decides which shelves are readable). Panel and average are hidden when no friend has the title.
- **"Wrong title? Fix match".** Radar has Smart-fill (re-pull from TMDB / search by title). Not built here. Radar's "Refresh details from TMDB" has no button yet.
- **"Full cast and crew" link.** No page exists in design or Radar; omitted. Cast shows the 20 billed performers Radar stores; crew appears in Production facts.
- **Cast episode counts** ("10 episodes") need aggregate-credit data Radar does not store; omitted.
- **Network and "Filmed in".** Network comes from TMDB. TMDB has no filming locations; the fact is shown as "Made in" (production countries).
- **Streaming availability.** Radar shows service badges; the design has none. Stopgap: a "Streaming (US)" fact in Details.
- **Similar titles.** Radar has a Similar row; design has none. Stopgap: a panel with a poster row, "In your library" flagged.
- **Backdrop.** Design shows a placeholder. Uses the TMDB backdrop, else the generated v3 cover with the title as a watermark.
- **Back button.** Design has one before the dock; AppShell has none. Stopgap: a floating glass back button under the dock (history back, else Library).
- **Manual titles (no TMDB id).** Radar opens them at /edit/<rowId>. The route here is by TMDB id, so a manual title cannot be opened; they still show in the library.
- **Library not yet loaded.** The page waits for the library before offering "Add", so an owned title is not shown as new.

## Person page (Person.dc.html)

- **Kicker** ("Director · Writer · Creator") is built from the departments TMDB lists credits in (Directing, Writing...), not from job titles.
- **Add button.** Design toggles add/remove locally. Real version only adds to the watchlist (title then shows its status badge); removing is done on the title page.
- **Radar's actor/director pages** showed only films, paginated, with no filmography filters. The artboard's department, show and sort filters are built over TMDB combined credits (films and series), with talk/news/reality "self" appearances hidden.
- **IMDb and TMDB logos.** Design uses a TMDB logo image; text pills are used instead.

## Genre and studio pages

- **No artboard exists.** Radar has /genre/<id> and /studio/<id> (films, best rated first, 20 per page, infinite scroll). Built as /genre/:id and /studio/:id with the page-head tokens and the person-page card grid, a "Show more" button instead of infinite scroll, and the library badge and add button on each card. Studio shows its logo. Two route lines were added to src/app/App.tsx.
- Genre and studio links appear on the title page (genre names in the meta line, production companies in Production).
