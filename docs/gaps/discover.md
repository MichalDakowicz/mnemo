# Discover: gaps between the design and Radar

Source: `.design/project/Discover.dc.html` (artboard) against Radar's Browse, Leaving and release-calendar features.
Each bullet is: missing in design / what Radar does / the stopgap built.

- **Genre page.** Missing in design: no genre screen, though search returns genres and rows say "Explore genre". Radar: `/genre/[id]` with paginated titles. Stopgap: a genre opens in place on Discover (`GenreView`, infinite grid, "Back to Discover"). No route, so no deep link or browser Back.
- **Genres in search.** Missing in design: result chips are All / Films / Shows / People only. Radar: also Genres. Stopgap: a fifth "Genres" chip, and matching genres show as chips above the title grid that open the genre view.
- **"See all" on a row.** Missing in design: the link has no destination (it points back at Discover). Radar: rows scroll only, no see-all page. Stopgap: "See all" expands the row in place into a wrapped grid of its (up to 20) titles; "Show less" collapses it.
- **Tab for the calendar.** Radar has Movies / TV / Calendar tabs. The design puts the calendars on the page under the search. Followed the design; Films / Shows switch the reel, rows and both calendars.
- **Series seasons on the calendar.** Design shows "Season 2 premiere" lines. Radar: release calendar is theatrical films only. Stopgap: shows tab lists series premieres (TMDB `first_air_date`), so new seasons of old shows are not listed. Cinema and "on [service]" streaming labels are not available either; films are labelled "Film · in cinemas".
- **Calendar span.** Design: three months. Built: this month and the next two, one TMDB query per visible month (about 100 titles per month at most).
- **Leaving soon data.** Design shows invented services. Radar: reads `public.streaming_expirations` for the viewer's country. Built the same (read only). If the table is missing or empty the panel says "Nothing tracked for your region yet." rather than claiming nothing is leaving. The My services filter and subscription-needed hints from Radar are not shown (the design has only "On my watchlist").
- **Quick remove.** Design: the card toggle says "Remove from watchlist". Radar: tapping the added badge deletes the library row. Built: same, but a title that is watched, in progress or rated asks for `confirm()` first because removing it deletes that history. No design for a confirm dialog.
- **Add feedback.** Design has no toast. Radar shows one. Stopgap: small glass pill at the bottom of the page for a few seconds (`role="status"`).
- **Reroll.** Design has none. Radar: pull to refresh bumps the seed. Stopgap: a "Shuffle rows" text button beside the search summary; same day, same tab and same reroll give the same rows.
- **Card ratings and status.** Radar's browse cards used the library card. Design cards show only cover, title and "year · genre · kind", so no status badge or rating on Discover cards.
- **TMDB attribution logo.** Design uses an image of the TMDB logo under the reel rating. Not bundled; shows the text "TMDB". Needs the real logo asset (and its attribution wording) before release.
- **Reel without art.** Titles in trending with no poster are left out of the reel; elsewhere a generated cover is used.
- **Dock Search.** Design: `#search` anchor. Built: `/discover?focus=search` focuses and scrolls to the input; Ctrl/Cmd+K focuses it too.
