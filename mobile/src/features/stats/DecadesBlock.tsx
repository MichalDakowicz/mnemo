import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { DecadeSlice } from '@/lib/stats';
import { decadeHeight } from '@/lib/statsView';
import { colors } from '@/theme/colors';

import { StatsBlock, StatsNote } from './StatsBlock';

/** The text colour at 35%, the web's #ece9e459: every decade but the latest. */
const DECADE_BAR = 'rgba(236,233,228,0.35)';

export function DecadesBlock({ decades }: { decades: DecadeSlice[] }) {
  const max = Math.max(0, ...decades.map((d) => d.count));
  return (
    <StatsBlock title="Release eras" meta="By decade">
      {decades.length === 0 ? (
        <StatsNote>No release dates on these titles yet.</StatsNote>
      ) : (
        <View style={styles.row}>
          {decades.map((d, i) => (
            <View key={d.decade} style={styles.col}>
              <Text mono style={styles.n}>{d.count}</Text>
              <View style={[styles.bar, i === decades.length - 1 && { backgroundColor: colors.text }, { height: `${decadeHeight(d.count, max)}%` }]} />
              <Text numberOfLines={1} style={styles.label}>{d.decade}</Text>
            </View>
          ))}
        </View>
      )}
    </StatsBlock>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 170 },
  col: { flex: 1, minWidth: 0, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  n: { fontSize: 10.5, color: colors.dim },
  bar: { width: '100%', maxWidth: 40, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, backgroundColor: DECADE_BAR },
  label: { fontSize: 11, color: colors.soft },
});
