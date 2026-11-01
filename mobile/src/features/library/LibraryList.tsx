import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MovieCard } from '@/components/media/MovieCard';
import { usePosterGrid } from '@/components/media/PosterGrid';
import { useScreenPadding } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { PAGE_GUTTER } from '@/theme/layout';
import type { Movie } from '@/types/movie';

import { BAR_HEIGHT, LibraryBar } from './LibraryBar';
import { LibraryHeader } from './LibraryHeader';
import { useLibrary } from './useLibrary';

const FADE = 14;

/**
 * The Library screen: one FlatList with everything above the grid in its header. The search/filter/view bar is
 * drawn over the list and follows the scroll until it reaches the top, then sticks there (a header slot holds its
 * place). One bar instance, so the search field keeps focus while you scroll.
 */
export function LibraryList() {
  const lib = useLibrary();
  const { prefs } = lib;
  const pad = useScreenPadding();
  const insets = useSafeAreaInsets();
  const { columns, cardWidth, gap } = usePosterGrid(prefs.gridSize);
  const list = prefs.viewMode === 'list';
  const numColumns = list ? 1 : columns;
  const filtering = lib.searchQuery.trim() !== '' || prefs.statusFilter !== 'all' || lib.activeFilterCount > 0;

  const scrollY = useSharedValue(0);
  const slotY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });
  const stuckAt = insets.top;
  const barStyle = useAnimatedStyle(() => ({ transform: [{ translateY: Math.max(stuckAt, slotY.get() - scrollY.get()) }] }));
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(slotY.get() - scrollY.get(), [stuckAt, stuckAt + 12], [1, 0], Extrapolation.CLAMP),
  }));

  let empty = null;
  if (lib.loading) empty = <EmptyState body="Loading your library…" />;
  else if (lib.error) empty = <EmptyState tone="warn" title="Could not load your library" body="Check your connection and reload." />;
  else if (lib.movies.length === 0) empty = <EmptyState title="Your library is empty" body="Add a title with + in the search bar to start tracking." />;
  else if (lib.mainMovies.length === 0) {
    empty = <EmptyState title="Nothing here" body={filtering ? 'No title in your library matches these filters.' : 'Everything is already shown above.'} />;
  }

  const data: Movie[] = lib.loading || lib.error ? [] : lib.mainMovies;

  return (
    <View style={styles.screen}>
      <Animated.FlatList
        // numColumns cannot change on a live list, so the key follows it.
        key={`${list ? 'list' : 'grid'}-${numColumns}`}
        data={data}
        keyExtractor={(m) => m.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
        style={styles.list}
        contentContainerStyle={pad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialNumToRender={16}
        windowSize={7}
        ListHeaderComponent={<LibraryHeader lib={lib} onBarSlot={(y) => slotY.set(pad.paddingTop + y)} />}
        ListEmptyComponent={empty}
        renderItem={({ item }) =>
          list ? (
            <MovieCard movie={item} variant="row" onQuickStatus={lib.quickStatus} />
          ) : (
            <View style={styles.cell}>
              <MovieCard movie={item} width={cardWidth} onQuickStatus={lib.quickStatus} />
            </View>
          )
        }
      />
      <View pointerEvents="none" style={[styles.statusScrim, { height: insets.top }]} />
      <Animated.View style={[styles.bar, barStyle]}>
        <LibraryBar lib={lib} />
        <Animated.View pointerEvents="none" style={[styles.fade, fadeStyle]}>
          <LinearGradient colors={[colors.ground, 'rgba(10,10,11,0)']} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground },
  list: { flex: 1, backgroundColor: colors.ground },
  cell: { marginBottom: 18 },
  bar: { position: 'absolute', top: 0, left: 0, right: 0, height: BAR_HEIGHT, zIndex: 10, paddingHorizontal: PAGE_GUTTER, justifyContent: 'center', backgroundColor: colors.ground },
  fade: { position: 'absolute', left: 0, right: 0, top: BAR_HEIGHT, height: FADE },
  statusScrim: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9, backgroundColor: colors.ground },
});
