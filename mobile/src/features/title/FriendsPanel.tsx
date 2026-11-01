import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

import { PanelHead } from './PanelHead';
import type { FriendTake } from './useTitleFriends';

export function FriendsPanel({ takes }: { takes: FriendTake[] }) {
  const router = useRouter();
  if (takes.length === 0) return null;
  return (
    <View>
      <PanelHead
        title="Friends"
        right={
          <Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.push('/friends')}>
            <Text style={styles.all}>See all</Text>
          </Pressable>
        }
      />
      {takes.map(({ profile, meta, rating }) => {
        const name = profile.displayName || profile.username;
        return (
          <Pressable
            key={profile.id}
            accessibilityRole="link"
            accessibilityLabel={`${name}, ${meta}`}
            onPress={() => router.push(`/u/${profile.id}`)}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.wash }]}>
            <Avatar name={name} pfp={profile.pfp} size={34} />
            <View style={styles.text}>
              <Text numberOfLines={1} style={styles.name}>{name}</Text>
              <Text numberOfLines={1} style={styles.meta}>{meta}</Text>
            </View>
            <Text mono style={styles.value}>{rating > 0 ? `★ ${rating.toFixed(1)}` : '—'}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  all: { fontSize: 12, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 10 },
  text: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: 13.5, fontWeight: '600' },
  meta: { fontSize: 12, color: colors.dim },
  value: { fontSize: 13 },
});
