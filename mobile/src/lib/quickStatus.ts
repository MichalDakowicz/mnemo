// Status changes made straight from a Library card. Radar's Library has none (a tap opens the
// edit screen), so this reuses the exact flag helpers its StatusPicker + save path use and
// writes the same row shape. Films only for "watched": a series is finished by ticking its
// episodes, which is the detail screen's job.

import { setToInProgress, setToWatched, setToWatchlist } from '@/lib/movieStatus';
import { logWatch, normalizeWatchDates } from '@/lib/watchDates';
import type { Movie } from '@/types/movie';

export type QuickStatus = 'watchlist' | 'watching' | 'watched';

export function quickStatusOptions(movie: Pick<Movie, 'type'>): QuickStatus[] {
  return movie.type === 'tv' ? ['watchlist', 'watching'] : ['watchlist', 'watching', 'watched'];
}

export const QUICK_STATUS_LABEL: Record<QuickStatus, string> = {
  watchlist: 'Watchlist',
  watching: 'Watching',
  watched: 'Mark watched',
};

export function quickStatusUpdate(movie: Movie, target: QuickStatus, nowIso = new Date().toISOString()): Partial<Movie> {
  if (target === 'watchlist') return setToWatchlist(movie);
  if (target === 'watching') return setToInProgress(movie);
  if (movie.watched) {
    // Already seen: just clear the watchlist / in-progress flag, never re-date a past watch.
    return { inWatchlist: false, inProgress: false, status: 'Completed' };
  }
  const watchDates = logWatch(normalizeWatchDates(movie.watchDates, movie.completedAt), nowIso);
  // "Mark watched" is a finish: leave the watchlist (setToWatched alone would keep the flag, the
  // rewatch case, which a card reaches through its Watchlist option on a watched title).
  return { ...setToWatched({ ...movie, inWatchlist: false }, 1), completedAt: nowIso, watchDates };
}
