import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { StatusSlice } from '@/lib/stats';
import { plural, statusLabel } from '@/lib/statsView';
import { colors } from '@/theme/colors';

import { StatsBlock, StatsNote } from './StatsBlock';

/** The watchlist swatch: a darker step of the same warm grey ramp (web #5e5b57). */
const WATCHLIST_SWATCH = '#5e5b57';

function swatch(name: string): string {
  if (name === 'Completed') return colors.text;
  if (name === 'Watching') return colors.muted;
  return WATCHLIST_SWATCH;
}

type Props = { rows: StatusSlice[]; total: number; mix: string };

export function StatusBlock({ rows, total, mix }: Props) {
  return (
    <StatsBlock title="Library by status" meta={plural(total, 'title')}>
      <View style={styles.bar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {rows.map((s) => (
          <View key={s.name} style={{ flex: s.count, backgroundColor: swatch(s.name) }} />
        ))}
      </View>
      <View style={styles.list}>
        {rows.map((s) => (
          <View key={s.name} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: swatch(s.name) }]} />
            <Text style={styles.label}>{statusLabel(s.name)}</Text>
            <Text mono style={{ fontSize: 13 }}>{s.count}</Text>
          </View>
        ))}
      </View>
      <StatsNote>{mix}</StatsNote>
    </StatsBlock>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', height: 10, borderRadius: 10, overflow: 'hidden', gap: 2, marginBottom: 16 },
  list: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12, columnGap: 20 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 9, width: '47%' },
  dot: { width: 10, height: 10, borderRadius: 3 },
  label: { flex: 1, fontSize: 13, color: colors.soft },
});
