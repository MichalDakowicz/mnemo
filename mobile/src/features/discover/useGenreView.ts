import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchGenrePage } from '@/lib/tmdbDiscover';
import type { MediaType } from '@/types/movie';

/** Pages of one genre's titles, most popular first. */
export function useGenreView(type: MediaType, genreId: number | null) {
  const query = useInfiniteQuery({
    queryKey: ['discover-genre', type, genreId],
    enabled: genreId != null,
    initialPageParam: 1,
    staleTime: 60 * 60 * 1000,
    queryFn: ({ pageParam }) => fetchGenrePage(type, genreId as number, pageParam),
    getNextPageParam: (last, pages) => (pages.length < Math.min(last.totalPages, 500) ? pages.length + 1 : undefined),
  });
  const seen = new Set<number>();
  const items = (query.data?.pages ?? [])
    .flatMap((p) => p.items)
    .filter((i) => !seen.has(i.tmdbId) && !!seen.add(i.tmdbId));
  return {
    items,
    loading: query.isLoading,
    error: query.isError,
    hasMore: query.hasNextPage,
    loadingMore: query.isFetchingNextPage,
    loadMore: () => void query.fetchNextPage(),
  };
}
