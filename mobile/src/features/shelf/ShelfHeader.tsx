import { Alert, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import type { ShelfStats } from '@/lib/shelfSummary';
import { colors } from '@/theme/colors';
import type { Profile } from '@/types/movie';

import type { Relation } from './useShelfPage';

type Props = {
  profile: Profile;
  stats: ShelfStats | null;
  relation: Relation;
  busy: boolean;
  onAdd: () => void;
  onAccept: () => void;
  onRemove: () => void;
};

export function ShelfHeader({ profile, stats, relation, busy, onAdd, onAccept, onRemove }: Props) {
  const name = profile.displayName || profile.username;

  const confirmRemove = () =>
    Alert.alert('Remove friend?', `${name} will no longer be on your friends list.`, [
      { text: 'Keep', style: 'cancel' },
      { text: 'Remove friend', style: 'destructive', onPress: onRemove },
    ]);

  return (
    <View style={styles.head}>
      <View style={styles.id}>
        <Avatar name={name} pfp={profile.pfp} size={72} />
        <View style={styles.names}>
          <Text accessibilityRole="header" tracking={-0.04} style={styles.title}>{name}</Text>
          <Text mono style={styles.handle}>@{profile.username}</Text>
        </View>
      </View>
      {stats ? (
        <View style={styles.stats}>
          <Stat value={String(stats.films)} label="Watched" />
          <Stat value={String(stats.thisYear)} label="This year" />
          <Stat value={stats.average != null ? stats.average.toFixed(1) : '—'} label="Avg score" />
        </View>
      ) : null}
      <View style={styles.actions}>
        {relation === 'none' ? <Pill variant="primary" label="Add friend" disabled={busy} onPress={onAdd} /> : null}
        {relation === 'sent' ? <Pill label="Request sent" disabled /> : null}
        {relation === 'incoming' ? <Pill variant="primary" label="Accept request" disabled={busy} onPress={onAccept} /> : null}
        {relation === 'friend' ? <Pill label="Friends" disabled={busy} onPress={confirmRemove} accessibilityLabel="Friends, tap to remove" /> : null}
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text mono tracking={-0.04} style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { gap: 20, marginBottom: 32 },
  id: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  names: { flex: 1, minWidth: 0 },
  title: { fontSize: 30, fontWeight: '600', lineHeight: 33 },
  handle: { marginTop: 6, fontSize: 13, color: colors.dim },
  stats: { flexDirection: 'row', gap: 32 },
  stat: { gap: 4 },
  statValue: { fontSize: 26, fontWeight: '300' },
  statLabel: { fontSize: 12, color: colors.dim },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
});
