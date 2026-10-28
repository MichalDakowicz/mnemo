import { useQuery } from '@tanstack/react-query';

import { nextEpisode } from '@/lib/cardInfo';
import { fetchTitleExtras } from '@/lib/tmdbExtra';
import type { Movie } from '@/types/movie';

/**
 * The first episode of a series you have not watched, as [season, episode].
 *
 * A stored row only knows the size of the seasons you have opened, so without TMDB's season list a
 * show whose season 1 is fully watched reads as "S1 E24" instead of "S3 E1". The season sizes come
 * from the same query the title page uses (shared cache); until they arrive a row that has none
 * stored answers null rather than guess.
 */
export function useNextEpisode(m: Movie): [number, number] | null {
  const isTv = m.type === 'tv' && m.tmdbId != null;
  const extras = useQuery({
    queryKey: ['tmdb', 'extras', 'tv', m.tmdbId],
    queryFn: () => fetchTitleExtras(m.tmdbId as number, 'tv'),
    enabled: isTv,
    staleTime: 10 * 60 * 1000,
  });
  if (m.type !== 'tv') return null;

  const fromTmdb = Object.fromEntries((extras.data?.seasons ?? []).filter((s) => s.number > 0 && s.episodeCount > 0).map((s) => [s.number, s.episodeCount]));
  if (Object.keys(fromTmdb).length > 0) return nextEpisode({ ...m, seasonEpisodeCounts: fromTmdb });
  if (isTv && extras.isLoading && Object.keys(m.seasonEpisodeCounts ?? {}).length === 0) return null;
  return nextEpisode(m);
}
