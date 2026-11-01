import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { PosterGrid } from '@/components/media/PosterGrid';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

export type RailItem = { key: string; title: string; coverUrl: string | null; tmdbId: number | null; type: 'movie' | 'tv'; caption?: string };

const RAIL_WIDTH = 92;

/** Poster link: opens the title page when TMDB knows it, otherwise a static cover. */
export function PosterLink({ item, width }: { item: RailItem; width?: number }) {
  const router = useRouter();
  const open = item.tmdbId != null ? () => router.push(`/title/${item.type}/${item.tmdbId}`) : undefined;
  return (
    <View style={width ? { width } : undefined}>
      <Poster title={item.title} coverUrl={item.coverUrl} width={width} onPress={open} />
      <Text numberOfLines={2} style={styles.cap}>{item.title}</Text>
      {item.caption ? <Text numberOfLines={1} style={styles.small}>{item.caption}</Text> : null}
    </View>
  );
}

type Props = { title: string; meta?: string; items: RailItem[]; grid?: boolean };

export function PosterRail({ title, meta, items, grid = false }: Props) {
  if (items.length === 0) return null;
  return (
    <View style={styles.section} accessibilityLabel={title}>
      <SectionHead title={title} meta={meta} />
      {grid ? (
        <PosterGrid items={items} keyOf={(item) => item.key} renderItem={(item, width) => <PosterLink item={item} width={width} />} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail} contentContainerStyle={styles.railContent}>
          {items.map((item) => <PosterLink key={item.key} item={item} width={RAIL_WIDTH} />)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  rail: { marginHorizontal: -16 },
  railContent: { gap: 12, paddingHorizontal: 16, paddingBottom: 4 },
  cap: { marginTop: 6, fontSize: 12, lineHeight: 16, color: colors.soft },
  small: { marginTop: 2, fontSize: 11, color: colors.dim },
});
