import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { SORT_DEFAULT_DIR, type SortDir } from '@/lib/librarySort';

// Durable Library prefs (localStorage). Search text and scroll stay local state.
export type ViewMode = 'grid' | 'list';
export type GridSize = 'compact' | 'normal' | 'large';
export type SortBy = 'title' | 'dateAdded' | 'releaseDate' | 'rating' | 'director' | 'runtime';
export type StatusFilter = 'all' | 'watchlist' | 'watching' | 'completed' | 'rewatch';
export type TypeFilter = 'all' | 'movie' | 'tv';
export type { SortDir };

type LibraryPrefsState = {
  viewMode: ViewMode;
  gridSize: GridSize;
  sortBy: SortBy;
  sortDir: SortDir;
  statusFilter: StatusFilter;
  typeFilter: TypeFilter;
  selectedServices: string[];
  selectedGenres: string[];
  selectedDirectors: string[];
  selectedYears: string[];
  comingSoonCollapsed: boolean;
  setViewMode: (viewMode: ViewMode) => void;
  setGridSize: (gridSize: GridSize) => void;
  toggleComingSoonCollapsed: () => void;
  setSortBy: (sortBy: SortBy) => void;
  toggleSortDir: () => void;
  setStatusFilter: (statusFilter: StatusFilter) => void;
  setTypeFilter: (typeFilter: TypeFilter) => void;
  toggleService: (service: string) => void;
  toggleGenre: (genre: string) => void;
  toggleDirector: (director: string) => void;
  toggleYear: (year: string) => void;
  resetFilters: () => void;
};

function toggleIn(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export const useLibraryPrefs = create<LibraryPrefsState>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      gridSize: 'normal',
      sortBy: 'dateAdded',
      sortDir: SORT_DEFAULT_DIR.dateAdded,
      statusFilter: 'all',
      typeFilter: 'all',
      selectedServices: [],
      selectedGenres: [],
      selectedDirectors: [],
      selectedYears: [],
      comingSoonCollapsed: false,
      setViewMode: (viewMode) => set({ viewMode }),
      setGridSize: (gridSize) => set({ gridSize }),
      toggleComingSoonCollapsed: () => set((s) => ({ comingSoonCollapsed: !s.comingSoonCollapsed })),
      setSortBy: (sortBy) => set({ sortBy, sortDir: SORT_DEFAULT_DIR[sortBy] }),
      toggleSortDir: () => set((s) => ({ sortDir: s.sortDir === 'asc' ? 'desc' : 'asc' })),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setTypeFilter: (typeFilter) => set({ typeFilter }),
      toggleService: (v) => set((s) => ({ selectedServices: toggleIn(s.selectedServices, v) })),
      toggleGenre: (v) => set((s) => ({ selectedGenres: toggleIn(s.selectedGenres, v) })),
      toggleDirector: (v) => set((s) => ({ selectedDirectors: toggleIn(s.selectedDirectors, v) })),
      toggleYear: (v) => set((s) => ({ selectedYears: toggleIn(s.selectedYears, v) })),
      resetFilters: () =>
        set({ statusFilter: 'all', typeFilter: 'all', selectedServices: [], selectedGenres: [], selectedDirectors: [], selectedYears: [] }),
    }),
    { name: 'mnemo-library-prefs', version: 1 },
  ),
);
