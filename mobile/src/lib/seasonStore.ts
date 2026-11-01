import AsyncStorage from '@react-native-async-storage/async-storage';

import { parseSeasonEntry, type SeasonEntry } from './seasonCache';

// Device-local episode cache. Read during render, so reads are synchronous: an in-memory
// map filled from AsyncStorage once at startup (hydrateSeasonStore) and written through.
const PREFIX = 'mnemo-season:';
const memory = new Map<string, string>();

function seasonKey(tmdbId: number, season: number): string {
  return `${PREFIX}${tmdbId}:${season}`;
}

/** Loads every stored season into memory. Call once before the first screen renders. */
export async function hydrateSeasonStore(): Promise<void> {
  try {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(PREFIX));
    const pairs = await AsyncStorage.multiGet(keys);
    for (const [key, value] of pairs) if (value != null) memory.set(key, value);
  } catch (error) {
    console.warn('Season cache hydrate failed:', error);
  }
}

export function readSeasonEntry(tmdbId: number | null, season: number | null): SeasonEntry | null {
  if (!tmdbId || season == null) return null;
  return parseSeasonEntry(memory.get(seasonKey(tmdbId, season)));
}

export function writeSeasonEntry(tmdbId: number | null, season: number | null, entry: SeasonEntry): void {
  if (!tmdbId || season == null) return;
  const key = seasonKey(tmdbId, season);
  const value = JSON.stringify(entry);
  memory.set(key, value);
  AsyncStorage.setItem(key, value).catch((error) => console.warn('Season cache write failed:', error));
}
