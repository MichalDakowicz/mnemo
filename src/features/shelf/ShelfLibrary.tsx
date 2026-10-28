import { useMemo, useState } from 'react';

import { isActivelyWatching } from '@/lib/movieStatus';
import type { Movie } from '@/types/movie';

import { PosterRail } from './PosterRail';

type Filter = 'all' | 'watched' | 'watching' | 'watchlist';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'watched', label: 'Watched' },
  { key: 'watching', label: 'Watching' },
  { key: 'watchlist', label: 'Watchlist' },
];

function matches(movie: Movie, filter: Filter): boolean {
  if (filter === 'watched') return movie.watched;
  if (filter === 'watching') return isActivelyWatching(movie);
  if (filter === 'watchlist') return movie.inWatchlist;
  return true;
}

/** Their whole library, read-only, filtered by what state each title is in. */
export function ShelfLibrary({ movies }: { movies: Movie[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const items = useMemo(
    () =>
      movies
        .filter((m) => matches(m, filter))
        .map((m) => ({ key: m.id, title: m.title, coverUrl: m.coverUrl, tmdbId: m.tmdbId, type: m.type })),
    [movies, filter],
  );
  return (
    <>
      <div className="feed-filters" role="group" aria-label="Filter library">
        {FILTERS.map((f) => (
          <button key={f.key} type="button" className="chip" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      {items.length === 0 ? <p className="empty">Nothing in this view.</p> : <PosterRail title="Library" meta={`${items.length} titles`} items={items} grid />}
    </>
  );
}
