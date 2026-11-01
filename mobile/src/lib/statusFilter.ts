import { isInProgress, isInWatchlist, isRewatch, isWatched } from '@/lib/movieStatus';
import type { StatusFilter } from '@/store/libraryPrefs';
import type { Movie } from '@/types/movie';

export function matchesStatusFilter(movie: Movie, filter: StatusFilter): boolean {
  switch (filter) {
    case 'watchlist':
      return isInWatchlist(movie);
    case 'watching':
      return isInProgress(movie);
    case 'completed':
      return isWatched(movie);
    case 'rewatch':
      return isRewatch(movie);
    default:
      return true;
  }
}

export const STATUS_FILTERS: StatusFilter[] = ['all', 'watchlist', 'watching', 'completed', 'rewatch'];

/** Title count under each status chip, over whatever the other filters already narrowed to. */
export function statusCounts(movies: Movie[]): Record<StatusFilter, number> {
  const out = {} as Record<StatusFilter, number>;
  for (const f of STATUS_FILTERS) out[f] = movies.filter((m) => matchesStatusFilter(m, f)).length;
  return out;
}
