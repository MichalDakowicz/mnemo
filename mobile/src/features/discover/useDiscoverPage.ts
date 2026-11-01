import { useState } from 'react';

import { useUserSettings } from '@/hooks/useUserSettings';
import { useToday } from '@/hooks/useToday';
import type { MediaType } from '@/types/movie';

import { useBrowseSearch } from './useBrowseSearch';
import { useCalendarPanel } from './useCalendarPanel';
import { useCardActions } from './useCardActions';
import { useDiscoveryFeed } from './useDiscoveryFeed';
import { useGenreView } from './useGenreView';
import { useLeavingSoon } from './useLeavingSoon';

/** Everything the Discover page shows, composed from the feature hooks. `onFocusSearch` scrolls the search field into view when the dock's Search item asks for it. */
export function useDiscoverPage(onFocusSearch?: () => void) {
  const { settings } = useUserSettings();
  const country = settings.watchProviderCountry;
  const today = useToday();
  const [kind, setKind] = useState<MediaType>('movie');
  const [genre, setGenre] = useState<{ id: number; name: string } | null>(null);
  const [reroll, setReroll] = useState(0);

  const actions = useCardActions(country);
  const search = useBrowseSearch(onFocusSearch);
  const leaving = useLeavingSoon(country, settings.ownedServices, actions.movies, today);
  const calendarInputs = { type: kind, today, country, mine: actions.mine, leaving };
  const release = useCalendarPanel({ which: 'release', ...calendarInputs });
  const leavingPanel = useCalendarPanel({ which: 'leaving', ...calendarInputs });

  const feed = useDiscoveryFeed(kind, reroll, actions.movies, actions.ready, today);
  const rows = feed.data?.pages.flat() ?? [];
  // Lifted here (not in GenreView) so the page list can load more when scrolled to the end.
  const genreView = useGenreView(kind, genre?.id ?? null);

  return {
    kind,
    setKind: (k: MediaType) => {
      setKind(k);
      setGenre(null);
    },
    genre,
    genreView,
    openGenre: (g: { id: number; name: string }) => {
      setGenre(g);
      search.clear();
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

export type DiscoverPageModel = ReturnType<typeof useDiscoverPage>;
