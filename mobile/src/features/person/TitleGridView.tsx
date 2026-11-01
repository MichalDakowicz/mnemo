import { Image } from 'expo-image';
import { FlatList, StyleSheet, View } from 'react-native';

import { Screen, useScreenPadding } from '@/components/layout/Screen';
import { usePosterGrid } from '@/components/media/PosterGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { useAddToLibrary } from '@/features/title/useAddToLibrary';
import { yearOf } from '@/lib/titleFacts';
import type { CreditItem } from '@/lib/tmdb';
import { colors } from '@/theme/colors';

import { CreditCard } from './CreditCard';
import { useLibraryIndex } from './useLibraryIndex';

type Props = {
  title: string;
  count: number;
  logoUrl?: string | null;
  items: CreditItem[];
  loading: boolean;
  error: boolean;
  hasMore: boolean;
  fetchingMore: boolean;
  onMore: () => void;
  onRetry: () => void;
};

/** Genre and studio pages: a heading and the poster grid of titles, loaded a page at a time. */
export function TitleGridView({ title, count, logoUrl, items, loading, error, hasMore, fetchingMore, onMore, onRetry }: Props) {
  const library = useLibraryIndex();
  const adder = useAddToLibrary();
  const pad = useScreenPadding();
  const { columns, cardWidth, gap } = usePosterGrid('normal');

  if (loading) {
    return (
      <Screen>
        <EmptyState body="Loading…" />
      </Screen>
    );
  }
  if (error) {
    return (
      <Screen>
        <EmptyState tone="warn" body="Could not load these titles." />
        <View style={{ alignItems: 'center' }}>
          <Pill label="Try again" onPress={onRetry} />
        </View>
      </Screen>
    );
  }

  return (
    <FlatList
      key={columns}
      style={{ flex: 1, backgroundColor: colors.ground }}
      contentContainerStyle={pad}
      showsVerticalScrollIndicator={false}
      data={items}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? { gap } : undefined}
      keyExtractor={(c) => `${c.type}:${c.tmdbId}`}
      initialNumToRender={16}
      windowSize={7}
      ListHeaderComponent={
        <View>
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} contentFit="contain" contentPosition="left" style={styles.logo} tintColor={colors.soft} />
          ) : null}
          <PageHeader title={title} subtitle={`${count.toLocaleString('en-US')} ${count === 1 ? 'title' : 'titles'}, best rated first`} />
          {items.length === 0 ? <Text style={styles.empty}>TMDB has nothing listed here.</Text> : null}
        </View>
      }
      ListFooterComponent={
        <View style={{ gap: 12, alignItems: 'center' }}>
          {adder.error ? (
            <Text accessibilityRole="alert" style={styles.empty}>
              {adder.error}
            </Text>
          ) : null}
          {hasMore ? <Pill label={fetchingMore ? 'Loading…' : 'Show more'} disabled={fetchingMore} onPress={onMore} /> : null}
        </View>
      }
      renderItem={({ item: c }) => (
        <View style={{ marginBottom: 18 }}>
          <CreditCard
            width={cardWidth}
            tag={false}
            item={{ tmdbId: c.tmdbId, type: c.type, title: c.title, coverUrl: c.coverUrl, meta: yearOf(c.releaseDate) }}
            entry={library[`${c.type}:${c.tmdbId}`]}
            adding={adder.pending === `${c.type}:${c.tmdbId}`}
            onAdd={() => void adder.add(c.tmdbId, c.type)}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  logo: { height: 32, width: 140, marginBottom: 12 },
  empty: { fontSize: 13, color: colors.dim, textAlign: 'center', paddingVertical: 24 },
});
