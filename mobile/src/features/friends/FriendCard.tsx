import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Art } from '@/components/media/Art';
import { Avatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { commonLabel, digestStat, type FriendDigest } from '@/lib/friendDigest';
import { colors } from '@/theme/colors';
import type { Profile } from '@/types/movie';

export function FriendCard({ profile, digest }: { profile: Profile; digest: FriendDigest | undefined }) {
  const router = useRouter();
  const name = profile.displayName || profile.username;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${name}, open shelf`}
      onPress={() => router.push(`/u/${profile.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.top}>
        <Avatar name={name} pfp={profile.pfp} size={44} />
        <View style={styles.id}>
          <Text numberOfLines={1} style={styles.name}>{name}</Text>
          <Text mono numberOfLines={1} style={styles.handle}>@{profile.username}</Text>
        </View>
      </View>
      <View style={styles.minis}>
        {digest?.minis.map((mini) => (
          <View style={styles.mini} key={mini.title}>
            {mini.coverUrl ? <Image source={{ uri: mini.coverUrl }} contentFit="cover" style={StyleSheet.absoluteFill} /> : <Art title={mini.title} showTitle={false} />}
          </View>
        ))}
        {digest ? <Text numberOfLines={1} style={styles.common}>{commonLabel(digest.common)}</Text> : null}
      </View>
      <View style={styles.foot}>
        <Text numberOfLines={1} style={[styles.footText, { flex: 1 }]}>{digest ? digestStat(digest) : 'Nothing shared yet'}</Text>
        <Text style={styles.footText}>Open shelf →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: colors.line },
  pressed: { transform: [{ scale: 0.98 }], borderColor: colors.lineStrong },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  id: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: 15, fontWeight: '600' },
  handle: { fontSize: 12, color: colors.dim },
  minis: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 51 },
  mini: { width: 34, aspectRatio: 2 / 3, borderRadius: 4, overflow: 'hidden', boxShadow: '0 6px 14px #0007' },
  common: { flex: 1, marginLeft: 6, fontSize: 12, color: colors.muted },
  foot: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  footText: { fontSize: 12, color: colors.dim },
});
