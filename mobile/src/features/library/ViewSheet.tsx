import { Check, Dices } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Pill } from '@/components/ui/Pill';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { Segmented } from '@/features/settings/Segmented';
import { colors } from '@/theme/colors';
import type { SortBy, SortDir, ViewMode } from '@/store/libraryPrefs';

const SORTS: [SortBy, string][] = [
  ['dateAdded', 'Recently added'],
  ['title', 'Title'],
  ['releaseDate', 'Release date'],
  ['rating', 'Your rating'],
  ['director', 'Director'],
  ['runtime', 'Runtime'],
];

type Props = {
  open: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  onViewMode: (v: ViewMode) => void;
  sortBy: SortBy;
  sortDir: SortDir;
  onSortBy: (s: SortBy) => void;
  onSortDir: (d: SortDir) => void;
  randomDisabled: boolean;
  onRandom: () => void;
};

/**
 * Layout, sort and Random in one place, opened from the bar's view icon. Poster size is deliberately not here:
 * it lives in Settings only.
 */
export function ViewSheet(p: Props) {
  return (
    <Sheet open={p.open} onClose={p.onClose} title="View">
      <View style={styles.body}>
        <Text style={styles.legend}>Layout</Text>
        <Segmented
          label="Layout"
          value={p.viewMode}
          options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]}
          onChange={p.onViewMode}
        />
        <Text style={[styles.legend, { marginTop: 8 }]}>Sort by</Text>
        <View style={{ gap: 2 }}>
          {SORTS.map(([value, label]) => {
            const on = p.sortBy === value;
            return (
              <Pressable
                key={value}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: on }}
                onPress={() => p.onSortBy(value)}
                style={({ pressed }) => [styles.row, on && { backgroundColor: colors.active }, pressed && { backgroundColor: colors.hover }]}>
                <Text style={{ flex: 1, fontSize: 14, color: on ? colors.textBright : colors.soft }}>{label}</Text>
                {on ? <Check size={16} color={colors.textBright} /> : null}
              </Pressable>
            );
          })}
        </View>
        <Segmented
          label="Sort direction"
          value={p.sortDir}
          options={[{ value: 'desc', label: 'Descending' }, { value: 'asc', label: 'Ascending' }]}
          onChange={p.onSortDir}
        />
        <View style={styles.foot}>
          <Pill label="Pick random" icon={<Dices size={16} color={colors.text} />} disabled={p.randomDisabled} onPress={p.onRandom} height={42} />
          <Pill variant="primary" label="Done" height={42} onPress={p.onClose} />
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: 10, paddingHorizontal: 8, paddingBottom: 8 },
  legend: { fontSize: 11, fontWeight: '600', letterSpacing: 0.66, textTransform: 'uppercase', color: colors.dim },
  row: { height: 44, paddingHorizontal: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 },
});
