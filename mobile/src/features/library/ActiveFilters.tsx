import { X } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { MY_SERVICES_KEY } from '@/lib/serviceFilter';
import { colors } from '@/theme/colors';
import { PAGE_GUTTER } from '@/theme/layout';
import { useLibraryPrefs } from '@/store/libraryPrefs';

type Item = { key: string; label: string; remove: () => void };

/** What is narrowing the list right now, as removable chips under the status row. Renders nothing when no filter is on. */
export function ActiveFilters() {
  const p = useLibraryPrefs();
  const items: Item[] = [
    ...(p.typeFilter !== 'all' ? [{ key: 'type', label: p.typeFilter === 'movie' ? 'Films' : 'Shows', remove: () => p.setTypeFilter('all') }] : []),
    ...p.selectedServices.map((v) => ({ key: `s:${v}`, label: v === MY_SERVICES_KEY ? 'My services' : v, remove: () => p.toggleService(v) })),
    ...p.selectedGenres.map((v) => ({ key: `g:${v}`, label: v, remove: () => p.toggleGenre(v) })),
    ...p.selectedDirectors.map((v) => ({ key: `d:${v}`, label: v, remove: () => p.toggleDirector(v) })),
    ...p.selectedYears.map((v) => ({ key: `y:${v}`, label: v, remove: () => p.toggleYear(v) })),
  ];
  if (items.length === 0) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" accessibilityLabel="Active filters" style={styles.bleed} contentContainerStyle={styles.row}>
      {items.map((i) => (
        <Pressable key={i.key} accessibilityRole="button" accessibilityLabel={`Remove filter ${i.label}`} onPress={i.remove} style={styles.chip}>
          <Text style={{ fontSize: 12 }}>{i.label}</Text>
          <X size={13} color={colors.soft} strokeWidth={2} />
        </Pressable>
      ))}
      <Pressable accessibilityRole="button" onPress={p.clearFilters} style={styles.clear}>
        <Text style={{ fontSize: 12, color: colors.dim }}>Clear all</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -PAGE_GUTTER, marginTop: 10 },
  row: { paddingHorizontal: PAGE_GUTTER, gap: 6, alignItems: 'center' },
  chip: { height: 28, paddingLeft: 11, paddingRight: 8, borderRadius: 999, backgroundColor: colors.active, flexDirection: 'row', alignItems: 'center', gap: 5 },
  clear: { height: 28, paddingHorizontal: 6, justifyContent: 'center' },
});
