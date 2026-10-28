import type { Movie } from '@/types/movie';

import { barPercent, selectHallOfFame, sumDaily, titleMeta, whenLabel } from './statsSummary';

const m = (over: Partial<Movie>) => ({ id: 'x', title: 't', addedAt: '2020-01-01', ratings: {}, ...over }) as Movie;

describe('statsSummary', () => {
  it('sums daily counts', () => {
    expect(sumDaily({ a: 2, b: 3 })).toBe(5);
    expect(sumDaily({})).toBe(0);
  });

  it('scales bars with a floor', () => {
    expect(barPercent(5, 10)).toBe(50);
    expect(barPercent(1, 100, 4)).toBe(4);
    expect(barPercent(1, 0)).toBe(0);
  });

  it('picks five-star titles, newest finish first', () => {
    const list = selectHallOfFame([
      m({ id: 'a', ratings: { overall: 5 }, completedAt: '2024-01-01' }),
      m({ id: 'b', ratings: { overall: 4.9 }, completedAt: '2025-01-01' }),
      m({ id: 'c', ratings: { overall: 5 }, completedAt: '2025-06-01' }),
    ]);
    expect(list.map((x) => x.id)).toEqual(['c', 'a']);
  });

  it('labels kind and year', () => {
    expect(titleMeta({ type: 'tv', releaseDate: '2021-05-01' })).toBe('Series · 2021');
    expect(titleMeta({ type: 'movie', releaseDate: null })).toBe('Film');
  });

  it('labels recency', () => {
    const now = new Date(2026, 9, 28, 12);
    expect(whenLabel(new Date(2026, 9, 28, 1).toISOString(), now)).toBe('Today');
    expect(whenLabel(new Date(2026, 9, 27, 23).toISOString(), now)).toBe('Yesterday');
    expect(whenLabel(new Date(2026, 9, 25).toISOString(), now)).toBe('3 days ago');
    expect(whenLabel(null, now)).toBe('');
  });
});
