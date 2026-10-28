import { averageRating, nextUnwatched, pickStatus, seasonProgress, statusKeyOf } from './titleStatus';

const base = { inWatchlist: false, inProgress: false, watched: false, timesWatched: 0, undatedWatches: 0 };

describe('statusKeyOf', () => {
  it('prefers in progress, then watchlist, then completed', () => {
    expect(statusKeyOf({ ...base, inProgress: true, watched: true })).toBe('watching');
    expect(statusKeyOf({ ...base, inWatchlist: true, watched: true })).toBe('watchlist');
    expect(statusKeyOf({ ...base, watched: true })).toBe('watched');
  });
});

describe('pickStatus', () => {
  it('completing counts one watch and clears the other flags', () => {
    const s = pickStatus({ ...base, inWatchlist: true }, 'watched');
    expect(s).toMatchObject({ watched: true, inWatchlist: false, inProgress: false, timesWatched: 1 });
  });
  it('keeps watched when moving back to watchlist (rewatch)', () => {
    const s = pickStatus({ ...base, watched: true, timesWatched: 2 }, 'watchlist');
    expect(s).toMatchObject({ inWatchlist: true, watched: true, timesWatched: 2 });
  });
});

describe('episodes', () => {
  const eps = [{ episode_number: 1 }, { episode_number: 2 }, { episode_number: 3 }];
  it('finds the next unwatched', () => {
    expect(nextUnwatched(eps, { 1: 1, 2: 0 })).toBe(2);
    expect(nextUnwatched(eps, { 1: 1, 2: 1, 3: 2 })).toBeNull();
  });
  it('counts progress', () => {
    expect(seasonProgress(eps, { 1: 1 })).toEqual({ watched: 1, total: 3, pct: 33 });
    expect(seasonProgress([], {})).toEqual({ watched: 0, total: 0, pct: 0 });
  });
});

describe('averageRating', () => {
  it('ignores zeros', () => {
    expect(averageRating([4, 0, 5])).toBe(4.5);
    expect(averageRating([0])).toBeNull();
  });
});
