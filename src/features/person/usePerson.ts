import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { useAddToLibrary } from '@/features/title/useAddToLibrary';
import {
  departmentsOf,
  filterSortCredits,
  knownFor,
  libraryStats,
  type CreditFilter,
  type CreditSort,
} from '@/lib/personCredits';
import { fetchPersonCredits, fetchPersonProfile } from '@/lib/tmdbExtra';

import { useLibraryIndex } from './useLibraryIndex';

export function usePerson(personId: number) {
  const profile = useQuery({
    queryKey: ['tmdb', 'personProfile', personId],
    queryFn: () => fetchPersonProfile(personId),
    enabled: personId > 0,
    staleTime: 30 * 60 * 1000,
  });
  const credits = useQuery({
    queryKey: ['tmdb', 'personCredits', personId],
    queryFn: () => fetchPersonCredits(personId),
    enabled: personId > 0,
    staleTime: 30 * 60 * 1000,
  });
  const library = useLibraryIndex();
  const adder = useAddToLibrary();
  const [dept, setDept] = useState<string | null>(null);
  const [filter, setFilter] = useState<CreditFilter>('all');
  const [sort, setSort] = useState<CreditSort>('new');

  const all = credits.data ?? [];
  const departments = departmentsOf(all, profile.data?.knownForDepartment);
  // An unknown or stale pick falls back to the first department.
  const department = dept && departments.some((d) => d.name === dept) ? dept : (departments[0]?.name ?? null);

  return {
    profile: profile.data ?? null,
    loading: profile.isLoading || credits.isLoading,
    error: profile.isError || credits.isError || (!profile.isLoading && !profile.data),
    refetch: () => {
      void profile.refetch();
      void credits.refetch();
    },
    departments,
    department,
    setDept,
    filter,
    setFilter,
    sort,
    setSort,
    known: knownFor(all),
    list: filterSortCredits(all, { department, filter, sort }, library),
    stats: libraryStats(all, library),
    library,
    adder,
  };
}
