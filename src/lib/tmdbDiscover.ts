// TMDB list endpoints for Discover. Unlike lib/tmdb's getters these do not fetch
// credits per title (a feed of ~8 rows would be 150+ requests), and they resolve
// genre ids to names so cards can show "2026 · Drama · Film".
import type { RowSource } from '@/lib/discoveryPlan';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';
import type { MediaType } from '@/types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  Accept: 'application/json',
};

async function get(path: string, params: Record<string, string | number> = {}): Promise<any> {
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
  const url = `${BASE_URL}${path}${qs ? `?${qs}` : ''}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      await new Promise((r) => setTimeout(r, 400 * 2 ** attempt));
      continue;
    }
    throw new Error(`TMDB ${res.status} for ${path}`);
  }
}

const genreMaps: Partial<Record<MediaType, Promise<Map<number, string>>>> = {};

/** id -> name for one media type, fetched once per session. */
export function genreMap(type: MediaType): Promise<Map<number, string>> {
  genreMaps[type] ??= get(`/genre/${type}/list`)
    .then((d) => new Map<number, string>((d.genres ?? []).map((g: { id: number; name: string }) => [g.id, g.name])))
    .catch(() => {
      delete genreMaps[type];
      return new Map<number, string>();
    });
  return genreMaps[type]!;
}

function toItem(raw: any, type: MediaType, names: Map<number, string>): DiscoverItem {
  return {
    tmdbId: raw.id,
    type,
    title: raw.title || raw.name || '',
    releaseDate: raw.release_date || raw.first_air_date || null,
    coverUrl: raw.poster_path ? `${IMAGE_URL}${raw.poster_path}` : null,
    voteAverage: raw.vote_average ?? 0,
    overview: raw.overview ?? '',
    genres: ((raw.genre_ids as number[] | undefined) ?? []).map((id) => names.get(id)).filter((n): n is string => !!n),
  };
}

async function items(path: string, type: MediaType, params: Record<string, string | number> = {}) {
  const [data, names] = await Promise.all([get(path, params), genreMap(type)]);
  const list: DiscoverItem[] = ((data.results ?? []) as any[]).filter((r) => r.id && (r.title || r.name)).map((r) => toItem(r, type, names));
  return { items: list, totalPages: (data.total_pages as number) ?? 1 };
}

export const fetchTrending = (type: MediaType) => items(`/trending/${type}/week`, type).then((r) => r.items);

export const fetchCategory = (type: MediaType, category: string) => items(`/${type}/${category}`, type).then((r) => r.items);

export const fetchSimilar = (type: MediaType, tmdbId: number) => items(`/${type}/${tmdbId}/similar`, type).then((r) => r.items);

/** One page of a genre's titles, most popular first (what Radar's genre page paged through). */
export function fetchGenrePage(type: MediaType, genreId: number, page = 1) {
  return items(`/discover/${type}`, type, { with_genres: genreId, sort_by: 'popularity.desc', 'vote_count.gte': 100, page });
}

export function fetchRowSource(type: MediaType, source: RowSource): Promise<DiscoverItem[]> {
  if (source.kind === 'trending') return fetchTrending(type);
  if (source.kind === 'category') return fetchCategory(type, source.category);
  return fetchGenrePage(type, source.genreId).then((r) => r.items);
}

/** First-air-date window for series premieres (YYYY-MM-DD), most popular first, up to 3 pages. */
export async function fetchTvPremieres(gte: string, lte: string): Promise<DiscoverItem[]> {
  const params = { sort_by: 'popularity.desc', 'first_air_date.gte': gte, 'first_air_date.lte': lte, include_adult: 'false' };
  const first = await items('/discover/tv', 'tv', { ...params, page: 1 });
  const pages = Math.min(first.totalPages, 3);
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => items('/discover/tv', 'tv', { ...params, page: i + 2 })));
  const seen = new Set<number>();
  return [first, ...rest]
    .flatMap((r) => r.items)
    .filter((i) => i.releaseDate && !seen.has(i.tmdbId) && !!seen.add(i.tmdbId));
}
