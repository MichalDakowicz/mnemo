import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Art } from '@/components/media/Art';
import { titleHref } from '@/components/media/MovieCard';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { useNextEpisode } from '@/hooks/useNextEpisode';
import { watchedEpisodeCount } from '@/lib/episodes';
import { watchProgressPercent } from '@/lib/movieStatus';
import { colors } from '@/theme/colors';
import { PAGE_GUTTER } from '@/theme/layout';
import type { Movie } from '@/types/movie';

const GAP = 12;
/** How much of the next card shows beside the current one, so it is clear there is more to swipe to. */
const PEEK = 36;
const SHEEN = 'rgba(255,255,255,0.11)';
const CLEAR = 'rgba(0,0,0,0)';
const SHADE = 'rgba(0,0,0,0.85)';
const CHIP_FILL = 'rgba(0,0,0,0.4)';
const SOFT_WHITE = 'rgba(255,255,255,0.78)';
const TRACK = 'rgba(255,255,255,0.22)';

function CwCard({ movie, width }: { movie: Movie; width: number }) {
  const router = useRouter();
  const href = titleHref(movie);
  const next = useNextEpisode(movie);
  const pct = watchProgressPercent(movie);
  const done = watchedEpisodeCount(movie);
  const meta = movie.type === 'tv' && movie.numberOfEpisodes ? `${done} / ${movie.numberOfEpisodes}` : '';
  const nextLine = next ? `Next · season ${next[0]}, episode ${next[1]}` : movie.type === 'tv' ? 'In progress' : 'Watching';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${movie.title}. ${nextLine}`}
      onPress={href ? () => router.push(href) : undefined}
      style={({ pressed }) => [styles.card, { width }, pressed && { transform: [{ scale: 0.98 }] }]}>
      {movie.coverUrl ? <Image source={{ uri: movie.coverUrl }} contentFit="cover" contentPosition="top" recyclingKey={movie.coverUrl} style={StyleSheet.absoluteFill} /> : <Art title={movie.title} showTitle={false} />}
      <LinearGradient colors={[SHEEN, CLEAR]} locations={[0, 0.3]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.4 }} pointerEvents="none" style={StyleSheet.absoluteFill} />
      <LinearGradient colors={[CLEAR, SHADE]} locations={[0.3, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
      {next ? (
        <View style={styles.code}>
          <Text style={styles.codeText}>S{next[0]} · E{next[1]}</Text>
        </View>
      ) : null}
      <View style={styles.body}>
        <Text numberOfLines={1} tracking={-0.04} style={styles.title}>{movie.title}</Text>
        <Text numberOfLines={1} style={styles.next}>{nextLine}</Text>
        <View style={styles.bar}>
          <View style={styles.track}>
            <View style={{ width: `${pct}%`, height: '100%', backgroundColor: colors.primary }} />
          </View>
          {meta ? <Text mono style={styles.metaText}>{meta}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

/**
 * 16:9 cards: poster still, next-episode line and a progress bar. One title fills the page width. With several,
 * each card is a little narrower so the next one peeks in, and the rail snaps a card at a time (never stops halfway).
 */
export function ContinueWatching({ movies }: { movies: Movie[] }) {
  const { width: screen } = useWindowDimensions();
  if (movies.length === 0) return null;
  const full = screen - PAGE_GUTTER * 2;
  const single = movies.length === 1;
  const cardWidth = single ? full : full - PEEK;
  return (
    <View style={styles.section}>
      <SectionHead title="Continue watching" meta={`${movies.length} in progress`} />
      <ScrollView
        horizontal
        scrollEnabled={!single}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        style={styles.bleed}
        decelerationRate="fast"
        snapToInterval={cardWidth + GAP}
        snapToAlignment="start"
        disableIntervalMomentum>
        {movies.map((m) => <CwCard key={m.id} movie={m} width={cardWidth} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  bleed: { marginHorizontal: -PAGE_GUTTER },
  rail: { paddingHorizontal: PAGE_GUTTER, gap: GAP },
  card: { aspectRatio: 16 / 9, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.panel, boxShadow: '0 12px 28px #0008, 0 0 0 1px #ffffff0d' },
  code: { position: 'absolute', left: 12, top: 12, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5, backgroundColor: CHIP_FILL },
  codeText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.9, color: colors.white },
  body: { position: 'absolute', left: 14, right: 14, bottom: 12, gap: 2 },
  title: { fontSize: 20, fontWeight: '600', color: colors.white },
  next: { fontSize: 12, color: SOFT_WHITE },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  track: { flex: 1, height: 3, borderRadius: 3, overflow: 'hidden', backgroundColor: TRACK },
  metaText: { fontSize: 11, color: SOFT_WHITE },
});
