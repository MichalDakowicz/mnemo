import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { usePosterGrid } from '@/components/media/PosterGrid';
import { SearchField } from '@/components/ui/SearchField';
import { Text } from '@/components/ui/Text';
import { MAX_FAVORITES } from '@/lib/favorites';
import { filterPickables } from '@/lib/pickFilter';
import { colors } from '@/theme/colors';

import type { useFavoritesEditor } from './useFavoritesEditor';

type Props = { favs: ReturnType<typeof useFavoritesEditor> };

/** "From what you have watched": search + poster grid to pin or unpin favourites. */
export function FavouritePicker({ favs }: Props) {
  const [query, setQuery] = useState('');
  const { cardWidth, gap } = usePosterGrid('normal');
  const shown = filterPickables(favs.pickables, query);
  return (
    <View style={styles.picker}>
      <View style={styles.head}>
        <Text style={styles.headTitle}>From what you have watched</Text>
        <Text style={styles.note}>
          {favs.full ? 'All four slots are full' : `${favs.favorites.length} of ${MAX_FAVORITES} pinned`}
        </Text>
      </View>
      {favs.pickables.length === 0 ? (
        <Text style={styles.note}>Finished titles with a TMDB page show up here to pin.</Text>
      ) : (
        <>
          <SearchField value={query} onChangeText={setQuery} placeholder="Search by title or director" />
          {shown.length === 0 ? (
            <Text style={styles.note}>Nothing you have watched matches &quot;{query.trim()}&quot;.</Text>
          ) : null}
          <View style={[styles.grid, { gap }]}>
            {shown.map(({ movie, item, on }) => {
              const disabled = favs.saving || (!on && favs.full);
              return (
                <Pressable
                  key={movie.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on, disabled }}
                  accessibilityLabel={`${on ? 'Unpin' : 'Pin'} ${movie.title}`}
                  disabled={disabled}
                  onPress={() => void favs.pin(item)}
                  style={[{ width: cardWidth, opacity: disabled ? 0.4 : 1 }]}>
                  <View style={on ? styles.on : undefined}>
                    <Poster title={movie.title} coverUrl={movie.coverUrl} />
                  </View>
                  <Text numberOfLines={2} style={styles.cap}>
                    {movie.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: { marginTop: 18, gap: 12 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  headTitle: { fontSize: 14, fontWeight: '600' },
  note: { fontSize: 12, color: colors.dim },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 },
  on: { borderRadius: 8, borderWidth: 2, borderColor: colors.primary, padding: 0 },
  cap: { marginTop: 5, fontSize: 11, lineHeight: 14, color: colors.muted },
});
