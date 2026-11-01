import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { GenreSlice } from '@/lib/stats';
import { barPercent } from '@/lib/statsSummary';
import { colors } from '@/theme/colors';

import { StatsBlock, StatsNote } from './StatsBlock';

export function GenresBlock({ genres }: { genres: GenreSlice[] }) {
  const top = genres.slice(0, 6);
  const max = top[0]?.count ?? 0;
  return (
    <StatsBlock title="Favourite genres" meta="By titles watched">
      {top.length === 0 ? (
        <StatsNote>No genres on these titles yet.</StatsNote>
      ) : (
        <View style={styles.bars}>
          {top.map((g) => (
            <View key={g.name} style={styles.row}>
              <Text numberOfLines={1} style={styles.name}>{g.name}</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${barPercent(g.count, max, 4)}%` }]} />
              </View>
              <Text mono style={styles.count}>{g.count}</Text>
            </View>
          ))}
        </View>
      )}
    </StatsBlock>
  );
}

const styles = StyleSheet.create({
  bars: { gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { width: 92, fontSize: 13, color: colors.soft },
  track: { flex: 1, height: 6, borderRadius: 6, backgroundColor: colors.hairline, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6, backgroundColor: colors.text },
  count: { width: 30, textAlign: 'right', fontSize: 12 },
});
