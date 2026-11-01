import { ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { titleHref } from '@/components/media/MovieCard';
import { Text } from '@/components/ui/Text';
import { releaseBadge } from '@/lib/cardInfo';
import { colors } from '@/theme/colors';
import { PAGE_GUTTER } from '@/theme/layout';
import type { Movie } from '@/types/movie';

type Props = { movies: Movie[]; collapsed: boolean; onToggle: () => void };

const CARD = 92;

function SoonCard({ movie }: { movie: Movie }) {
  const router = useRouter();
  const href = titleHref(movie);
  return (
    <View style={{ width: CARD }}>
      <Poster title={movie.title} coverUrl={movie.coverUrl} width={CARD} onPress={href ? () => router.push(href) : undefined}>
        <View style={styles.date}>
          <Text style={styles.dateText}>{releaseBadge(movie.releaseDate)}</Text>
        </View>
      </Poster>
      <Text numberOfLines={1} style={styles.title}>{movie.title}</Text>
      <Text numberOfLines={1} style={styles.meta}>{movie.type === 'tv' ? 'Series' : 'Film'}</Text>
    </View>
  );
}

/** Watchlist titles that have not come out yet; the header collapses the rail. */
export function ComingSoon({ movies, collapsed, onToggle }: Props) {
  if (movies.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={styles.head}>
        <Text accessibilityRole="header" tracking={-0.035} style={styles.h}>Coming soon</Text>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: !collapsed }} onPress={onToggle} hitSlop={8} style={styles.toggle}>
          <Text style={styles.toggleText}>From your watchlist · {movies.length}</Text>
          <ChevronDown size={14} color={colors.dim} style={{ transform: [{ rotate: collapsed ? '-90deg' : '0deg' }] }} />
        </Pressable>
      </View>
      {collapsed ? null : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail} style={styles.bleed}>
          {movies.map((m) => <SoonCard key={m.id} movie={m} />)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 28 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  h: { flex: 1, fontSize: 18, fontWeight: '600' },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  toggleText: { fontSize: 12, color: colors.dim },
  bleed: { marginHorizontal: -PAGE_GUTTER },
  rail: { paddingHorizontal: PAGE_GUTTER, gap: 10 },
  date: { position: 'absolute', top: 6, left: 6, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 4, backgroundColor: colors.primary },
  dateText: { fontSize: 8.5, fontWeight: '600', letterSpacing: 0.6, color: colors.onPrimary },
  title: { marginTop: 7, fontSize: 11.5, fontWeight: '600' },
  meta: { marginTop: 2, fontSize: 10.5, color: colors.dim },
});
