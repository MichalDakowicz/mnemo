import { groupByDay } from './calendarEvents';
import { buildCells, leavingEvents, releaseEvents } from './calendarPanel';
import type { LeavingTitle } from './leaving';

const item = (id: number, releaseDate: string | null) => ({
  tmdbId: id, type: 'movie' as const, title: `T${id}`, releaseDate, coverUrl: null, voteAverage: 0, overview: '', genres: [],
});

const leaving = (over: Partial<LeavingTitle>): LeavingTitle => ({
  tmdbId: 1, mediaType: 'movie', title: 'Gone', posterUrl: null, releaseYear: 2020, link: null,
  expiresOn: '2026-11-01', daysLeft: 4, services: ['Netflix'], ownedServices: [], movieId: null, watched: false, ...over,
});

describe('releaseEvents', () => {
  it('drops titles without a full date', () => {
    const events = releaseEvents([item(1, '2026-11-06'), item(2, '2026'), item(3, null)]);
    expect(events.map((e) => e.day)).toEqual(['2026-11-06']);
    expect(events[0].meta).toBe('Film · in cinemas');
  });
});

describe('leavingEvents', () => {
  it('keeps one media type and warns for unwatched tracked titles', () => {
    const events = leavingEvents(
      [leaving({ tmdbId: 1, movieId: 'a' }), leaving({ tmdbId: 2 }), leaving({ tmdbId: 3, mediaType: 'tv' }), leaving({ tmdbId: 4, movieId: 'b', watched: true })],
      'movie',
    );
    expect(events.map((e) => !!e.warning)).toEqual([true, false, false]);
    expect(events[0].meta).toBe('Leaves Netflix · 4 days left');
  });
});

describe('buildCells', () => {
  it('pads to whole weeks and marks today and the past', () => {
    const byDay = groupByDay(releaseEvents([item(1, '2026-11-06')]));
    const cells = buildCells({ year: 2026, month: 10 }, byDay, '2026-11-05');
    expect(cells.length % 7).toBe(0);
    const real = cells.filter((c) => c !== null);
    expect(real).toHaveLength(30);
    expect(real.find((c) => c!.today)?.day).toBe(5);
    expect(real.find((c) => c!.day === 6)?.events).toHaveLength(1);
    expect(real[0]!.past).toBe(true);
  });
});
