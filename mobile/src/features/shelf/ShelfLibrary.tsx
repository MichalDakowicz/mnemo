import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { isActivelyWatching } from '@/lib/movieStatus';
import type { Movie } from '@/types/movie';

import { PosterRail } from './PosterRail';

type Filter = 'all' | 'watched' | 'watching' | 'watchlist';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'watched', label: 'Watched' },
  { key: 'watching', label: 'Watching' },
  { key: 'watchlist', label: 'Watchlist' },
];

function matches(movie: Movie, filter: Filter): boolean {
  if (filter === 'watched') return movie.watched;
  if (filter === 'watching') return isActivelyWatching(movie);
  if (filter === 'watchlist') return movie.inWatchlist;
  return true;
}

/** Their whole library, read-only, filtered by what state each title is in. */
export function ShelfLibrary({ movies }: { movies: Movie[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const items = useMemo(
    () =>
      movies
        .filter((m) => matches(m, filter))
        .map((m) => ({ key: m.id, title: m.title, coverUrl: m.coverUrl, tmdbId: m.tmdbId, type: m.type })),
    [movies, filter],
  );
  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.filters}>
        {FILTERS.map((f) => (
          <Chip key={f.key} label={f.label} active={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </ScrollView>
      {items.length === 0 ? <EmptyState body="Nothing in this view." /> : <PosterRail title="Library" meta={`${items.length} titles`} items={items} grid />}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, marginBottom: 12, marginHorizontal: -16 },
  filters: { gap: 6, paddingHorizontal: 16 },
});
