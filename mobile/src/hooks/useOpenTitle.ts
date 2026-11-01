import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import type { MediaType } from '@/types/movie';

/** Opens a title's detail screen: /title/<movie|tv>/<tmdbId>. */
export function useOpenTitle() {
  const router = useRouter();
  return useCallback((tmdbId: number, type: MediaType) => router.push(`/title/${type}/${tmdbId}`), [router]);
}
