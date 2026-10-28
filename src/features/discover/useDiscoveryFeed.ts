import { useInfiniteQuery } from '@tanstack/react-query';

import { pickLikedSeed, planBatch } from '@/lib/discoveryPlan';
import { mulberry32 } from '@/lib/seededRandom';
import { fetchRowSource, fetchSimilar } from '@/lib/tmdbDiscover';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';
import { getGenres } from '@/lib/tmdb';
import type { MediaType, Movie } from '@/types/movie';

export type DiscoverRow = {
  id: string;
  title: string;
  badge?: string;
  items: DiscoverItem[];
  /** Set for genre rows: "Explore genre" opens it in place. */
  genre?: { id: number; name: string };
};

const MAX_BATCHES = 6;
const DAY_MS = 24 * 60 * 60 * 1000;

async function safe<T>(job: Promise<T[]>): Promise<T[]> {
  try {
    return await job;
  } catch {
    return [];
  }
}

async function buildBatch(type: MediaType, movies: Movie[], seed: number): Promise<DiscoverRow[]> {
  const rand = mulberry32(seed);
  const genres = await getGenres(type);
  const plans = planBatch(type, movies, genres, rand);

  const rows: DiscoverRow[] = await Promise.all(
    plans.map(async (plan, i) => ({
      id: `${type}-${seed}-${i}`,
      title: plan.title,
      badge: plan.badge,
      genre: plan.genreId ? { id: plan.genreId, name: plan.genreName ?? plan.title } : undefined,
      items: (await safe(fetchRowSource(type, plan.source))).slice(0, 20),
    })),
  );

  const liked = pickLikedSeed(movies, type, rand);
  if (liked?.tmdbId) {
    const similar = (await safe(fetchSimilar(type, liked.tmdbId))).slice(0, 20);
    if (similar.length) {
      // Put it first: it is the one row written for this viewer.
      rows.unshift({ id: `${type}-${seed}-rec`, title: `Because you liked ${liked.title}`, badge: 'For you', items: similar });
    }
  }
  return rows.filter((r) => r.items.length > 0);
}

/**
 * Seeded, cached discovery feed. The seed is day * 1000 + reroll, so the same day,
 * tab and reroll always produce the same rows: revisiting Discover hits the cache
 * and nothing reshuffles underneath the reader (the old app used Math.random per
 * mount). Only `reroll` gives new rows. Waits for the library so the rows are
 * personalised from the first page.
 */
export function useDiscoveryFeed(type: MediaType, reroll: number, movies: Movie[], libraryReady: boolean, today: string) {
  const seed = Math.floor(Date.parse(`${today}T00:00:00Z`) / DAY_MS) * 1000 + reroll;
  return useInfiniteQuery({
    queryKey: ['discover-feed', type, seed],
    initialPageParam: 0,
    enabled: libraryReady,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    getNextPageParam: (_last: DiscoverRow[], pages: DiscoverRow[][]) => (pages.length < MAX_BATCHES ? pages.length : undefined),
    queryFn: ({ pageParam }) => buildBatch(type, movies, seed + pageParam * 7919),
  });
}
