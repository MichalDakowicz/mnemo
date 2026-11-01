import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

import type { QuickStat } from './useStatsPage';

/** Six overview numbers in two columns: big light value, dim label above and note below. */
export function QuickStats({ items }: { items: QuickStat[] }) {
  return (
    <View accessibilityLabel="Overview" style={styles.grid}>
      {items.map((q) => (
        <View key={q.label} style={styles.cell}>
          <Text style={styles.label}>{q.label}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit tracking={-0.045} style={styles.value}>{q.value}</Text>
          {q.note ? <Text numberOfLines={1} style={[styles.note, q.good && { color: colors.good }]}>{q.note}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: colors.line, marginBottom: 40 },
  cell: { width: '50%', paddingTop: 16, paddingRight: 12, paddingBottom: 6, minWidth: 0 },
  label: { fontSize: 12, color: colors.dim, marginBottom: 8 },
  value: { fontSize: 38, fontWeight: '300', lineHeight: 40 },
  note: { marginTop: 6, fontSize: 11.5, color: colors.dim },
});
