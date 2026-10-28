import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { useMovies } from '@/hooks/useMovies';

import { runMetadataRefresh } from './runMetadataRefresh';

export function useMetadataRefresh() {
  const { user } = useAuth();
  const { movies } = useMovies();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const stopRef = useRef(false);
  const refreshing = progress !== null;
  const withTmdb = movies.filter((m) => m.tmdbId != null).length;

  const start = async () => {
    if (!user || refreshing) return;
    stopRef.current = false;
    setNote(null);
    setProgress({ done: 0, total: withTmdb });
    try {
      const result = await runMetadataRefresh(user.id, {
        onProgress: (done, total) => setProgress({ done, total }),
        isStopped: () => stopRef.current,
      });
      const failed = result.failed > 0 ? ` · ${result.failed} failed` : '';
      setNote(result.stopped ? `Stopped after ${result.ok} titles` : `Updated ${result.ok} titles just now${failed}`);
      void queryClient.invalidateQueries({ queryKey: ['movies'] });
    } catch (error) {
      setNote(error instanceof Error ? error.message : 'Refresh failed');
    } finally {
      setProgress(null);
    }
  };

  return { start, stop: () => { stopRef.current = true; }, refreshing, progress, note, withTmdb };
}
