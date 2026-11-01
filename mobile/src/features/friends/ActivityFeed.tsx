import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pill } from '@/components/ui/Pill';
import { SectionHead } from '@/components/ui/SectionHead';
import { FEED_FILTERS, filterCountLabel, type FeedFilter, type ReactionKind } from '@/lib/socialFeed';
import type { Profile } from '@/types/movie';

import { ActivityItem } from './ActivityItem';
import { ActivitySocialBar } from './ActivitySocialBar';
import type { SocialMap } from './useActivitySocial';
import type { FeedEvent } from './useFriendActivity';

type Props = {
  events: FeedEvent[];
  authors: Map<string, Profile>;
  filter: FeedFilter;
  onFilter: (filter: FeedFilter) => void;
  loading: boolean;
  error: boolean;
  hasFriends: boolean;
  pending: number;
  onLoadPending: () => void;
  social: SocialMap;
  socialAvailable: boolean;
  onReact: (activityId: string, kind: ReactionKind) => void;
  onComment: (activityId: string, body: string) => Promise<void>;
};

export function ActivityFeed(props: Props) {
  const { events, authors, filter, loading, error, hasFriends, pending, social } = props;
  let empty = 'Nothing here yet. When friends finish or rate something, it shows up here.';
  if (!hasFriends) empty = 'Add friends to see what they are watching.';
  else if (filter !== 'all') empty = 'No activity of this kind yet.';

  return (
    <View style={styles.feed} accessibilityLabel="Activity">
      <SectionHead title="Activity" meta={events.length > 0 ? filterCountLabel(events.length) : 'Latest from your friends'} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} style={styles.filterScroll}>
        {FEED_FILTERS.map((item) => (
          <Chip key={item.key} label={item.label} active={filter === item.key} onPress={() => props.onFilter(item.key)} />
        ))}
      </ScrollView>
      {pending > 0 ? (
        <Pill
          variant="primary"
          label={pending === 1 ? '1 new update' : `${pending} new updates`}
          onPress={props.onLoadPending}
          style={styles.newPill}
        />
      ) : null}
      {error ? <EmptyState body="Could not load activity. Try again in a moment." /> : null}
      {!error && loading && hasFriends ? <EmptyState body="Loading activity…" /> : null}
      {!error && !loading && events.length === 0 ? <EmptyState body={empty} /> : null}
      <View>
        {events.map((event) => (
          <ActivityItem key={event.id} event={event} author={authors.get(event.userId)}>
            {props.socialAvailable ? (
              <ActivitySocialBar
                social={social[event.id]}
                onReact={(kind) => props.onReact(event.id, kind)}
                onComment={(body) => props.onComment(event.id, body)}
              />
            ) : null}
          </ActivityItem>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  feed: { marginBottom: 32 },
  filterScroll: { flexGrow: 0, marginBottom: 12, marginHorizontal: -16 },
  filters: { gap: 6, paddingHorizontal: 16 },
  newPill: { alignSelf: 'center', marginBottom: 12 },
});
