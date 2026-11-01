import { ScrollView, StyleSheet } from 'react-native';

import { titleMeta } from '@/lib/statsSummary';
import { PAGE_GUTTER } from '@/theme/layout';
import type { Movie } from '@/types/movie';

import { StatsBlock, StatsNote } from './StatsBlock';
import { TitleCard } from './TitleCard';

const CARD = 100;

/** Every five-star title on a sideways rail (the web's belt / grid). */
export function HallOfFame({ titles }: { titles: Movie[] }) {
  return (
    <StatsBlock title="Hall of fame" meta="Every title with five stars">
      {titles.length === 0 ? (
        <StatsNote>No five-star titles yet.</StatsNote>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.rail}>
          {titles.map((m) => (
            <TitleCard key={m.id} width={CARD} title={m.title} coverUrl={m.coverUrl} meta={titleMeta(m)} to={m.tmdbId != null ? `/title/${m.type}/${m.tmdbId}` : null} />
          ))}
        </ScrollView>
      )}
    </StatsBlock>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -PAGE_GUTTER },
  rail: { paddingHorizontal: PAGE_GUTTER, gap: 12 },
});
