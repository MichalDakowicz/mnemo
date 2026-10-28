import { useMemo } from 'react';

import { useNow } from '@/hooks/useNow';
import { matchesDirectorFilter, matchesGenreFilter, matchesTypeFilter, matchesYearFilter } from '@/lib/libraryFacets';
import { movieMatchesSearchQuery } from '@/lib/librarySearch';
import { compareMovies } from '@/lib/librarySort';
import { isInProgress, isInWatchlist } from '@/lib/movieStatus';
import { effectiveServiceSelection, matchesServiceFilter } from '@/lib/serviceFilter';
import { matchesStatusFilter } from '@/lib/statusFilter';
import { selectComingSoon } from '@/lib/upcoming';
import type { SortBy, SortDir, StatusFilter, TypeFilter } from '@/store/libraryPrefs';
import type { Movie } from '@/types/movie';

export type LibraryFilterInput = {
  movies: Movie[];
  searchQuery: string;
  statusFilter: StatusFilter;
  typeFilter: TypeFilter;
  selectedServices: string[];
  selectedGenres: string[];
  selectedDirectors: string[];
  selectedYears: string[];
  sortBy: SortBy;
  sortDir: SortDir;
  recentlyAddedDays: number;
  showRecentlyAdded: boolean;
  ownedServices: string[];
};

const DAY = 24 * 60 * 60 * 1000;

/** The derive/memo hook for Library: sections, the filtered main grid (de-duped from them), random-pick pool. */
export function useLibraryFilters(input: LibraryFilterInput) {
  const { movies, searchQuery, statusFilter, typeFilter, selectedServices, selectedGenres, selectedDirectors, selectedYears, sortBy, sortDir, recentlyAddedDays, showRecentlyAdded, ownedServices } = input;
  const now = useNow();
  const serviceSelection = useMemo(() => effectiveServiceSelection(selectedServices, ownedServices), [selectedServices, ownedServices]);

  return useMemo(() => {
    const q = searchQuery.trim();
    const bySearch = (list: Movie[]) => (q ? list.filter((m) => movieMatchesSearchQuery(m, searchQuery)) : list);

    const continueWatching = bySearch(movies.filter((m) => isInProgress(m)).slice(0, 30));
    const recentlyAdded = showRecentlyAdded
      ? bySearch(
          movies
            .filter((m) => m.addedAt && new Date(m.addedAt).getTime() >= now - recentlyAddedDays * DAY)
            .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
            .slice(0, 30),
        )
      : [];
    const comingSoon = bySearch(selectComingSoon(movies, now));

    const filtered = bySearch(movies)
      .filter((m) => matchesStatusFilter(m, statusFilter))
      .filter((m) => matchesTypeFilter(m, typeFilter))
      .filter((m) => matchesServiceFilter(m, serviceSelection, ownedServices))
      .filter((m) => matchesGenreFilter(m, selectedGenres))
      .filter((m) => matchesDirectorFilter(m, selectedDirectors))
      .filter((m) => matchesYearFilter(m, selectedYears))
      .sort((a, b) => compareMovies(a, b, sortBy, sortDir));

    const inSections = new Set([...continueWatching, ...recentlyAdded, ...comingSoon].map((m) => m.id));
    return {
      continueWatching,
      recentlyAdded,
      comingSoon,
      mainMovies: filtered.filter((m) => !inSections.has(m.id)),
      // With no status chosen, a random pick means "what should I watch": the watchlist.
      pickPool: statusFilter !== 'all' ? filtered : filtered.filter((m) => isInWatchlist(m)),
    };
  }, [movies, searchQuery, statusFilter, typeFilter, serviceSelection, ownedServices, selectedGenres, selectedDirectors, selectedYears, sortBy, sortDir, recentlyAddedDays, showRecentlyAdded, now]);
}
