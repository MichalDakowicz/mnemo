import { useQuery } from '@tanstack/react-query';

import { fetchTrending } from '@/lib/tmdbDiscover';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';
import type { MediaType } from '@/types/movie';

const HERO_COUNT = 12;

/** The reel's titles: this week's trending films or shows. */
export function useDiscoverHero(type: MediaType) {
  const trending = useQuery({
    queryKey: ['discover-hero', type],
    queryFn: () => fetchTrending(type),
    staleTime: 60 * 60 * 1000,
  });
  // A title with no poster would break the reel; trending without art is rare, so it is skipped.
  const items: DiscoverItem[] = (trending.data ?? []).filter((i) => i.coverUrl).slice(0, HERO_COUNT);
  return { items, loading: trending.isLoading, error: trending.isError };
}
