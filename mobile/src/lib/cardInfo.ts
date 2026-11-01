// Pure facts a Library card shows, kept out of the components so they can be tested.

import { getStatusIcon, isActivelyWatching, watchProgressPercent, type StatusIcon } from '@/lib/movieStatus';
import { personalScore } from '@/lib/personalScore';
import { directorToDisplayString } from '@/lib/utils';
import type { Movie } from '@/types/movie';

export function cardYear(movie: Pick<Movie, 'releaseDate'>): string {
  const y = movie.releaseDate?.slice(0, 4) ?? '';
  return /^\d{4}$/.test(y) ? y : '';
}

export function kindTag(movie: Pick<Movie, 'type'>): string {
  return movie.type === 'tv' ? 'SERIES' : 'FILM';
}

/** The user's own score (overall, else the average of the category scores) on Radar's 0-5 scale; 0 when none. */
export function userRating(movie: Pick<Movie, 'ratings'>): number {
  return personalScore(movie.ratings) ?? 0;
}

export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} m`;
  return m === 0 ? `${h} h` : `${h} h ${m} m`;
}

/** "2024 · Drama · ★ 4.5" - year, then genre (or episode progress when mid-series), then the user's rating. */
export function cardMeta(movie: Movie): string {
  const parts: string[] = [];
  const year = cardYear(movie);
  if (year) parts.push(year);
  if (movie.type === 'tv' && isActivelyWatching(movie) && movie.numberOfEpisodes) {
    const pct = watchProgressPercent(movie);
    parts.push(`${Math.round((pct / 100) * movie.numberOfEpisodes)} of ${movie.numberOfEpisodes} eps`);
  } else {
    const genre = movie.genres?.[0]?.name;
    if (genre) parts.push(genre);
  }
  const rating = userRating(movie);
  if (rating) parts.push(`★ ${Number.isInteger(rating) ? rating : rating.toFixed(1)}`);
  return parts.join(' · ');
}

export function cardSubtitleLine(movie: Movie): string {
  return [directorToDisplayString(movie.director), cardYear(movie), formatRuntime(movie.runtime)].filter(Boolean).join(' · ');
}

export type CardStatus = StatusIcon | 'rewatch';

export function cardStatus(movie: Movie): CardStatus {
  const icon = getStatusIcon(movie);
  return icon === 'watchlist' && movie.watched ? 'rewatch' : icon;
}

export const STATUS_LABEL: Record<CardStatus, string> = {
  watching: 'Watching',
  watchlist: 'Watchlist',
  completed: 'Completed',
  rewatch: 'Rewatch',
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** "NOV 14" for the Coming soon badge; a bare year (TMDB sometimes has only that) stays a year. */
export function releaseBadge(releaseDate: string | null | undefined): string {
  if (!releaseDate) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(releaseDate);
  if (!m) return /^\d{4}$/.test(releaseDate) ? releaseDate : '';
  return `${MONTHS[Number(m[2]) - 1] ?? ''} ${Number(m[3])}`;
}

/** First unwatched episode of a series as [season, episode], or null when done / unknown. */
export function nextEpisode(movie: Pick<Movie, 'seasonEpisodeCounts' | 'numberOfEpisodes' | 'episodesWatched' | 'episodeWatchDates'>): [number, number] | null {
  const watched = new Set(Object.keys(movie.episodeWatchDates ?? {}).concat(Object.keys(movie.episodesWatched ?? {}).filter((k) => movie.episodesWatched[k])));
  const counts = Object.entries(movie.seasonEpisodeCounts ?? {})
    .map(([s, n]) => [Number(s), Number(n)] as const)
    .filter(([s, n]) => s > 0 && n > 0)
    .sort((a, b) => a[0] - b[0]);
  const seasons = counts.length > 0 ? counts : movie.numberOfEpisodes ? [[1, movie.numberOfEpisodes] as const] : [];
  for (const [s, n] of seasons) {
    for (let e = 1; e <= n; e++) if (!watched.has(`s${s}e${e}`)) return [s, e];
  }
  return null;
}
