import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { buildDigests, type DigestRow, type FriendDigest } from '@/lib/friendDigest';
import { titleKey } from '@/lib/compareTaste';
import { supabase } from '@/lib/supabase';
import type { Movie } from '@/types/movie';

/**
 * What a friend card shows without opening the shelf: watched count, average
 * score, titles in common, a few posters. One narrow `in` query for every
 * friend; a friend who has gone private contributes no rows (RLS), so their
 * card simply shows no numbers.
 */
export function useFriendDigests(friendIds: string[], mine: Movie[]): Map<string, FriendDigest> {
  const key = [...friendIds].sort().join(',');
  const query = useQuery({
    queryKey: ['friendDigestRows', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('user_id, tmdb_id, type, title, cover_url, watched, completed_at, added_at, ratings')
        .in('user_id', friendIds);
      if (error) throw error;
      return data as DigestRow[];
    },
    enabled: friendIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  return useMemo(() => {
    const myKeys = new Set(mine.map((m) => titleKey(m.tmdbId, m.type, m.title)));
    return buildDigests(query.data ?? [], myKeys);
  }, [query.data, mine]);
}
