import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { groupByDay, onlyMine, type CalendarEvent } from '@/lib/calendarEvents';
import { MONTH_NAMES, defaultDay, longDayLabel, monthPrefix, shiftMonth, type MonthCursor } from '@/lib/calendarGrid';
import { buildCells, leavingEvents, releaseEvents } from '@/lib/calendarPanel';
import { countryName } from '@/lib/countries';
import { getMovieReleaseCalendar } from '@/lib/tmdb';
import { fetchTvPremieres } from '@/lib/tmdbDiscover';
import type { MediaType } from '@/types/movie';

import type { LeavingSoon } from './useLeavingSoon';

export type CalendarWhich = 'release' | 'leaving';

/** The calendar covers this month and the two after it, as in the design. */
export const MONTH_SPAN = 3;

type Inputs = {
  which: CalendarWhich;
  type: MediaType;
  today: string;
  country: string;
  /** `type:tmdbId` keys of the viewer's library, for the "On my watchlist" filter. */
  mine: Set<string>;
  leaving: LeavingSoon;
};

function monthRange(c: MonthCursor): [string, string] {
  const p = monthPrefix(c);
  const last = new Date(Date.UTC(c.year, c.month + 1, 0)).getUTCDate();
  return [`${p}-01`, `${p}-${String(last).padStart(2, '0')}`];
}

/** One Discover calendar (Out soon, or Leaving soon): month cursor, picked day, "mine" filter, events. */
export function useCalendarPanel({ which, type, today, country, mine, leaving }: Inputs) {
  const [offset, setOffset] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [onlyOwned, setOnlyOwned] = useState(false);

  const start: MonthCursor = { year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) - 1 };
  const cursor = shiftMonth(start, offset);
  const prefix = monthPrefix(cursor);

  const release = useQuery({
    queryKey: ['discover-release', type, country, prefix],
    enabled: which === 'release',
    staleTime: 6 * 60 * 60 * 1000,
    queryFn: async () => {
      if (type === 'tv') {
        const [gte, lte] = monthRange(cursor);
        return releaseEvents(await fetchTvPremieres(gte, lte));
      }
      const films = await getMovieReleaseCalendar(cursor.year, cursor.month + 1, country);
      return releaseEvents(films.map((f) => ({ ...f, type: 'movie' as const, overview: f.overview ?? '', genres: [] })));
    },
  });

  const leavingList = useMemo(() => leavingEvents(leaving.titles, type), [leaving.titles, type]);
  const events: CalendarEvent[] = which === 'release' ? (release.data ?? []) : leavingList;
  const visible = onlyOwned ? onlyMine(events, mine) : events;
  const inMonth = visible.filter((e) => e.day.startsWith(prefix));
  const byDay = groupByDay(inMonth);
  const selected = defaultDay(picked, [...byDay.keys()], prefix, today);
  const items = selected ? (byDay.get(selected) ?? []) : [];
  const [loading, failed] = which === 'release' ? [release.isLoading, release.isError] : [leaving.loading, leaving.error];

  const reset = () => setPicked(null);
  const emptyText = failed
    ? 'Could not load this calendar.'
    : which === 'leaving' && !leaving.hasCatalogue
      ? 'Nothing tracked for your region yet.'
      : onlyOwned
        ? 'Nothing from your watchlist this month.'
        : 'Nothing this month.';

  return {
    which,
    title: which === 'release' ? 'Out soon' : 'Leaving soon',
    sub:
      which === 'leaving'
        ? `Last days on services in ${countryName(country)}`
        : type === 'movie'
          ? `Cinema releases in ${countryName(country)}`
          : 'Series premieres',
    monthLabel: `${MONTH_NAMES[cursor.month]} ${cursor.year}`,
    prevOff: offset === 0,
    nextOff: offset === MONTH_SPAN - 1,
    shift: (d: number) => {
      setOffset((o) => Math.max(0, Math.min(MONTH_SPAN - 1, o + d)));
      reset();
    },
    onlyOwned,
    toggleOwned: () => {
      setOnlyOwned((v) => !v);
      reset();
    },
    cells: buildCells(cursor, byDay, today),
    monthName: MONTH_NAMES[cursor.month],
    selected,
    pick: setPicked,
    dayLabel: selected ? longDayLabel(selected) : MONTH_NAMES[cursor.month],
    items,
    loading,
    emptyText,
  };
}

export type CalendarPanelModel = ReturnType<typeof useCalendarPanel>;
