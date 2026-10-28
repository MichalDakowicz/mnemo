import type { Movie } from '@/types/movie';

import { genreCounts, pickLikedSeed, planBatch } from './discoveryPlan';
import { mulberry32 } from './seededRandom';
import { toDiscoveryMovie } from './toDiscoveryMovie';

const genres = [
  { id: 1, name: 'Drama' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Horror' },
  { id: 4, name: 'Western' },
];

function owned(partial: Partial<Movie>): Movie {
  return {
    ...toDiscoveryMovie({ tmdbId: 1, type: 'movie', title: 'T', releaseDate: null, coverUrl: null, voteAverage: 0, overview: '', genres: [] }),
    ...partial,
  };
}

describe('planBatch', () => {
  it('is deterministic for a seed', () => {
    expect(planBatch('movie', [], genres, mulberry32(5))).toEqual(planBatch('movie', [], genres, mulberry32(5)));
  });
  it('adds one base row and 2-3 discovery rows for a new library', () => {
    const plan = planBatch('tv', [], genres, mulberry32(9));
    expect(plan.filter((p) => p.badge === 'Discovery').length).toBeGreaterThanOrEqual(2);
    expect(plan.filter((p) => !p.badge).length).toBe(1);
  });
  it('turns the viewer genres into rows', () => {
    const lib = [owned({ genres: [{ id: 2, name: 'Comedy' }] })];
    const plan = planBatch('movie', lib, genres, mulberry32(3));
    expect(plan.some((p) => p.title === 'Your genres · Comedy films')).toBe(true);
  });
});

describe('genreCounts', () => {
  it('ignores other types and string genres', () => {
    const lib = [
      owned({ genres: [{ id: 1, name: 'Drama' }, 'legacy' as never] }),
      owned({ type: 'tv', genres: [{ id: 2, name: 'Comedy' }] }),
    ];
    expect(genreCounts(lib, 'movie')).toEqual([{ id: 1, name: 'Drama', count: 1 }]);
  });
});

describe('pickLikedSeed', () => {
  it('only picks watched titles rated four or more', () => {
    const lib = [
      owned({ watched: true, ratings: { overall: 3 } }),
      owned({ watched: true, ratings: { overall: 5 }, title: 'Yes' }),
    ];
    expect(pickLikedSeed(lib, 'movie', mulberry32(1))?.title).toBe('Yes');
    expect(pickLikedSeed([], 'movie', mulberry32(1))).toBeUndefined();
  });
});
