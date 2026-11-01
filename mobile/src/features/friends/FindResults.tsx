import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pill } from '@/components/ui/Pill';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import type { Profile } from '@/types/movie';

type Props = {
  term: string;
  results: Profile[];
  loading: boolean;
  friendIds: Set<string>;
  sentIds: Set<string>;
  onAdd: (id: string) => void;
  onClose: () => void;
};

export function FindResults({ term, results, loading, friendIds, sentIds, onAdd, onClose }: Props) {
  const router = useRouter();
  return (
    <View style={styles.section} accessibilityLabel="Search results">
      <SectionHead
        title={`Results for “${term}”`}
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={8} onPress={onClose}>
            <Text style={styles.clear}>Clear</Text>
          </Pressable>
        }
      />
      {loading && results.length === 0 ? <EmptyState body="Searching…" /> : null}
      {!loading && results.length === 0 ? <EmptyState body="Nobody with that username." /> : null}
      <View style={styles.list}>
        {results.map((profile) => {
          const name = profile.displayName || profile.username;
          const isFriend = friendIds.has(profile.id);
          const sent = sentIds.has(profile.id);
          return (
            <View style={styles.row} key={profile.id}>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`Open ${name}'s shelf`}
                onPress={() => router.push(`/u/${profile.id}`)}
                style={styles.who}>
                <Avatar name={name} pfp={profile.pfp} size={44} />
                <View style={styles.names}>
                  <Text numberOfLines={1} style={styles.name}>{name}</Text>
                  <Text numberOfLines={1} style={styles.meta}>@{profile.username}</Text>
                </View>
              </Pressable>
              {isFriend ? (
                <Text style={styles.meta}>Friends</Text>
              ) : (
                <Pill variant="primary" label={sent ? 'Request sent' : 'Add friend'} disabled={sent} onPress={() => onAdd(profile.id)} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  clear: { fontSize: 13, color: colors.muted },
  list: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.line },
  who: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 },
  names: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: 14, fontWeight: '600' },
  meta: { fontSize: 12, color: colors.dim },
});
