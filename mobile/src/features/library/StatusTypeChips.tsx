import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { STATUS_FILTERS } from '@/lib/statusFilter';
import { PAGE_GUTTER } from '@/theme/layout';
import type { StatusFilter } from '@/store/libraryPrefs';

const STATUS_LABEL: Record<StatusFilter, string> = { all: 'All', watchlist: 'Watchlist', watching: 'Watching', completed: 'Watched', rewatch: 'Rewatch' };

type Props = { status: StatusFilter; counts: Record<StatusFilter, number>; onStatus: (s: StatusFilter) => void };

/** Status chips only. Type (films/shows) moved into the filter sheet. */
export function StatusTypeChips({ status, counts, onStatus }: Props) {
  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.row} accessibilityLabel="Status">
        {STATUS_FILTERS.map((s) => (
          <Chip key={s} label={STATUS_LABEL[s]} count={counts[s]} active={status === s} onPress={() => onStatus(s)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 2 },
  bleed: { marginHorizontal: -PAGE_GUTTER },
  row: { paddingHorizontal: PAGE_GUTTER, gap: 6 },
});
