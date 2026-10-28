import { useState } from 'react';

import { useUserSettings } from '@/hooks/useUserSettings';
import { useToday } from '@/hooks/useToday';
import type { MediaType } from '@/types/movie';

import { useBrowseSearch } from './useBrowseSearch';
import { useCalendarPanel } from './useCalendarPanel';
import { useCardActions } from './useCardActions';
import { useDiscoveryFeed } from './useDiscoveryFeed';
import { useLeavingSoon } from './useLeavingSoon';

/** Everything the Discover page shows, composed from the feature hooks. */
export function useDiscoverPage() {
  const { settings } = useUserSettings();
  const country = settings.watchProviderCountry;
  const today = useToday();
  const [kind, setKind] = useState<MediaType>('movie');
  const [genre, setGenre] = useState<{ id: number; name: string } | null>(null);
  const [reroll, setReroll] = useState(0);

  const actions = useCardActions(country);
  const search = useBrowseSearch();
  const leaving = useLeavingSoon(country, settings.ownedServices, actions.movies, today);
  const calendarInputs = { type: kind, today, country, mine: actions.mine, leaving };
  const release = useCalendarPanel({ which: 'release', ...calendarInputs });
  const leavingPanel = useCalendarPanel({ which: 'leaving', ...calendarInputs });

  const feed = useDiscoveryFeed(kind, reroll, actions.movies, actions.ready, today);
  const rows = feed.data?.pages.flat() ?? [];

  return {
    kind,
    setKind: (k: MediaType) => {
      setKind(k);
      setGenre(null);
    },
    genre,
    openGenre: (g: { id: number; name: string }) => {
      setGenre(g);
      search.clear();
      window.scrollTo({ top: 0 });
    },
    closeGenre: () => setGenre(null),
    actions,
    search,
    calendars: [release, leavingPanel],
    rows,
    feedLoading: feed.isLoading || !actions.ready,
    feedError: feed.isError,
    loadingMore: feed.isFetchingNextPage,
    hasMore: !!feed.hasNextPage,
    loadMore: () => void feed.fetchNextPage(),
    reshuffle: () => setReroll((n) => n + 1),
  };
}
