import { CalendarPanel } from './CalendarPanel';
import { DiscoverRow } from './DiscoverRow';
import { useNearEnd } from './useNearEnd';
import type { useDiscoverPage } from './useDiscoverPage';

type Page = ReturnType<typeof useDiscoverPage>;

/** The browsing state of Discover: both calendars, then the rows with infinite loading. */
export function DiscoverFeed({ page }: { page: Page }) {
  // Mounted only while browsing, so searching or a genre view stops the loading by itself.
  const sentinel = useNearEnd(page.loadMore, page.hasMore && !page.loadingMore);
  return (
    <>
      <section className="calendars" aria-label="Release and leaving calendars">
        {page.calendars.map((panel) => (
          <CalendarPanel key={panel.which} panel={panel} actions={page.actions} />
        ))}
      </section>

      {page.feedLoading && page.rows.length === 0 ? (
        <div className="empty" role="status">
          {'Loading your discover feed…'}
        </div>
      ) : null}
      {page.feedError && page.rows.length === 0 ? (
        <div className="note" role="alert">
          <h2>Could not load the discover feed</h2>
          <p>TMDB did not answer. Check your connection and try again.</p>
          <button type="button" className="pill" style={{ marginTop: 16 }} onClick={page.reshuffle}>
            Try again
          </button>
        </div>
      ) : null}
      {page.rows.map((row) => (
        <DiscoverRow key={row.id} row={row} actions={page.actions} onOpenGenre={page.openGenre} />
      ))}
      <div className="more" ref={sentinel}>
        {page.hasMore ? (
          <button type="button" className="pill" disabled={page.loadingMore} onClick={page.loadMore}>
            {page.loadingMore ? 'Loading…' : 'Load more rows'}
          </button>
        ) : null}
      </div>
    </>
  );
}
