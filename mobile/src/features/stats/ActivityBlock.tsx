import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { activityVerb } from '@/lib/activityLabel';
import { whenLabel } from '@/lib/statsSummary';
import { colors } from '@/theme/colors';
import type { ActivityEvent } from '@/types/movie';

import { StatsBlock } from './StatsBlock';

/** Radar's "Recent activity" list: what you did to which title, and when. */
export function ActivityBlock({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) return null;
  return (
    <StatsBlock title="Recent activity">
      <View>
        {events.map((e, i) => (
          <View key={e.id} style={[styles.row, i > 0 && styles.divider]}>
            <Text style={styles.what}>
              {activityVerb(e)} <Text style={styles.title}>{e.movieTitle}</Text>
            </Text>
            <Text mono style={styles.when}>{whenLabel(e.createdAt)}</Text>
          </View>
        ))}
      </View>
    </StatsBlock>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 12, paddingVertical: 10 },
  divider: { borderTopWidth: 1, borderTopColor: colors.hairline },
  what: { flex: 1, minWidth: 0, fontSize: 13, color: colors.soft },
  title: { fontSize: 13, fontWeight: '600', color: colors.text },
  when: { fontSize: 11, color: colors.dim },
});
