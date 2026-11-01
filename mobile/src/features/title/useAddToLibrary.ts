import { useState } from 'react';

import { useMovies } from '@/hooks/useMovies';
import { fetchMediaMetadata } from '@/lib/tmdb';
import { DEFAULT_QUICK_ADD_STATUS, metadataToPayload } from '@/lib/titlePayload';
import type { MediaType } from '@/types/movie';

/** Adds a TMDB title to the library as Radar does: fetch its metadata, write one row on the watchlist. */
export function useAddToLibrary() {
  const { movies, addMovie } = useMovies();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdded = (tmdbId: number, type: MediaType) => movies.some((m) => m.tmdbId === tmdbId && m.type === type);

  const add = async (tmdbId: number, type: MediaType) => {
    if (isAdded(tmdbId, type)) return;
    setPending(`${type}:${tmdbId}`);
    setError(null);
    try {
      const meta = await fetchMediaMetadata(tmdbId, type, 'US');
      if (!meta) throw new Error('TMDB has nothing for this title');
      await addMovie(metadataToPayload(meta, DEFAULT_QUICK_ADD_STATUS));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add this title');
    } finally {
      setPending(null);
    }
  };

  return { add, isAdded, pending, error };
}
