// The title page's single "where are you with it" choice, mapped onto Radar's three
// independent flags (inWatchlist / inProgress / watched). Radar's rule, kept: the flags
// are what is stored; this is only a radio-shaped view of them.
import { setToInProgress, setToWatched, setToWatchlist } from '@/lib/movieStatus';
import type { QuickAddStatus } from '@/lib/titlePayload';

export type StatusKey = 'watchlist' | 'watching' | 'watched';

export const STATUS_OPTIONS: { key: StatusKey; label: string; hint: string; tvHint: string }[] = [
  { key: 'watchlist', label: 'Watchlist', hint: 'Not started', tvHint: 'Not started' },
  { key: 'watching', label: 'Watching', hint: 'In progress', tvHint: 'In progress' },
  { key: 'watched', label: 'Completed', hint: 'Watched it', tvHint: 'All episodes' },
];

/** Same priority Radar shows on a card: in progress, then watchlist, then completed. */
export function statusKeyOf(s: Pick<QuickAddStatus, 'inWatchlist' | 'inProgress' | 'watched'>): StatusKey {
  if (s.inProgress) return 'watching';
  if (s.inWatchlist) return 'watchlist';
  if (s.watched) return 'watched';
  return 'watchlist';
}

/** The status after picking `key`, carrying the watch counts across like Radar's StatusPicker. */
export function pickStatus(s: QuickAddStatus, key: StatusKey): QuickAddStatus {
  const keep = { timesWatched: s.timesWatched, undatedWatches: s.undatedWatches ?? 0 };
  if (key === 'watchlist') return { ...setToWatchlist(s), ...keep };
  if (key === 'watching') return { ...setToInProgress(s), ...keep };
  return { ...setToWatched(s, s.timesWatched || 1), inWatchlist: false, undatedWatches: keep.undatedWatches };
}

export type EpisodeLite = { episode_number: number };

/** First episode of the season with no watch logged, or null when all are watched. */
export function nextUnwatched(episodes: EpisodeLite[], counts: Record<number, number>): number | null {
  const next = episodes.find((e) => (counts[e.episode_number] ?? 0) === 0);
  return next ? next.episode_number : null;
}

export function seasonProgress(episodes: EpisodeLite[], counts: Record<number, number>) {
  const watched = episodes.filter((e) => (counts[e.episode_number] ?? 0) > 0).length;
  const pct = episodes.length ? Math.round((watched / episodes.length) * 100) : 0;
  return { watched, total: episodes.length, pct };
}

/** "3 Oct 2026" -> "3 Oct" style short day for an ISO stamp; '' when unparseable. */
export function shortDay(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

/** Whole-star text for the rating strip: 4.3 -> "4.3", 0 -> null. */
export function ratingText(value: number | undefined | null): string | null {
  return value && value > 0 ? value.toFixed(1) : null;
}

/** Average of the positive numbers, one decimal, null if none. */
export function averageRating(values: number[]): number | null {
  const ys = values.filter((v) => v > 0);
  return ys.length ? Math.round((ys.reduce((a, b) => a + b, 0) / ys.length) * 10) / 10 : null;
}
