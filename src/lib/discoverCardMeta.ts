import type { DiscoverItem } from './toDiscoveryMovie';

/** "2026 · Drama · Film" under a Discover card. Parts TMDB did not give are left out. */
export function discoverMeta(item: Pick<DiscoverItem, 'type' | 'releaseDate' | 'genres'>): string {
  const year = item.releaseDate?.slice(0, 4) ?? '';
  return [/^\d{4}$/.test(year) ? year : '', item.genres[0] ?? '', item.type === 'tv' ? 'Series' : 'Film']
    .filter(Boolean)
    .join(' · ');
}
