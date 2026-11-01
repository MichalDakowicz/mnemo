import type { Movie } from '@/types/movie';

const EPOCH = new Date(0).toISOString();

/** What a TMDB list endpoint gives for one title (no library row behind it). */
export type DiscoverItem = {
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  releaseDate: string | null;
  coverUrl: string | null;
  voteAverage: number;
  overview: string;
  /** Genre names, resolved from TMDB's genre ids. */
  genres: string[];
};

/** A throwaway Movie for display and calendars only; never written, `id` is a synthetic key. */
export function toDiscoveryMovie(item: DiscoverItem): Movie {
  return {
    id: `tmdb-${item.type}-${item.tmdbId}`,
    userId: '',
    tmdbId: item.tmdbId,
    imdbId: null,
    type: item.type,
    title: item.title,
    director: [],
    cast: [],
    genres: item.genres.map((name) => ({ name })),
    releaseDate: item.releaseDate,
    coverUrl: item.coverUrl,
    overview: item.overview,
    runtime: 0,
    voteAverage: item.voteAverage,
    voteCount: 0,
    tagline: '',
    budget: 0,
    revenue: 0,
    productionCompanies: [],
    numberOfSeasons: null,
    numberOfEpisodes: null,
    tmdbStatus: null,
    availability: [],
    status: null,
    inWatchlist: false,
    inProgress: false,
    watched: false,
    timesWatched: 0,
    watchDates: [],
    completedAt: null,
    lastWatchedPosition: null,
    ratings: {},
    notes: '',
    url: '',
    addedAt: EPOCH,
    updatedAt: EPOCH,
    episodesWatched: {},
    episodeWatchDates: {},
    seasonEpisodeCounts: {},
  };
}
