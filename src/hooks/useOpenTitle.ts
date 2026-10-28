import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { MediaType } from '@/types/movie';

/** Opens a title's detail page: /title/<movie|tv>/<tmdbId>. */
export function useOpenTitle() {
  const navigate = useNavigate();
  return useCallback((tmdbId: number, type: MediaType) => navigate(`/title/${type}/${tmdbId}`), [navigate]);
}
