// Presentation-side derivations for the Stats page: period chips, bar widths, director averages.

import { personalScore } from '@/lib/personalScore';
import { periodStart, type StatsPeriodId } from '@/lib/statsPeriod';
import type { Movie } from '@/types/movie';

/** `all`, a rolling window, or a calendar year as `y2026`. */
export type PeriodKey = StatsPeriodId | `y${number}`;

export type PeriodOption = { key: PeriodKey; label: string };
export type ResolvedPeriod = { start: Date | null; end: Date | null; year: number | null };

/** This year, last year, All time, then the rolling windows. */
export function periodOptions(now: Date = new Date()): PeriodOption[] {
  const year = now.getFullYear();
  return [
    { key: `y${year}`, label: String(year) },
    { key: `y${year - 1}`, label: String(year - 1) },
    { key: '30d', label: '30 days' },
    { key: '90d', label: '90 days' },
    { key: 'all', label: 'All time' },
  ];
}

export function resolvePeriod(key: PeriodKey, now: Date = new Date()): ResolvedPeriod {
  if (key.startsWith('y')) {
    const year = Number(key.slice(1));
    return { start: new Date(year, 0, 1), end: new Date(year + 1, 0, 1), year };
  }
  return { start: periodStart(key as StatsPeriodId, now), end: null, year: null };
}

/** Whole days the period spans so far, or null for all time. */
export function periodDays(key: PeriodKey, now: Date = new Date()): number | null {
  if (key === 'all') return null;
  const { start, end } = resolvePeriod(key, now);
  if (!start) return null;
  const until = end && end.getTime() < now.getTime() ? end : now;
  return Math.max(1, Math.round((until.getTime() - start.getTime()) / 864e5));
}

/** "About 4 h a week", or null when the span is unknown or the number is meaningless. */
export function hoursPerWeekNote(hours: number, days: number | null): string | null {
  if (days == null || hours <= 0) return null;
  const perWeek = hours / (days / 7);
  if (!Number.isFinite(perWeek)) return null;
  return perWeek < 1 ? 'Under an hour a week' : `About ${Math.round(perWeek)} h a week`;
}

/** "+12 on 2025" / "3 fewer than 2025" / "Same as 2025". */
export function deltaNote(current: number, previous: number, label: string): string | null {
  if (previous <= 0 && current <= 0) return null;
  const diff = current - previous;
  if (diff === 0) return `Same as ${label}`;
  return diff > 0 ? `+${diff} on ${label}` : `${-diff} fewer than ${label}`;
}

/** Status names are Radar's; the design calls finished titles "Watched". */
export function statusLabel(name: string): string {
  return name === 'Completed' ? 'Watched' : name;
}

/** Bar height for a decade, floored so the smallest still shows. */
export function decadeHeight(count: number, max: number): number {
  return max <= 0 ? 0 : Math.max(4, Math.round((count / max) * 82));
}

/** Mean of your own score over the titles each named director made; names with no rated title are absent. */
export function directorAverages(movies: Movie[]): Map<string, number> {
  const sums = new Map<string, { total: number; n: number }>();
  for (const movie of movies) {
    const score = personalScore(movie.ratings);
    if (score == null || score <= 0) continue;
    for (const d of movie.director ?? []) {
      const name = d?.name?.trim();
      if (!name) continue;
      const cur = sums.get(name) ?? { total: 0, n: 0 };
      cur.total += score;
      cur.n += 1;
      sums.set(name, cur);
    }
  }
  return new Map([...sums].map(([name, { total, n }]) => [name, Math.round((total / n) * 10) / 10]));
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** "in 2026" / "in the last 30 days" for the page subtitle. */
export function periodPhrase(key: PeriodKey, label: string): string {
  if (key === '30d' || key === '90d') return `in the last ${label}`;
  return `in ${label}`;
}
