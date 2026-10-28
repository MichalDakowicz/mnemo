import { parseSeasonEntry, type SeasonEntry } from './seasonCache';

// Device-local episode cache. Read during render, so it has to be synchronous: localStorage.
function seasonKey(tmdbId: number, season: number): string {
  return `mnemo-season:${tmdbId}:${season}`;
}

export function readSeasonEntry(tmdbId: number | null, season: number | null): SeasonEntry | null {
  if (!tmdbId || season == null) return null;
  try {
    return parseSeasonEntry(localStorage.getItem(seasonKey(tmdbId, season)) ?? undefined);
  } catch {
    return null;
  }
}

export function writeSeasonEntry(tmdbId: number | null, season: number | null, entry: SeasonEntry): void {
  if (!tmdbId || season == null) return;
  try {
    localStorage.setItem(seasonKey(tmdbId, season), JSON.stringify(entry));
  } catch (error) {
    console.warn('Season cache write failed:', error);
  }
}
