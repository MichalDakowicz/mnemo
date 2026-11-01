import { useMemo } from 'react';

import { useMovies } from '@/hooks/useMovies';
import type { LibraryEntry } from '@/lib/personCredits';

/** `${type}:${tmdbId}` -> your status and overall rating, for flagging titles you own. */
export function useLibraryIndex(): Record<string, LibraryEntry> {
  const { movies } = useMovies();
  return useMemo(() => {
    const out: Record<string, LibraryEntry> = {};
    for (const m of movies) {
      if (!m.tmdbId) continue;
      out[`${m.type}:${m.tmdbId}`] = {
        status: m.inProgress ? 'watching' : m.inWatchlist ? 'watchlist' : 'watched',
        rating: m.ratings.overall ?? 0,
      };
    }
    return out;
  }, [movies]);
}
