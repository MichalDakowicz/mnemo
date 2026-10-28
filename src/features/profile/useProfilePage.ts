import { useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { useMovies } from '@/hooks/useMovies';
import { useProfile } from '@/hooks/useProfile';
import { useUserSettings } from '@/hooks/useUserSettings';
import { personalScore } from '@/lib/personalScore';
import { ratingCurve } from '@/lib/ratingCurve';
import { ratingDistribution } from '@/lib/ratingDistribution';
import { inProgressTitles, recentlyLogged, shelfStats } from '@/lib/shelfSummary';
import { publicShelfUrl } from '@/lib/shelfLink';

import { useFavoritesEditor } from './useFavoritesEditor';
import { useProfileEdit } from './useProfileEdit';
import { useRandomPick } from './useRandomPick';
import { useRankedYears } from './useRankedYears';

// Everything the Profile screen shows: the signed-in user's own profile row, library and settings.
export function useProfilePage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const { movies, loading: moviesLoading } = useMovies();
  const { settings } = useUserSettings();

  const edit = useProfileEdit(profile);
  const favs = useFavoritesEditor(profile, movies);
  const pick = useRandomPick(movies, settings.ownedServices);
  const ranked = useRankedYears(movies);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => shelfStats(movies, (m) => personalScore(m.ratings)), [movies]);
  const recent = useMemo(() => recentlyLogged(movies, 12), [movies]);
  const inProgress = useMemo(() => inProgressTitles(movies, 4), [movies]);
  const ratings = useMemo(() => {
    const dist = ratingDistribution(movies);
    return { ...dist, curve: ratingCurve(dist.points) };
  }, [movies]);

  const share = async () => {
    if (!user) return;
    try {
      await navigator.clipboard.writeText(publicShelfUrl(user.id));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy your shelf link', publicShelfUrl(user.id));
    }
  };

  const name = profile?.displayName || profile?.username || user?.email || 'You';

  return {
    profile,
    name,
    handle: profile?.username ? `@${profile.username}` : (user?.email ?? ''),
    loading: profileLoading || moviesLoading,
    movies,
    stats,
    recent,
    inProgress,
    ratings,
    edit,
    favs,
    pick,
    ranked,
    share,
    copied,
  };
}
