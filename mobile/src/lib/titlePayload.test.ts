import { DEFAULT_QUICK_ADD_STATUS, metadataToPayload, statusLabel } from './titlePayload';
import type { MediaMetadata } from './tmdb';

const META: MediaMetadata = {
  tmdbId: 7,
  type: 'movie',
  title: 'T',
  director: [],
  releaseDate: '2020-01-01',
  coverUrl: null,
  overview: '',
  genres: [],
  runtime: 100,
  cast: [],
  availability: [],
  availabilityLogos: {},
  number_of_seasons: null,
  number_of_episodes: null,
  tmdbStatus: null,
  voteAverage: 7,
  imdbId: null,
  budget: 0,
  revenue: 0,
  tagline: '',
  productionCompanies: [],
  voteCount: 1,
};
const NOW = '2026-10-28T10:00:00.000Z';

describe('metadataToPayload', () => {
  it('adds to the watchlist by default with nothing dated', () => {
    const p = metadataToPayload(META, DEFAULT_QUICK_ADD_STATUS, {}, NOW);
    expect(p).toMatchObject({ status: 'Watchlist', inWatchlist: true, watched: false, timesWatched: 0, completedAt: null, watchDates: [] });
  });
  it('stamps a watched film with today', () => {
    const p = metadataToPayload(META, { ...DEFAULT_QUICK_ADD_STATUS, inWatchlist: false, watched: true, timesWatched: 1 }, {}, NOW);
    expect(p).toMatchObject({ status: 'Completed', timesWatched: 1, completedAt: NOW, watchDates: [NOW] });
  });
  it('labels flags', () => {
    expect(statusLabel({ inWatchlist: false, inProgress: true, watched: false })).toBe('Watching');
  });
});
