import type { BrowseSearchResult } from '@/lib/tmdb';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';

import { DiscoverCard } from './DiscoverCard';
import { PersonChip } from './PersonChip';
import { RESULT_FILTERS, type ResultFilter } from './useBrowseSearch';
import type { CardActions } from './useCardActions';

type Props = {
  results: BrowseSearchResult[];
  filter: ResultFilter;
  onFilter: (f: ResultFilter) => void;
  loading: boolean;
  error: boolean;
  actions: CardActions;
  onOpenGenre: (genre: { id: number; name: string }) => void;
};

function toItem(r: Extract<BrowseSearchResult, { resultType: 'movie' | 'tv' }>): DiscoverItem {
  return {
    tmdbId: r.tmdbId,
    type: r.resultType,
    title: r.title,
    releaseDate: r.releaseDate,
    coverUrl: r.coverUrl,
    voteAverage: r.voteAverage,
    overview: r.overview ?? '',
    genres: [],
  };
}

/** Search results: filter chips, then people, genres and a grid of titles. */
export function SearchResults({ results, filter, onFilter, loading, error, actions, onOpenGenre }: Props) {
  const titles = results.filter((r): r is Extract<BrowseSearchResult, { resultType: 'movie' | 'tv' }> => r.resultType === 'movie' || r.resultType === 'tv');
  const people = results.filter((r): r is Extract<BrowseSearchResult, { resultType: 'person' }> => r.resultType === 'person');
  const genres = results.filter((r): r is Extract<BrowseSearchResult, { resultType: 'genre' }> => r.resultType === 'genre');
  const empty = !loading && !error && results.length === 0;

  return (
    <section className="disc-section" aria-label="Search results" style={{ marginBottom: 44 }}>
      <div className="results-chips" role="group" aria-label="Result type">
        {RESULT_FILTERS.map((f) => (
          <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => onFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      {people.length > 0 ? (
        <div className="people">
          {people.map((p) => (
            <PersonChip key={p.resultKey} id={p.personId} name={p.title} role={p.subtitle} photo={p.coverUrl} />
          ))}
        </div>
      ) : null}
      {genres.length > 0 ? (
        <div className="results-chips" role="group" aria-label="Genres" style={{ marginBottom: 28 }}>
          {genres.map((g) => (
            <button key={g.resultKey} type="button" className="chip" onClick={() => onOpenGenre({ id: g.genreId, name: g.title })}>
              {g.title}
            </button>
          ))}
        </div>
      ) : null}
      {titles.length > 0 ? (
        <div className="grid">
          {titles.map((r) => (
            <DiscoverCard key={r.resultKey} item={toItem(r)} actions={actions} />
          ))}
        </div>
      ) : null}
      {loading && results.length === 0 ? <div className="empty" role="status">Searching TMDB…</div> : null}
      {error ? (
        <div className="note" role="alert">
          <h2>Search is not working</h2>
          <p>TMDB did not answer. Check your connection and try again.</p>
        </div>
      ) : null}
      {empty ? (
        <div className="note">
          <h2>No matches on TMDB</h2>
          <p>Try the original title, or search for a person.</p>
        </div>
      ) : null}
    </section>
  );
}
