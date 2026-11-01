import { useRouter } from 'expo-router';
import { Bookmark, Check, Play, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { Text } from '@/components/ui/Text';
import type { LibraryEntry } from '@/lib/personCredits';
import { colors } from '@/theme/colors';
import type { MediaType } from '@/types/movie';

export type CardItem = {
  tmdbId: number;
  type: MediaType;
  title: string;
  coverUrl: string | null;
  role?: string;
  meta?: string;
};

type Props = {
  item: CardItem;
  width: number;
  entry?: LibraryEntry;
  /** Show the kind tag (FILM / SERIES). */
  tag?: boolean;
  adding?: boolean;
  onAdd?: () => void;
};

const STATUS_LABEL = { watched: 'Watched', watching: 'Watching', watchlist: 'On watchlist' } as const;

/** A 2:3 cover with its library badge and the quick add-to-watchlist button (always visible on a phone). */
export function CreditCard({ item, width, entry, tag = true, adding, onAdd }: Props) {
  const router = useRouter();
  const meta = [item.meta, entry ? STATUS_LABEL[entry.status] : '', entry && entry.rating > 0 ? `★ ${entry.rating.toFixed(1)}` : '']
    .filter(Boolean)
    .join(' · ');
  const Icon = entry?.status === 'watched' ? Check : entry?.status === 'watching' ? Play : Bookmark;
  const good = entry?.status === 'watched';

  return (
    <View style={{ width }}>
      <Poster title={item.title} coverUrl={item.coverUrl} onPress={() => router.push(`/title/${item.type}/${item.tmdbId}` as never)}>
        {tag ? (
          <View style={styles.kind}>
            <Text style={styles.kindText}>{item.type === 'tv' ? 'SERIES' : 'FILM'}</Text>
          </View>
        ) : null}
        {entry ? (
          <View style={[styles.badge, good && styles.good]} accessibilityLabel={STATUS_LABEL[entry.status]}>
            <Icon size={11} strokeWidth={2.6} color={good ? colors.onPrimary : colors.text} />
          </View>
        ) : null}
      </Poster>
      {!entry && onAdd ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add to watchlist: ${item.title}`}
          disabled={adding}
          hitSlop={6}
          onPress={onAdd}
          style={[styles.add, adding && { opacity: 0.5 }]}>
          <Plus size={13} strokeWidth={2.6} color={colors.text} />
        </Pressable>
      ) : null}
      <Text numberOfLines={2} style={styles.name}>
        {item.title}
      </Text>
      {item.role ? (
        <Text numberOfLines={1} style={styles.role}>
          {item.role}
        </Text>
      ) : null}
      {meta ? (
        <Text numberOfLines={1} style={styles.meta}>
          {meta}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  kind: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingHorizontal: 5,
    height: 15,
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.glassSolid,
  },
  kindText: { fontSize: 8, fontWeight: '600', letterSpacing: 0.6, color: colors.soft },
  badge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassSolid,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  good: { backgroundColor: colors.good, borderColor: colors.good },
  add: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassSolid,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  name: { marginTop: 7, fontSize: 12, fontWeight: '500', lineHeight: 15, letterSpacing: -0.12 },
  role: { marginTop: 2, fontSize: 11, color: colors.muted },
  meta: { marginTop: 1, fontSize: 11, color: colors.dim },
});
