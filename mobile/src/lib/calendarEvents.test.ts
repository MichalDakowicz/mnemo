import type { Movie } from '@/types/movie';

import { groupByDay, leavingMeta, libraryKey, onlyMine, type CalendarEvent } from './calendarEvents';

const ev = (id: string, day: string, tmdbId: number, type: 'movie' | 'tv' = 'movie'): CalendarEvent => ({
  id,
  day,
  meta: '',
  movie: { tmdbId, type } as Movie,
});

describe('calendarEvents', () => {
  it('groups by day', () => {
    const map = groupByDay([ev('a', '2026-10-30', 1), ev('b', '2026-10-30', 2), ev('c', '2026-11-01', 3)]);
    expect(map.get('2026-10-30')).toHaveLength(2);
    expect(map.get('2026-11-01')).toHaveLength(1);
  });

  it('keeps only library titles, matching type too', () => {
    const mine = new Set([libraryKey(1, 'movie')]);
    const out = onlyMine([ev('a', 'd', 1), ev('b', 'd', 1, 'tv'), ev('c', 'd', 2)], mine);
    expect(out.map((e) => e.id)).toEqual(['a']);
  });

  it('words days left', () => {
    expect(leavingMeta(['Netflix'], 0)).toBe('Leaves Netflix · last day');
    expect(leavingMeta(['Netflix', 'Max'], 1)).toBe('Leaves Netflix, Max · 1 day left');
    expect(leavingMeta(['Max'], 5)).toBe('Leaves Max · 5 days left');
  });
});
