import { View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { Pill } from '@/components/ui/Pill';

import { CalendarPanel } from './CalendarPanel';
import type { DiscoverPageModel } from './useDiscoverPage';

/** The top of the browsing state: both calendars, then the feed's loading or error note. The rows are the page list's items. */
export function DiscoverFeed({ page }: { page: DiscoverPageModel }) {
  return (
    <View accessibilityLabel="Release and leaving calendars" style={{ marginTop: 26 }}>
      {page.calendars.map((panel) => (
        <CalendarPanel key={panel.which} panel={panel} actions={page.actions} />
      ))}
      {page.feedLoading && page.rows.length === 0 ? <EmptyState body="Loading your discover feed…" /> : null}
      {page.feedError && page.rows.length === 0 ? (
        <View style={{ alignItems: 'center' }}>
          <EmptyState tone="warn" title="Could not load the discover feed" body="TMDB did not answer. Check your connection and try again." />
          <Pill label="Try again" height={44} onPress={page.reshuffle} />
        </View>
      ) : null}
    </View>
  );
}
