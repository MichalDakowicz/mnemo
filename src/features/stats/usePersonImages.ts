import { useQuery } from '@tanstack/react-query';

import { fetchPersonImages } from '@/lib/tmdb';

/** Profile photos for a list of TMDB person ids; a person with none maps to null and the caller draws a monogram. */
export function usePersonImages(ids: (number | null | undefined)[]): Record<number, string | null> {
  const wanted = [...new Set(ids.filter((id): id is number => !!id))].sort((a, b) => a - b);
  const query = useQuery({
    queryKey: ['tmdb', 'person-images', wanted],
    queryFn: () => fetchPersonImages(wanted),
    enabled: wanted.length > 0,
    staleTime: 24 * 60 * 60 * 1000,
  });
  return query.data ?? {};
}
