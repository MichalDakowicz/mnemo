import type { Movie } from '@/types/movie';

import { matchesStatusFilter, statusCounts } from './statusFilter';

const m = (o: Partial<Movie>) => ({ inWatchlist: false, inProgress: false, watched: false, ...o }) as Movie;

describe('statusFilter', () => {
  const list = [m({ inWatchlist: true }), m({ inProgress: true }), m({ watched: true }), m({ watched: true, inWatchlist: true })];
  it('matches each status', () => {
    expect(list.filter((x) => matchesStatusFilter(x, 'watchlist'))).toHaveLength(2);
    expect(list.filter((x) => matchesStatusFilter(x, 'completed'))).toHaveLength(2);
    expect(list.filter((x) => matchesStatusFilter(x, 'rewatch'))).toHaveLength(1);
  });
  it('counts', () => {
    expect(statusCounts(list)).toEqual({ all: 4, watchlist: 2, watching: 1, completed: 2, rewatch: 1 });
  });
});
