import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { useNextEpisode } from '@/hooks/useNextEpisode';
import { watchedEpisodeCount } from '@/lib/episodes';
import { watchProgressPercent } from '@/lib/movieStatus';
import { episodeLabel } from '@/lib/profileFormat';
import { titleMeta } from '@/lib/statsSummary';
import { colors } from '@/theme/colors';
import type { Movie } from '@/types/movie';

function Row({ m }: { m: Movie }) {
  const router = useRouter();
  const next = episodeLabel(useNextEpisode(m));
  const total = m.numberOfEpisodes ?? 0;
  const open = m.tmdbId != null ? () => router.push(`/title/${m.type}/${m.tmdbId}` as never) : undefined;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={m.title} disabled={!open} onPress={open} style={styles.row}>
      <View style={styles.thumb}>
        <Poster title={m.title} coverUrl={m.coverUrl} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={styles.title}>
          {m.title}
        </Text>
        <Text numberOfLines={1} style={styles.sub}>
          {[titleMeta(m), next ? `Next ${next}` : null].filter(Boolean).join(' · ')}
        </Text>
        <View style={styles.bar}>
          <View style={[styles.fill, { width: `${watchProgressPercent(m)}%` }]} />
        </View>
      </View>
      {m.type === 'tv' && total > 0 ? (
        <Text mono style={styles.ep}>
          {watchedEpisodeCount(m)}/{total}
        </Text>
      ) : null}
    </Pressable>
  );
}

export function InProgressSection({ titles }: { titles: Movie[] }) {
  return (
    <View>
      <SectionHead title="In progress" meta={titles.length > 0 ? `${titles.length} underway` : undefined} />
      {titles.length === 0 ? (
        <Text style={styles.note}>Nothing underway right now.</Text>
      ) : (
        titles.map((m) => <Row key={m.id} m={m} />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  thumb: { width: 44 },
  title: { fontSize: 14, fontWeight: '500', letterSpacing: -0.14 },
  sub: { marginTop: 2, fontSize: 11, color: colors.dim },
  bar: { marginTop: 8, height: 3, borderRadius: 2, backgroundColor: colors.hover, overflow: 'hidden' },
  fill: { height: 3, borderRadius: 2, backgroundColor: colors.primary },
  ep: { fontSize: 12, color: colors.muted },
  note: { fontSize: 13, color: colors.dim },
});
