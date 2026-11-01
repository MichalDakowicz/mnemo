import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import type { Profile } from '@/types/movie';

type Props = { profile: Profile; meta: string; busy: boolean; onAccept: () => void; onDecline: () => void };

export function RequestRow({ profile, meta, busy, onAccept, onDecline }: Props) {
  const name = profile.displayName || profile.username;
  return (
    <View style={styles.row}>
      <View style={styles.top}>
        <Avatar name={name} pfp={profile.pfp} size={44} />
        <View style={styles.who}>
          <Text numberOfLines={1} style={styles.name}>{name}</Text>
          <Text numberOfLines={1} style={styles.meta}>@{profile.username}{meta ? ` · ${meta}` : ''}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pill label="Accept" variant="primary" disabled={busy} onPress={onAccept} />
        <Pill label="Decline" disabled={busy} onPress={onDecline} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.line },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  who: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: 14, fontWeight: '600' },
  meta: { fontSize: 12, color: colors.dim },
  actions: { flexDirection: 'row', gap: 8 },
});
