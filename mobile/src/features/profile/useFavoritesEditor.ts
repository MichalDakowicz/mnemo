import { useMemo, useState } from 'react';

import { useUpdateFavorites } from '@/hooks/useProfile';
import {
  favoriteKey,
  MAX_FAVORITES,
  movieToFavorite,
  sortByRatingDesc,
  toggleFavorite,
} from '@/lib/favorites';
import type { FavoriteItem, Movie, Profile } from '@/types/movie';

export type Pickable = { movie: Movie; item: FavoriteItem; on: boolean };

// Top-4 editor. Each pin / unpin writes profiles.favorites straight away (toFavoritesPayload via
// useUpdateFavorites); the profile query is patched optimistically on success.
export function useFavoritesEditor(profile: Profile | null, movies: Movie[]) {
  const save = useUpdateFavorites();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const favorites = useMemo(() => profile?.favorites ?? [], [profile]);

  const pickables = useMemo<Pickable[]>(() => {
    const chosen = new Set(favorites.map(favoriteKey));
    return sortByRatingDesc(movies.filter((m) => m.watched))
      .map((movie) => ({ movie, item: movieToFavorite(movie) }))
      .filter((p): p is { movie: Movie; item: FavoriteItem } => p.item != null)
      .map((p) => ({ ...p, on: chosen.has(favoriteKey(p.item)) }));
  }, [movies, favorites]);

  // Library entry behind a pin, for the year / rating line under its poster.
  const libraryEntry = (item: FavoriteItem) => movies.find((m) => m.tmdbId === item.tmdbId && m.type === item.type) ?? null;

  const apply = async (item: FavoriteItem) => {
    const next = toggleFavorite(favorites, item);
    if (next === favorites) return; // already at the cap
    setError(null);
    try {
      await save.mutateAsync(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your favourites.');
    }
  };

  return {
    favorites,
    editing,
    toggleEditing: () => setEditing((v) => !v),
    startEditing: () => setEditing(true),
    pickables,
    full: favorites.length >= MAX_FAVORITES,
    saving: save.isPending,
    error,
    pin: apply,
    unpin: apply,
    libraryEntry,
  };
}
