import { useState } from 'react';

import { useMovies } from '@/hooks/useMovies';
import type { StatusFlags } from '@/lib/movieStatus';
import { normalizeAvailability } from '@/lib/services';
import { fetchMediaMetadata, type MediaMetadata } from '@/lib/tmdb';
import type { MediaType, Movie } from '@/types/movie';

// "Add to watchlist" from any Discover card: the same row Radar's quick add writes
// (full TMDB metadata, status Watchlist), through useMovies().addMovie.
const WATCHLIST: StatusFlags = { inWatchlist: true, inProgress: false, watched: false };

function payload(meta: MediaMetadata): Partial<Movie> & { title: string; type: MediaType } {
  return {
    tmdbId: meta.tmdbId,
    imdbId: meta.imdbId,
    type: meta.type,
    title: meta.title,
    director: meta.director,
    cast: meta.cast,
    genres: meta.genres,
    releaseDate: meta.releaseDate,
    coverUrl: meta.coverUrl,
    overview: meta.overview,
    runtime: meta.runtime,
    voteAverage: meta.voteAverage,
    voteCount: meta.voteCount,
    tagline: meta.tagline,
    budget: meta.budget,
    revenue: meta.revenue,
    productionCompanies: meta.productionCompanies,
    numberOfSeasons: meta.number_of_seasons,
    numberOfEpisodes: meta.number_of_episodes,
    tmdbStatus: meta.tmdbStatus,
    availability: normalizeAvailability(meta.availability),
    status: 'Watchlist',
    ...WATCHLIST,
    timesWatched: 0,
    completedAt: null,
    watchDates: [],
    ratings: {},
  };
}

export type CardTarget = { tmdbId: number; type: MediaType; title: string };

export function useQuickAdd(country = 'US') {
  const { movies, loading, addMovie, removeMovie } = useMovies();
  const [pending, setPending] = useState<string | null>(null);

  const keyOf = (t: { tmdbId: number; type: MediaType }) => `${t.type}:${t.tmdbId}`;
  // TMDB numbers films and series separately, so the type has to match too.
  const find = (t: { tmdbId: number; type: MediaType }) => movies.find((m) => m.tmdbId === t.tmdbId && m.type === t.type) ?? null;

  const add = async (t: CardTarget) => {
    if (find(t)) return;
    setPending(keyOf(t));
    try {
      const meta = await fetchMediaMetadata(t.tmdbId, t.type, country);
      if (meta) await addMovie(payload(meta));
    } finally {
      setPending(null);
    }
  };

  const remove = async (t: CardTarget) => {
    const movie = find(t);
    if (!movie) return;
    setPending(keyOf(t));
    try {
      await removeMovie(movie.id);
    } finally {
      setPending(null);
    }
  };

  return {
    isAdded: (t: { tmdbId: number; type: MediaType }) => find(t) !== null,
    isPending: (t: { tmdbId: number; type: MediaType }) => pending === keyOf(t),
    find,
    add,
    remove,
    /** Library keys (`type:tmdbId`) for the "on my watchlist" calendar filter. */
    mine: new Set(movies.filter((m) => m.tmdbId).map((m) => `${m.type}:${m.tmdbId}`)),
    movies,
    /** False until the first library read has landed. */
    ready: !loading,
  };
}
