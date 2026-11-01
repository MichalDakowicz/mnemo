import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { ActivityFeed } from '@/features/friends/ActivityFeed';
import { FindResults } from '@/features/friends/FindResults';
import { FriendCard } from '@/features/friends/FriendCard';
import { RequestRow } from '@/features/friends/RequestRow';
import { ShelfPanel } from '@/features/friends/ShelfPanel';
import { useFriendsPage } from '@/features/friends/useFriendsPage';
import { colors } from '@/theme/colors';

export default function FriendsScreen() {
  const page = useFriendsPage();
  const { friends, requests, feed } = page;

  return (
    <Screen>
      <SearchField value={page.term} onChangeText={page.setTerm} placeholder="Find people by username" style={styles.search} />

      {page.notice ? <Text accessibilityRole="alert" style={styles.notice}>{page.notice}</Text> : null}
      {page.loadError ? <Text accessibilityRole="alert" style={styles.notice}>{`Could not load your friends: ${page.loadError}`}</Text> : null}

      {page.searching ? (
        <FindResults
          term={page.searchTerm}
          results={page.results}
          loading={page.searchLoading}
          friendIds={page.friendIdSet}
          sentIds={page.sentIds}
          onAdd={(id) => void page.sendRequest(id)}
          onClose={() => page.setTerm('')}
        />
      ) : null}

      {requests.length > 0 ? (
        <View style={styles.section} accessibilityLabel="Friend requests">
          <SectionHead title="Requests" meta={`${requests.length} waiting`} />
          <View style={styles.list}>
            {requests.map((r) => (
              <RequestRow
                key={r.profile.id}
                profile={r.profile}
                meta={r.meta}
                busy={page.busyId === r.profile.id}
                onAccept={() => void page.acceptRequest(r.profile.id)}
                onDecline={() => void page.declineRequest(r.profile.id)}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section} accessibilityLabel="Your friends">
        <SectionHead title="Your friends" meta="Sorted by recent activity" />
        {!page.loading && friends.length === 0 ? (
          <EmptyState body="No friends yet. Find people by username above." />
        ) : (
          <View style={styles.list}>
            {friends.map((friend) => (
              <FriendCard key={friend.id} profile={friend} digest={page.digests.get(friend.id)} />
            ))}
          </View>
        )}
      </View>

      <ActivityFeed
        events={feed.events}
        authors={feed.authors}
        filter={feed.filter}
        onFilter={feed.setFilter}
        loading={feed.loading}
        error={feed.error}
        hasFriends={friends.length > 0}
        pending={feed.pending}
        onLoadPending={feed.loadPending}
        social={feed.social}
        socialAvailable={feed.socialAvailable}
        onReact={feed.react}
        onComment={feed.comment}
      />
      <ShelfPanel />
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { marginBottom: 24 },
  section: { marginBottom: 32 },
  list: { gap: 10 },
  notice: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warn + '66',
    color: colors.warn,
    fontSize: 13,
  },
});
