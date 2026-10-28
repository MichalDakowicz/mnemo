import type { MediaType, Movie } from '@/types/movie';

import { seededPick, seededShuffle } from './seededRandom';

/** Where one Discover row's titles come from. */
export type RowSource =
  | { kind: 'trending' }
  | { kind: 'category'; category: string }
  | { kind: 'genre'; genreId: number };

export type RowPlan = { title: string; badge?: string; source: RowSource; genreId?: number; genreName?: string };

type Base = { title: string; source: RowSource };

const BASE: Record<MediaType, Base[]> = {
  movie: [
    { title: 'Trending now', source: { kind: 'trending' } },
    { title: 'Top rated films', source: { kind: 'category', category: 'top_rated' } },
    { title: 'Popular films', source: { kind: 'category', category: 'popular' } },
  ],
  tv: [
    { title: 'Popular shows', source: { kind: 'category', category: 'popular' } },
    { title: 'Top rated shows', source: { kind: 'category', category: 'top_rated' } },
    { title: 'Airing today', source: { kind: 'category', category: 'airing_today' } },
    { title: 'Currently airing', source: { kind: 'category', category: 'on_the_air' } },
  ],
};

/** The viewer's own genres for one media type, most used first. Skips legacy string-shaped genres. */
export function genreCounts(movies: Movie[], type: MediaType) {
  const counts = new Map<number, { id: number; name: string; count: number }>();
  for (const m of movies) {
    if (m.type !== type) continue;
    for (const g of m.genres) {
      if (typeof g !== 'object' || g.id == null) continue;
      const entry = counts.get(g.id) ?? { id: g.id, name: g.name, count: 0 };
      entry.count++;
      counts.set(g.id, entry);
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

/**
 * One batch of rows, decided from a seeded random source so the same day, tab and
 * reroll always give the same rows (the old app reshuffled on every visit).
 * The "because you liked" row is added by the caller once its seed title is known.
 */
export function planBatch(
  type: MediaType,
  movies: Movie[],
  allGenres: { id: number; name: string }[],
  rand: () => number,
): RowPlan[] {
  const base = seededPick(BASE[type], rand)!;
  const mine = genreCounts(movies, type);
  const heavy = new Set(mine.filter((g) => g.count >= 15).map((g) => g.id));
  const discovery = seededShuffle(
    allGenres.filter((g) => !heavy.has(g.id)),
    rand,
  ).slice(0, 2 + Math.floor(rand() * 2));
  const noun = type === 'tv' ? 'shows' : 'films';
  const plans: RowPlan[] = [
    { ...base },
    ...mine.slice(0, 5).map((g) => ({
      title: `Your genres · ${g.name} ${noun}`,
      source: { kind: 'genre', genreId: g.id } as RowSource,
      genreId: g.id,
      genreName: g.name,
    })),
    ...discovery.map((g) => ({
      title: `Discover ${g.name}`,
      badge: 'Discovery',
      source: { kind: 'genre', genreId: g.id } as RowSource,
      genreId: g.id,
      genreName: g.name,
    })),
  ];
  return seededShuffle(plans, rand);
}

/** The title the "because you liked" row is built on: one seeded 4-5 star watched title. */
export function pickLikedSeed(movies: Movie[], type: MediaType, rand: () => number): Movie | undefined {
  const liked = movies.filter((m) => m.type === type && m.watched && m.tmdbId && (m.ratings.overall ?? 0) >= 4);
  return seededPick(liked, rand);
}
