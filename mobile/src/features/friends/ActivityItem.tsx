import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { formatScore, relativeTime } from '@/lib/socialFeed';
import { colors } from '@/theme/colors';
import type { Profile } from '@/types/movie';

import type { FeedEvent } from './useFriendActivity';

type Props = { event: FeedEvent; author: Profile | undefined; children?: ReactNode };

/** One row of the activity list: avatar, "who verb title", score, age. Social controls hang below as children. */
export function ActivityItem({ event, author, children }: Props) {
  const router = useRouter();
  const name = author?.displayName || author?.username || 'Someone';
  const open = event.tmdbId != null && event.mediaType ? () => router.push(`/title/${event.mediaType}/${event.tmdbId}`) : undefined;
  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <Avatar name={name} pfp={author?.pfp} size={30} />
        <Text style={styles.text}>
          <Text accessibilityRole="link" onPress={() => router.push(`/u/${event.userId}`)} style={styles.strong}>{name}</Text>
          {` ${event.verb} `}
          <Text accessibilityRole={open ? 'link' : undefined} onPress={open} style={styles.strong}>{event.movieTitle}</Text>
        </Text>
        <View style={styles.side}>
          {event.rating != null ? <Text mono style={styles.rating}>{`★ ${formatScore(event.rating)}`}</Text> : null}
          <Text style={styles.when}>{relativeTime(event.createdAt)}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { paddingVertical: 11, borderTopWidth: 1, borderTopColor: colors.hairline },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  text: { flex: 1, minWidth: 0, fontSize: 13.5, lineHeight: 19, color: colors.soft },
  strong: { fontSize: 13.5, fontWeight: '600', color: colors.text },
  side: { alignItems: 'flex-end', gap: 2 },
  rating: { fontSize: 12.5 },
  when: { fontSize: 11, color: colors.dim },
});
