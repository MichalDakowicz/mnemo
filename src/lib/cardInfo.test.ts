import type { Movie } from '@/types/movie';

import { cardMeta, cardStatus, formatRuntime, nextEpisode, releaseBadge } from './cardInfo';

const base = {
  type: 'movie',
  releaseDate: '2024-05-01',
  genres: [{ name: 'Drama' }],
  director: [],
  ratings: {},
  inWatchlist: true,
  inProgress: false,
  watched: false,
  episodesWatched: {},
  episodeWatchDates: {},
  seasonEpisodeCounts: {},
  numberOfEpisodes: null,
  runtime: 0,
} as unknown as Movie;

describe('cardInfo', () => {
  it('formats runtime', () => {
    expect(formatRuntime(112)).toBe('1 h 52 m');
    expect(formatRuntime(120)).toBe('2 h');
    expect(formatRuntime(45)).toBe('45 m');
    expect(formatRuntime(0)).toBe('');
  });
  it('builds meta with year, genre and rating', () => {
    expect(cardMeta({ ...base, ratings: { overall: 4.5 } })).toBe('2024 · Drama · ★ 4.5');
    expect(cardMeta({ ...base, genres: [], releaseDate: null })).toBe('');
  });
  it('flags rewatch', () => {
    expect(cardStatus({ ...base, watched: true })).toBe('rewatch');
    expect(cardStatus({ ...base, inWatchlist: false, watched: true })).toBe('completed');
    expect(cardStatus({ ...base, inWatchlist: false, inProgress: true })).toBe('watching');
  });
  it('formats release badge', () => {
    expect(releaseBadge('2026-11-14')).toBe('NOV 14');
    expect(releaseBadge('2027')).toBe('2027');
    expect(releaseBadge(null)).toBe('');
  });
  it('finds the next episode', () => {
    const tv = {
      ...base,
      type: 'tv',
      seasonEpisodeCounts: { '1': 2, '2': 2 },
      episodeWatchDates: { s1e1: ['2026-01-01T00:00:00.000Z'], s1e2: ['2026-01-02T00:00:00.000Z'] },
    } as Movie;
    expect(nextEpisode(tv)).toEqual([2, 1]);
    expect(nextEpisode({ ...tv, numberOfEpisodes: 3, seasonEpisodeCounts: {} })).toEqual([1, 3]);
    expect(nextEpisode({ ...tv, episodeWatchDates: { s1e1: ['2026-01-01T00:00:00.000Z'], s1e2: ['x'], s2e1: ['2026-01-01T00:00:00.000Z'], s2e2: ['2026-01-01T00:00:00.000Z'] } })).toBeNull();
  });
});
