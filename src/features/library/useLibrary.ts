import { useCallback, useMemo, useState } from 'react';

import { useMovies } from '@/hooks/useMovies';
import { useUserSettings } from '@/hooks/useUserSettings';
import { libraryFacets, matchesTypeFilter } from '@/lib/libraryFacets';
import { quickStatusUpdate, type QuickStatus } from '@/lib/quickStatus';
import { statusCounts } from '@/lib/statusFilter';
import { useLibraryPrefs } from '@/store/libraryPrefs';
import type { Movie } from '@/types/movie';

import { useLibraryFilters } from './useLibraryFilters';

/** Everything the Library page needs: data, prefs, derived sections, actions. Page only composes. */
export function useLibrary() {
  const { movies, loading, error, updateMovie } = useMovies();
  const { settings } = useUserSettings();
  const prefs = useLibraryPrefs();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = useLibraryFilters({
    movies,
    searchQuery,
    statusFilter: prefs.statusFilter,
    typeFilter: prefs.typeFilter,
    selectedServices: prefs.selectedServices,
    selectedGenres: prefs.selectedGenres,
    selectedDirectors: prefs.selectedDirectors,
    selectedYears: prefs.selectedYears,
    sortBy: prefs.sortBy,
    sortDir: prefs.sortDir,
    recentlyAddedDays: settings.recentlyAddedDays,
    showRecentlyAdded: settings.showRecentlyAdded,
    ownedServices: settings.ownedServices,
  });

  const facets = useMemo(() => libraryFacets(movies), [movies]);
  // Status chip counts follow the type chip, like the artboard's.
  const counts = useMemo(() => statusCounts(movies.filter((m) => matchesTypeFilter(m, prefs.typeFilter))), [movies, prefs.typeFilter]);

  const activeFilterCount =
    prefs.selectedServices.length + prefs.selectedGenres.length + prefs.selectedDirectors.length + prefs.selectedYears.length;

  const quickStatus = useCallback(
    async (movie: Movie, target: QuickStatus) => {
      setActionError(null);
      try {
        await updateMovie(movie.id, quickStatusUpdate(movie, target));
      } catch {
        setActionError(`Could not update ${movie.title}. Try again.`);
      }
    },
    [updateMovie],
  );

  const summary = useMemo(() => {
    const watched = movies.filter((m) => m.watched).length;
    const listed = movies.filter((m) => m.inWatchlist).length;
    return `${movies.length} titles · ${watched} watched · ${listed} on your watchlist`;
  }, [movies]);

  return { movies, loading, error, actionError, prefs, searchQuery, setSearchQuery, ...filtered, facets, counts, activeFilterCount, quickStatus, summary, ownedServices: settings.ownedServices };
}
