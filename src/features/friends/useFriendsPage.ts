import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { useFriends } from '@/hooks/useFriends';
import { useMovies } from '@/hooks/useMovies';
import { useUserSearch } from '@/hooks/useUserSearch';
import { latestByUser, sortFriendsByActivity } from '@/lib/friendSort';
import { matchesFeedFilter, type FeedFilter, type ReactionKind } from '@/lib/socialFeed';

import { useActivitySocial } from './useActivitySocial';
import { useFriendActivity } from './useFriendActivity';
import { useFriendDigests } from './useFriendDigests';
import { mutualLabel, useMutualFriends } from './useMutualFriends';

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Try again.';
}

/** Everything the Friends page shows, so the page itself only composes. */
export function useFriendsPage() {
  const { user } = useAuth();
  const social = useFriends();
  const { movies } = useMovies();
  const { friends, requests } = social;

  const friendIds = useMemo(() => friends.map((f) => f.id), [friends]);
  const feed = useFriendActivity(friendIds, user?.id);
  const digests = useFriendDigests(friendIds, movies);
  const mutual = useMutualFriends(requests.map((r) => r.profile.id), friendIds);

  const [filter, setFilter] = useState<FeedFilter>('all');
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const search = useUserSearch(debounced);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(term.trim()), 250);
    return () => window.clearTimeout(t);
  }, [term]);

  const sortedFriends = useMemo(
    () => sortFriendsByActivity(friends, latestByUser(feed.events)),
    [friends, feed.events],
  );
  const events = useMemo(
    () => feed.events.filter((e) => matchesFeedFilter(e.kind, filter)),
    [feed.events, filter],
  );
  const authors = useMemo(() => new Map(friends.map((f) => [f.id, f])), [friends]);
  const activitySocial = useActivitySocial(useMemo(() => events.map((e) => e.id), [events]));

  const run = async (id: string, action: () => Promise<unknown>) => {
    setNotice(null);
    setBusyId(id);
    try {
      await action();
    } catch (error) {
      setNotice(errorText(error));
    } finally {
      setBusyId(null);
    }
  };

  const sendRequest = (id: string) =>
    run(id, async () => {
      await social.sendRequest.mutateAsync(id);
      setSentIds((prev) => new Set(prev).add(id));
    });

  const react = (activityId: string, kind: ReactionKind) =>
    activitySocial.toggleReaction.mutate({ activityId, kind }, { onError: (e) => setNotice(errorText(e)) });

  return {
    friends: sortedFriends,
    requests: requests.map((r) => ({ ...r, meta: mutualLabel(mutual[r.profile.id] ?? 0) })),
    digests,
    loading: social.loading,
    loadError: social.error ? errorText(social.error) : null,
    notice,
    busyId,
    acceptRequest: (id: string) => run(id, () => social.acceptRequest.mutateAsync(id)),
    declineRequest: (id: string) => run(id, () => social.rejectRequest.mutateAsync(id)),
    sendRequest,
    term,
    setTerm,
    searching: debounced.length > 0,
    searchTerm: debounced,
    results: search.results,
    searchLoading: search.loading || term.trim() !== debounced,
    friendIdSet: new Set(friendIds),
    sentIds,
    feed: {
      events,
      authors,
      filter,
      setFilter,
      loading: feed.loading,
      error: !!feed.error,
      pending: feed.pending,
      loadPending: feed.loadPending,
      social: activitySocial.social,
      socialAvailable: activitySocial.available,
      react,
      comment: async (activityId: string, body: string) => {
        try {
          await activitySocial.postComment.mutateAsync({ activityId, body });
        } catch (e) {
          setNotice(errorText(e));
        }
      },
    },
  };
}
