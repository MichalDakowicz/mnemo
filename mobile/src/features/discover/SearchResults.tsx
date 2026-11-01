import { StyleSheet, View } from 'react-native';

import { PosterGrid } from '@/components/media/PosterGrid';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import type { BrowseSearchResult } from '@/lib/tmdb';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';

import { DiscoverCard } from './DiscoverCard';
import { PersonChip } from './PersonChip';
import { RESULT_FILTERS, type ResultFilter } from './useBrowseSearch';
import type { CardActions } from './useCardActions';

type Props = {
  results: BrowseSearchResult[];
  filter: ResultFilter;
  onFilter: (f: ResultFilter) => void;
  loading: boolean;
  error: boolean;
  actions: CardActions;
  onOpenGenre: (genre: { id: number; name: string }) => void;
};

type TitleResult = Extract<BrowseSearchResult, { resultType: 'movie' | 'tv' }>;

function toItem(r: TitleResult): DiscoverItem {
  return {
    tmdbId: r.tmdbId,
    type: r.resultType,
    title: r.title,
    releaseDate: r.releaseDate,
    coverUrl: r.coverUrl,
    voteAverage: r.voteAverage,
    overview: r.overview ?? '',
    genres: [],
  };
}

/** Search results: filter chips, then people, genres and a grid of titles. */
export function SearchResults({ results, filter, onFilter, loading, error, actions, onOpenGenre }: Props) {
  const titles = results.filter((r): r is TitleResult => r.resultType === 'movie' || r.resultType === 'tv');
  const people = results.filter((r): r is Extract<BrowseSearchResult, { resultType: 'person' }> => r.resultType === 'person');
  const genres = results.filter((r): r is Extract<BrowseSearchResult, { resultType: 'genre' }> => r.resultType === 'genre');
  const empty = !loading && !error && results.length === 0;

  return (
    <View accessibilityLabel="Search results" style={{ marginTop: 18 }}>
      <View style={styles.chips}>
        {RESULT_FILTERS.map((f) => (
          <Chip key={f.id} label={f.label} active={filter === f.id} onPress={() => onFilter(f.id)} />
        ))}
      </View>
      {people.length > 0 ? (
        <View style={styles.people}>
          {people.map((p) => (
            <PersonChip key={p.resultKey} id={p.personId} name={p.title} role={p.subtitle} photo={p.coverUrl} />
          ))}
        </View>
      ) : null}
      {genres.length > 0 ? (
        <View style={styles.chips}>
          {genres.map((g) => (
            <Chip key={g.resultKey} label={g.title} onPress={() => onOpenGenre({ id: g.genreId, name: g.title })} />
          ))}
        </View>
      ) : null}
      {titles.length > 0 ? (
        <PosterGrid items={titles} keyOf={(r) => r.resultKey} renderItem={(r, w) => <DiscoverCard item={toItem(r)} actions={actions} width={w} />} />
      ) : null}
      {loading && results.length === 0 ? <EmptyState body="Searching TMDB…" /> : null}
      {error ? <EmptyState tone="warn" title="Search is not working" body="TMDB did not answer. Check your connection and try again." /> : null}
      {empty ? <EmptyState title="No matches on TMDB" body="Try the original title, or search for a person." /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 18 },
  people: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
});
