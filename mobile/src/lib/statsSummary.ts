// Small derivations the Stats and Profile pages need on top of computeStats.

import { isRewatch } from '@/lib/movieStatus';
import type { Movie } from '@/types/movie';

/** Sum of a date -> count map (episodes logged in the window). */
export function sumDaily(daily: Record<string, number>): number {
  return Object.values(daily).reduce((a, b) => a + b, 0);
}

/** Bar width as a whole percent of the largest value, with a visible floor. */
export function barPercent(value: number, max: number, floor = 0): number {
  if (max <= 0) return 0;
  return Math.max(floor, Math.round((value / max) * 100));
}

export function rewatchCount(movies: Movie[]): number {
  return movies.filter(isRewatch).length;
}

/** Titles you gave five stars (4.9/5.1 auto-calc noise excluded), most recently finished first. */
export function selectHallOfFame(movies: Movie[]): Movie[] {
  return movies
    .filter((m) => {
      const overall = m.ratings?.overall;
      return overall != null && Math.round(overall * 10) / 10 >= 5;
    })
    .sort((a, b) => {
      if (a.completedAt && b.completedAt) return b.completedAt.localeCompare(a.completedAt);
      if (a.completedAt) return -1;
      if (b.completedAt) return 1;
      return a.addedAt.localeCompare(b.addedAt);
    });
}

/** "Film · 2023" / "Series · 2021" under a poster. */
export function titleMeta(movie: Pick<Movie, 'type' | 'releaseDate'>): string {
  const kind = movie.type === 'tv' ? 'Series' : 'Film';
  const year = movie.releaseDate?.slice(0, 4);
  return year && /^\d{4}$/.test(year) ? `${kind} · ${year}` : kind;
}

/** "3 days ago" style label for a timestamp; "8 Nov" style after a week. */
export function whenLabel(stamp: string | null | undefined, now: Date = new Date()): string {
  const at = Date.parse(stamp ?? '');
  if (Number.isNaN(at)) return '';
  const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((day(now) - day(new Date(at))) / 864e5);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}
