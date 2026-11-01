import { ScrollView, StyleSheet, View } from 'react-native';

import { MovieCard } from '@/components/media/MovieCard';
import { SectionHead } from '@/components/ui/SectionHead';
import type { QuickStatus } from '@/lib/quickStatus';
import { PAGE_GUTTER } from '@/theme/layout';
import type { Movie } from '@/types/movie';

type Props = { movies: Movie[]; onQuickStatus: (m: Movie, t: QuickStatus) => void };

const CARD = 92;

export function RecentlyAdded({ movies, onQuickStatus }: Props) {
  if (movies.length === 0) return null;
  return (
    <View style={styles.section}>
      <SectionHead title="Recently added" meta={String(movies.length)} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail} style={styles.bleed}>
        {movies.map((m) => <MovieCard key={m.id} movie={m} width={CARD} onQuickStatus={onQuickStatus} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 28 },
  bleed: { marginHorizontal: -PAGE_GUTTER },
  rail: { paddingHorizontal: PAGE_GUTTER, gap: 10 },
});
