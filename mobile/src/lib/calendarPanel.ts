import { dayKey, monthCells, type MonthCursor } from '@/lib/calendarGrid';
import { leavingMeta, releaseMeta, type CalendarEvent } from '@/lib/calendarEvents';
import type { LeavingTitle } from '@/lib/leaving';
import { toDiscoveryMovie, type DiscoverItem } from '@/lib/toDiscoveryMovie';
import type { MediaType } from '@/types/movie';

export const LEAVING_WARNING = 'On your watchlist, so watch it before it goes';

const FULL_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Release-calendar lines: only titles with a full release date can sit on a day. */
export function releaseEvents(items: DiscoverItem[]): CalendarEvent[] {
  return items
    .filter((i) => i.releaseDate && FULL_DATE.test(i.releaseDate))
    .map((i) => ({
      id: `release-${i.type}-${i.tmdbId}`,
      day: i.releaseDate as string,
      movie: toDiscoveryMovie(i),
      meta: releaseMeta(i.type),
    }));
}

/** Leaving-soon lines for one media type; titles on the viewer's watchlist carry the warning. */
export function leavingEvents(titles: LeavingTitle[], type: MediaType): CalendarEvent[] {
  return titles
    .filter((t) => t.mediaType === type)
    .map((t) => ({
      id: `leaving-${t.mediaType}-${t.tmdbId}`,
      day: t.expiresOn,
      movie: toDiscoveryMovie({
        tmdbId: t.tmdbId,
        type: t.mediaType,
        title: t.title,
        releaseDate: t.releaseYear ? String(t.releaseYear) : null,
        coverUrl: t.posterUrl,
        voteAverage: 0,
        overview: '',
        genres: [],
      }),
      meta: leavingMeta(t.services, t.daysLeft),
      warning: t.movieId && !t.watched ? LEAVING_WARNING : undefined,
    }));
}

export type DayCell = { day: number; key: string; events: CalendarEvent[]; past: boolean; today: boolean };

/** The month's Monday-first grid; null is a blank pad cell. */
export function buildCells(cursor: MonthCursor, byDay: Map<string, CalendarEvent[]>, today: string): (DayCell | null)[] {
  return monthCells(cursor).map((day) => {
    if (day == null) return null;
    const key = dayKey(cursor, day);
    return { day, key, events: byDay.get(key) ?? [], past: key < today, today: key === today };
  });
}
