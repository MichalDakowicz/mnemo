import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { useScreenPadding } from '@/components/layout/Screen';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

import { DiscoverFeed } from './DiscoverFeed';
import { DiscoverHero } from './DiscoverHero';
import { DiscoverRow } from './DiscoverRow';
import { GenreView } from './GenreView';
import { LoadMoreButton } from './LoadMoreButton';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import type { DiscoverRow as Row } from './useDiscoveryFeed';
import { useDiscoverPage } from './useDiscoverPage';
import { useDiscoverScroll } from './useDiscoverScroll';

const NO_ROWS: Row[] = [];

/** Discover: trending reel, universal search, release and leaving calendars, discovery rows. */
export function DiscoverPage() {
  const pad = useScreenPadding();
  const { listRef, onSearchLayout, scrollToSearch } = useDiscoverScroll<Row>();
  const page = useDiscoverPage(scrollToSearch);
  const { search, genre, genreView } = page;
  const browsing = !search.active && !genre;

  const summary = search.active
    ? search.loading
      ? 'Searching TMDB…'
      : `${search.all.filter((r) => r.resultType === 'movie' || r.resultType === 'tv').length} titles · ${search.all.filter((r) => r.resultType === 'person').length} people on TMDB`
    : 'Search TMDB, then add anything straight to your watchlist';

  const onEnd = () => {
    if (browsing) {
      if (page.hasMore && !page.loadingMore) page.loadMore();
    } else if (!search.active && genreView.hasMore && !genreView.loadingMore) {
      genreView.loadMore();
    }
  };

  const header = (
    <View>
      <DiscoverHero key={page.kind} type={page.kind} actions={page.actions} />
      <View onLayout={onSearchLayout}>
        <SearchBar inputRef={search.inputRef} query={search.query} onQuery={search.setQuery} kind={page.kind} onKind={page.setKind} />
        <View style={styles.summary}>
          <Text accessibilityRole="summary" style={styles.summaryText}>{summary}</Text>
          {browsing ? (
            <Pressable accessibilityRole="button" hitSlop={8} onPress={page.reshuffle}>
              <Text style={styles.shuffle}>Shuffle rows</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      {browsing ? <DiscoverFeed page={page} /> : null}
    </View>
  );

  const footer = search.active ? (
    <SearchResults
      results={search.results}
      filter={search.filter}
      onFilter={search.setFilter}
      loading={search.loading}
      error={search.error}
      actions={page.actions}
      onOpenGenre={(g) => {
        page.openGenre(g);
        scrollToSearch();
      }}
    />
  ) : genre ? (
    <GenreView type={page.kind} genre={genre} view={genreView} actions={page.actions} onBack={page.closeGenre} />
  ) : page.hasMore ? (
    <LoadMoreButton label="Load more rows" loading={page.loadingMore} onPress={page.loadMore} />
  ) : null;

  return (
    <FlatList
      ref={listRef}
      data={browsing ? page.rows : NO_ROWS}
      keyExtractor={(row) => row.id}
      renderItem={({ item }) => (
        <DiscoverRow
          row={item}
          actions={page.actions}
          onOpenGenre={(g) => {
            page.openGenre(g);
            scrollToSearch();
          }}
        />
      )}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      onEndReached={onEnd}
      onEndReachedThreshold={1.5}
      initialNumToRender={3}
      windowSize={7}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors.ground }}
      contentContainerStyle={pad}
    />
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 12, rowGap: 4, marginLeft: 4 },
  summaryText: { fontSize: 12.5, color: colors.dim },
  shuffle: { fontSize: 12.5, color: colors.soft },
});
