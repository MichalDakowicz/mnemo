import type { Movie } from '@/types/movie';

import { quickStatusOptions, quickStatusUpdate } from './quickStatus';

const film = { type: 'movie', inWatchlist: true, inProgress: false, watched: false, watchDates: [], completedAt: null, timesWatched: 0 } as unknown as Movie;

describe('quickStatus', () => {
  it('offers watched only for films', () => {
    expect(quickStatusOptions(film)).toContain('watched');
    expect(quickStatusOptions({ ...film, type: 'tv' })).not.toContain('watched');
  });
  it('marks a film watched and dates it', () => {
    const u = quickStatusUpdate(film, 'watched', '2026-10-01T10:00:00.000Z');
    expect(u).toMatchObject({ watched: true, inWatchlist: false, inProgress: false, status: 'Completed', completedAt: '2026-10-01T10:00:00.000Z' });
    expect(u.watchDates).toEqual(['2026-10-01T10:00:00.000Z']);
  });
  it('does not re-date an already watched title', () => {
    const u = quickStatusUpdate({ ...film, watched: true }, 'watched');
    expect(u.completedAt).toBeUndefined();
    expect(u.watched).toBeUndefined();
  });
  it('keeps watched when moving back to the watchlist', () => {
    expect(quickStatusUpdate({ ...film, watched: true, inWatchlist: false }, 'watchlist')).toMatchObject({ inWatchlist: true, watched: true });
  });
});
