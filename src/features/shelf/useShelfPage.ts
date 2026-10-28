import { useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { useFriends, usePublicFriends } from '@/hooks/useFriends';
import { personalScore } from '@/lib/personalScore';
import { compareTaste, compareHeadline, compareSubtitle } from '@/lib/compareTaste';
import { sharedWatchlist } from '@/lib/sharedWatchlist';
import { inProgressTitles, recentlyLogged, shelfStats } from '@/lib/shelfSummary';

import { toRatedTitles, useFriendLibraries } from './useFriendLibraries';

export type Relation = 'self' | 'friend' | 'incoming' | 'sent' | 'none';

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Try again.';
}

/** A friend's (or your own) shelf: profile, library, comparison with you, and the friend actions. */
export function useShelfPage(userId: string | undefined) {
  const { user } = useAuth();
  const libs = useFriendLibraries(userId);
  const social = useFriends();
  const { friends: theirFriends } = usePublicFriends(libs.canView ? userId : undefined);
  const [notice, setNotice] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const isSelf = !!user && user.id === userId;
  let relation: Relation = 'none';
  if (isSelf) relation = 'self';
  else if (social.friends.some((f) => f.id === userId)) relation = 'friend';
  else if (social.requests.some((r) => r.profile.id === userId)) relation = 'incoming';
  else if (sent) relation = 'sent';

  const { theirs, mine } = libs;
  const view = useMemo(() => {
    const comparing = !isSelf && theirs.length > 0;
    const rated = comparing ? compareTaste(toRatedTitles(mine), toRatedTitles(theirs)) : null;
    return {
      stats: shelfStats(theirs, (m) => personalScore(m.ratings)),
      recent: recentlyLogged(theirs, 12),
      inProgress: inProgressTitles(theirs, 8),
      comparison: rated,
      shared: comparing ? sharedWatchlist(mine, theirs) : [],
    };
  }, [theirs, mine, isSelf]);

  const run = async (action: () => Promise<unknown>) => {
    setNotice(null);
    setBusy(true);
    try {
      await action();
    } catch (error) {
      setNotice(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  const firstName = (libs.profile?.displayName || libs.profile?.username || 'They').split(' ')[0];
  return {
    ...libs,
    ...view,
    relation,
    busy,
    notice,
    theirFriends,
    headline: view.comparison ? compareHeadline(firstName, view.comparison) : '',
    subtitle: view.comparison ? compareSubtitle(view.comparison) : '',
    addFriend: () =>
      run(async () => {
        await social.sendRequest.mutateAsync(userId!);
        setSent(true);
      }),
    accept: () => run(() => social.acceptRequest.mutateAsync(userId!)),
    removeFriend: () => run(() => social.removeFriend.mutateAsync(userId!)),
  };
}
