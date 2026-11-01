import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

import { ActiveFilters } from './ActiveFilters';
import { BAR_HEIGHT } from './LibraryBar';
import { ComingSoon } from './ComingSoon';
import { ContinueWatching } from './ContinueWatching';
import { RecentlyAdded } from './RecentlyAdded';
import { StatusTypeChips } from './StatusTypeChips';
import type { useLibrary } from './useLibrary';

type Props = { lib: ReturnType<typeof useLibrary>; onBarSlot: (y: number) => void };

/**
 * Everything above the main grid: banner, the three sections, a blank slot where the sticky bar rests, then the
 * status chips and active filters. The bar itself is drawn by LibraryList so it can stay put while this scrolls away.
 */
export function LibraryHeader({ lib, onBarSlot }: Props) {
  const { prefs } = lib;
  const slot = (e: LayoutChangeEvent) => onBarSlot(e.nativeEvent.layout.y);
  return (
    <View>
      {lib.actionError ? (
        <View accessibilityRole="alert" style={styles.banner}>
          <Text style={{ fontSize: 13, color: colors.warn }}>{lib.actionError}</Text>
        </View>
      ) : null}
      <ContinueWatching movies={lib.continueWatching} />
      <ComingSoon movies={lib.comingSoon} collapsed={prefs.comingSoonCollapsed} onToggle={prefs.toggleComingSoonCollapsed} />
      <RecentlyAdded movies={lib.recentlyAdded} onQuickStatus={lib.quickStatus} />
      <View onLayout={slot} style={{ height: BAR_HEIGHT }} />
      <StatusTypeChips status={prefs.statusFilter} counts={lib.counts} onStatus={prefs.setStatusFilter} />
      <ActiveFilters />
      <View style={{ height: 14 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { marginBottom: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.line },
});
