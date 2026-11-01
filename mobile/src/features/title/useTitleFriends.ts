import { useQuery } from '@tanstack/react-query';

import { useFriends } from '@/hooks/useFriends';
import { shortDay } from '@/lib/titleStatus';
import { normalizeMovie, type MovieRow } from '@/lib/normalizeMovie';
import { supabase } from '@/lib/supabase';
import type { MediaType, Profile } from '@/types/movie';

export type FriendTake = { profile: Profile; meta: string; rating: number };

/** Friends who have this title on their shelf. RLS decides which shelves we may read. */
export function useTitleFriends(type: MediaType, tmdbId: number) {
  const { friends } = useFriends();
  const ids = friends.map((f) => f.id);
  const query = useQuery({
    queryKey: ['titleFriends', type, tmdbId, ids.join(',')],
    enabled: ids.length > 0 && !!tmdbId,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<FriendTake[]> => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('tmdb_id', tmdbId)
        .eq('type', type)
        .in('user_id', ids);
      if (error) throw error;
      const byId = new Map(friends.map((f) => [f.id, f]));
      return (data as MovieRow[]).flatMap((row) => {
        const m = normalizeMovie(row);
        const profile = byId.get(m.userId);
        if (!profile) return [];
        const meta = m.inProgress
          ? 'Watching'
          : m.watched
            ? `Finished${m.completedAt ? ` · ${shortDay(m.completedAt)}` : ''}`
            : 'On watchlist';
        return [{ profile, meta, rating: m.ratings.overall ?? 0 }];
      });
    },
  });
  return { takes: query.data ?? [], error: query.error };
}
