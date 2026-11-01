import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import type { CreditFilter, CreditSort } from '@/lib/personCredits';
import { colors } from '@/theme/colors';
import { PAGE_GUTTER } from '@/theme/layout';

import type { usePerson } from './usePerson';

type P = ReturnType<typeof usePerson>;

const FILTERS: [CreditFilter, string][] = [
  ['all', 'All'],
  ['in', 'In my library'],
  ['out', 'Not in library'],
];
const SORTS: [CreditSort, string][] = [
  ['new', 'Newest'],
  ['old', 'Oldest'],
  ['rating', 'Your rating'],
];

const rail = { marginHorizontal: -PAGE_GUTTER };
const railContent = { paddingHorizontal: PAGE_GUTTER, gap: 8 };

/** The Filmography heading and its controls: department, library filter, sort. The grid itself is the screen's list. */
export function FilmographyBar({ p }: { p: P }) {
  return (
    <View style={styles.bar}>
      <Text accessibilityRole="header" tracking={-0.035} style={styles.title}>
        Filmography
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={rail} contentContainerStyle={railContent}>
        {p.departments.map((d) => (
          <Chip key={d.name} label={d.name} count={d.count} active={p.department === d.name} onPress={() => p.setDept(d.name)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={rail} contentContainerStyle={railContent}>
        {FILTERS.map(([k, label]) => (
          <Chip key={k} label={label} active={p.filter === k} onPress={() => p.setFilter(k)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={rail} contentContainerStyle={railContent}>
        {SORTS.map(([k, label]) => (
          <Chip key={k} label={label} active={p.sort === k} onPress={() => p.setSort(k)} />
        ))}
      </ScrollView>
    </View>
  );
}

export function filmographyEmpty(p: P): string {
  if (p.filter === 'in') return 'None of these are in your library yet.';
  if (p.filter === 'out') return 'You already have all of these.';
  return 'TMDB lists no credits for this person.';
}

export function FilmographyFoot({ p }: { p: P }) {
  const empty = p.list.length === 0;
  return (
    <View style={{ gap: 10 }}>
      {empty ? <Text style={styles.empty}>{filmographyEmpty(p)}</Text> : null}
      {p.adder.error ? (
        <Text accessibilityRole="alert" style={styles.empty}>
          {p.adder.error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '600' },
  empty: { fontSize: 13, color: colors.dim, textAlign: 'center', paddingVertical: 24 },
});
