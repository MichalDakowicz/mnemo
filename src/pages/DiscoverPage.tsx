import '@/features/discover/discover.css';
import { DiscoverFeed } from '@/features/discover/DiscoverFeed';
import { DiscoverHero } from '@/features/discover/DiscoverHero';
import { GenreView } from '@/features/discover/GenreView';
import { SearchBar } from '@/features/discover/SearchBar';
import { SearchResults } from '@/features/discover/SearchResults';
import { useDiscoverPage } from '@/features/discover/useDiscoverPage';

// Discover: trending reel, universal search, release and leaving calendars, discovery rows.
export function DiscoverPage() {
  const page = useDiscoverPage();
  const { search } = page;

  const summary = search.active
    ? search.loading
      ? 'Searching TMDB…'
      : `${search.all.filter((r) => r.resultType === 'movie' || r.resultType === 'tv').length} titles · ${search.all.filter((r) => r.resultType === 'person').length} people on TMDB`
    : 'Search TMDB, then add anything straight to your watchlist';

  return (
    <div className="discover">
      <DiscoverHero type={page.kind} actions={page.actions} />
      <SearchBar inputRef={search.inputRef} query={search.query} onQuery={search.setQuery} kind={page.kind} onKind={page.setKind} />
      <p className="search-summary">
        <span role="status">{summary}</span>
        {!search.active && !page.genre ? (
          <button type="button" className="text-button" style={{ marginLeft: 8 }} onClick={page.reshuffle}>
            Shuffle rows
          </button>
        ) : null}
      </p>

      {search.active ? (
        <SearchResults
          results={search.results}
          filter={search.filter}
          onFilter={search.setFilter}
          loading={search.loading}
          error={search.error}
          actions={page.actions}
          onOpenGenre={page.openGenre}
        />
      ) : page.genre ? (
        <GenreView type={page.kind} genre={page.genre} actions={page.actions} onBack={page.closeGenre} />
      ) : (
        <DiscoverFeed page={page} />
      )}

      {page.actions.message ? (
        <div className="toast glass" role="status">
          {page.actions.message}
        </div>
      ) : null}
    </div>
  );
}
