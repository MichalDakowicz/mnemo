import { X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { usePosterGrid } from '@/components/media/PosterGrid';
import { Pill } from '@/components/ui/Pill';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { MAX_FAVORITES } from '@/lib/favorites';
import { titleMeta } from '@/lib/statsSummary';
import { colors } from '@/theme/colors';

import { FavouritePicker } from './FavouritePicker';
import { TitleCard } from './TitleCard';
import type { useFavoritesEditor } from './useFavoritesEditor';

type Props = { favs: ReturnType<typeof useFavoritesEditor> };

export function FavouritesSection({ favs }: Props) {
  const { cardWidth, gap } = usePosterGrid('normal');
  const slots = Array.from({ length: MAX_FAVORITES }, (_, i) => favs.favorites[i] ?? null);
  return (
    <View>
      <SectionHead
        title="Favourites"
        right={
          <Pill
            height={30}
            label={favs.editing ? 'Done' : 'Edit favourites'}
            onPress={favs.toggleEditing}
          />
        }
      />
      <View style={[styles.row, { gap }]}>
        {slots.map((item, i) => {
          if (!item) {
            return (
              <Pressable
                key={`empty-${i}`}
                accessibilityRole="button"
                accessibilityLabel="Pin a title"
                onPress={favs.startEditing}
                style={[styles.slot, { width: cardWidth, height: cardWidth * 1.5 }]}>
                <Text style={styles.plus}>+</Text>
                <Text style={styles.slotLabel}>Pin a title</Text>
              </Pressable>
            );
          }
          const entry = favs.libraryEntry(item);
          // The favourite's place already says how you rated it, so the caption is who made it, not a score.
          const director = entry?.director.map((d) => d.name).join(', ') || null;
          const meta = entry ? titleMeta(entry) : item.type === 'tv' ? 'Series' : 'Film';
          return (
            <View key={`${item.type}:${item.tmdbId}`} style={{ width: cardWidth }}>
              <TitleCard
                title={item.title}
                coverUrl={item.coverUrl}
                meta={meta}
                caption={director}
                to={`/title/${item.type}/${item.tmdbId}`}
              />
              {favs.editing ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Unpin ${item.title}`}
                  disabled={favs.saving}
                  hitSlop={8}
                  onPress={() => void favs.unpin(item)}
                  style={styles.unpin}>
                  <X size={12} strokeWidth={2.6} color={colors.text} />
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>
      {favs.favorites.length === 0 ? (
        <Text style={styles.note}>Pin up to 4 titles you have watched to the top of your profile.</Text>
      ) : null}
      {favs.error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {favs.error}
        </Text>
      ) : null}
      {favs.editing ? <FavouritePicker favs={favs} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  slot: {
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  plus: { fontSize: 22, color: colors.dim },
  slotLabel: { fontSize: 11, color: colors.dim },
  unpin: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassSolid,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  note: { marginTop: 14, fontSize: 12, color: colors.dim },
  error: { marginTop: 12, fontSize: 13, color: colors.warn },
});
