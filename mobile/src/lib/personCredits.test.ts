import { departmentsOf, filterSortCredits, knownFor, libraryStats, mapCombinedCredits } from './personCredits';

const raw = {
  cast: [
    { id: 1, media_type: 'movie', title: 'A', release_date: '2020-01-01', character: 'Ann', popularity: 5 },
    { id: 2, media_type: 'tv', name: 'B', first_air_date: '2022-05-05', character: 'Self', genre_ids: [10767], popularity: 9 },
    { id: 3, media_type: 'tv', name: 'C', first_air_date: '2023-05-05', character: 'Cee', popularity: 7 },
    { id: 9, media_type: 'person', name: 'X' },
  ],
  crew: [
    { id: 1, media_type: 'movie', title: 'A', release_date: '2020-01-01', department: 'Directing', job: 'Director', popularity: 5 },
    { id: 1, media_type: 'movie', title: 'A', release_date: '2020-01-01', department: 'Directing', job: 'Writer', popularity: 5 },
    { id: 4, media_type: 'movie', title: 'D', department: 'Writing', job: 'Screenplay', popularity: 1 },
  ],
};

describe('personCredits', () => {
  const credits = mapCombinedCredits(raw);

  it('maps, drops talk-show Self and merges roles per department', () => {
    expect(credits.map((c) => c.title).sort()).toEqual(['A', 'A', 'C', 'D']);
    expect(credits.find((c) => c.department === 'Directing')?.role).toBe('Director · Writer');
    expect(credits.find((c) => c.title === 'C')?.role).toBe('as Cee');
  });

  it('ranks departments with the known one first', () => {
    expect(departmentsOf(credits, 'Writing')[0].name).toBe('Writing');
    const counts = departmentsOf(credits).map((d) => d.count);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it('knownFor is distinct and popularity ordered', () => {
    expect(knownFor(credits, 2).map((c) => c.title)).toEqual(['C', 'A']);
  });

  const lib = { 'movie:1': { status: 'watched' as const, rating: 4 }, 'tv:3': { status: 'watching' as const, rating: 0 } };

  it('filters and sorts', () => {
    const all = { department: null, filter: 'all' as const, sort: 'new' as const };
    expect(filterSortCredits(credits, { ...all, filter: 'in' }, lib).map((c) => c.key)).toEqual(['tv:3', 'movie:1', 'movie:1']);
    expect(filterSortCredits(credits, { ...all, filter: 'out' }, lib).map((c) => c.title)).toEqual(['D']);
    expect(filterSortCredits(credits, { ...all, department: 'Acting', sort: 'old' }, lib).map((c) => c.title)).toEqual(['A', 'C']);
    expect(filterSortCredits(credits, { ...all, sort: 'rating' }, lib)[0].key).toBe('movie:1');
  });

  it('computes library stats', () => {
    expect(libraryStats(credits, lib)).toEqual({ total: 3, inLibrary: 2, watched: 1, average: 4 });
    expect(libraryStats([], {}).average).toBeNull();
  });
});
