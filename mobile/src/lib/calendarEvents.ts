import type { Movie } from '@/types/movie';

/** One dated line on a Discover calendar: a release or a title leaving a service. */
export type CalendarEvent = {
  id: string;
  /** YYYY-MM-DD */
  day: string;
  movie: Movie;
  meta: string;
  /** Set when the title is on the viewer's watchlist and leaving soon. */
  warning?: string;
};

export const libraryKey = (tmdbId: number | null | undefined, type: string) => `${type}:${tmdbId ?? 0}`;

export function groupByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const list = map.get(e.day) ?? [];
    list.push(e);
    map.set(e.day, list);
  }
  return map;
}

/** "On my watchlist": keep only titles whose `type:tmdbId` is in the library. */
export function onlyMine(events: CalendarEvent[], mine: Set<string>): CalendarEvent[] {
  return events.filter((e) => mine.has(libraryKey(e.movie.tmdbId, e.movie.type)));
}

export function releaseMeta(type: 'movie' | 'tv'): string {
  return type === 'movie' ? 'Film · in cinemas' : 'Series premiere';
}

export function leavingMeta(services: string[], daysLeft: number): string {
  const left = daysLeft <= 0 ? 'last day' : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`;
  return `Leaves ${services.join(', ')} · ${left}`;
}
