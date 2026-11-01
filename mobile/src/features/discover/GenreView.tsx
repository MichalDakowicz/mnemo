import { ArrowLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { PosterGrid } from '@/components/media/PosterGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import type { MediaType } from '@/types/movie';

import { DiscoverCard } from './DiscoverCard';
import { LoadMoreButton } from './LoadMoreButton';
import type { CardActions } from './useCardActions';
import type { useGenreView } from './useGenreView';

type Props = {
  type: MediaType;
  genre: { id: number; name: string };
  view: ReturnType<typeof useGenreView>;
  actions: CardActions;
  onBack: () => void;
};

/** Stopgap genre page (the design has none): a genre's titles as an infinite grid, in place on Discover. */
export function GenreView({ type, genre, view, actions, onBack }: Props) {
  return (
    <View accessibilityLabel={`${genre.name} ${type === 'tv' ? 'shows' : 'films'}`} style={{ marginTop: 18 }}>
      <View style={styles.head}>
        <Text accessibilityRole="header" tracking={-0.035} style={styles.title}>
          {genre.name} {type === 'tv' ? 'shows' : 'films'}
        </Text>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onBack} style={styles.back}>
          <ArrowLeft size={14} color={colors.soft} />
          <Text style={styles.backText}>Back to Discover</Text>
        </Pressable>
      </View>
      {view.loading ? <EmptyState body="Loading…" /> : null}
      {view.error ? <EmptyState tone="warn" body="Could not load this genre." /> : null}
      <PosterGrid items={view.items} keyOf={(i) => `${i.type}-${i.tmdbId}`} renderItem={(item, w) => <DiscoverCard item={item} actions={actions} width={w} />} />
      {view.hasMore ? <LoadMoreButton label="Load more" loading={view.loadingMore} onPress={view.loadMore} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { gap: 6, marginBottom: 14 },
  title: { fontSize: 20, fontWeight: '600' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  backText: { fontSize: 13, color: colors.soft },
});
