import { Plus, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { LayoutGrid, List } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

import { FilterSheet } from './FilterSheet';
import { RandomReel } from './RandomReel';
import { useRandomPick } from './useRandomPick';
import type { useLibrary } from './useLibrary';
import { ViewSheet } from './ViewSheet';

/** Controls row (44px) plus the 6px the sticky wrapper adds above and below it. */
export const BAR_HEIGHT = 56;

const FRAME = { borderWidth: 1, borderColor: colors.chipBorder, backgroundColor: colors.inputFill } as const;

/**
 * The Library's one bar: a search pill with the + inside it, a filter icon and a view icon. It sticks to the top
 * while the page scrolls (LibraryList positions it). Filters, layout, sort and Random open from here as sheets.
 */
export function LibraryBar({ lib }: { lib: ReturnType<typeof useLibrary> }) {
  const router = useRouter();
  const { prefs } = lib;
  const [filters, setFilters] = useState(false);
  const [view, setView] = useState(false);
  const random = useRandomPick(lib.pickPool);
  const typed = lib.searchQuery.trim();
  const n = lib.activeFilterCount;
  const ViewIcon = prefs.viewMode === 'grid' ? LayoutGrid : List;

  // + opens Discover's browse search with whatever is typed here, or empty when nothing is.
  const addTitle = () => router.navigate({ pathname: '/discover', params: typed ? { focus: 'search', q: typed } : { focus: 'search' } });
  const spinRandom = () => {
    setView(false);
    // Let the sheet finish closing before the full-screen reel opens over it.
    setTimeout(random.pick, 320);
  };

  return (
    <View style={styles.row}>
      <View style={styles.search}>
        <Search size={17} color={colors.dim} strokeWidth={1.7} />
        <TextInput
          value={lib.searchQuery}
          onChangeText={lib.setSearchQuery}
          placeholder="Search your library"
          placeholderTextColor={colors.placeholder}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          selectionColor={colors.primary}
          accessibilityLabel="Search your library"
          style={styles.input}
        />
        {lib.searchQuery ? (
          <Pressable accessibilityLabel="Clear search" hitSlop={10} onPress={() => lib.setSearchQuery('')}>
            <X size={16} color={colors.dim} />
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={typed ? `Add a title, search Discover for ${typed}` : 'Add a title, search Discover'}
          onPress={addTitle}
          style={({ pressed }) => [styles.add, pressed && { backgroundColor: colors.hover }]}>
          <Plus size={16} color={colors.text} strokeWidth={1.7} />
        </Pressable>
      </View>
      <View>
        <IconButton size={44} label={n > 0 ? `Filters, ${n} active` : 'Filters'} onPress={() => setFilters(true)} style={FRAME}>
          <SlidersHorizontal size={18} color={colors.text} />
        </IconButton>
        {n > 0 ? (
          <View pointerEvents="none" style={styles.badge}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: colors.onPrimary }}>{n}</Text>
          </View>
        ) : null}
      </View>
      <IconButton size={44} label="View options" onPress={() => setView(true)} style={FRAME}>
        <ViewIcon size={18} color={colors.text} />
      </IconButton>

      <FilterSheet
        open={filters}
        onClose={() => setFilters(false)}
        facets={lib.facets}
        activeCount={n}
        hasOwnedServices={lib.ownedServices.length > 0}
        matching={lib.mainMovies.length}
      />
      <ViewSheet
        open={view}
        onClose={() => setView(false)}
        viewMode={prefs.viewMode}
        onViewMode={prefs.setViewMode}
        sortBy={prefs.sortBy}
        sortDir={prefs.sortDir}
        onSortBy={prefs.setSortBy}
        onSortDir={(d) => d !== prefs.sortDir && prefs.toggleSortDir()}
        randomDisabled={random.empty}
        onRandom={spinRandom}
      />
      {random.spin ? <RandomReel items={random.spin.items} winner={random.spin.winner} run={random.spin.run} onAnother={random.pick} onClose={random.close} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  search: {
    flex: 1,
    minWidth: 0,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 16,
    paddingRight: 6,
    borderRadius: 999,
    backgroundColor: colors.inputFill,
    borderWidth: 1,
    borderColor: colors.fieldBorder,
  },
  input: { flex: 1, minWidth: 0, height: '100%', padding: 0, fontSize: 15, letterSpacing: -0.3, fontFamily: fonts.medium, color: colors.textBright },
  // Matro's .kind-toggle scaled to a 44px field (44 ring in 64 becomes 30 in 44): 1px #ece9e433 ring, no fill, pressed #ece9e414.
  add: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
