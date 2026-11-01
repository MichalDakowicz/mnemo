import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { Text } from '@/components/ui/Text';
import type { MediaSummary } from '@/lib/tmdb';
import { yearOf } from '@/lib/titleFacts';
import { colors } from '@/theme/colors';
import type { MediaType } from '@/types/movie';

import { PanelHead } from './PanelHead';

type Props = { type: MediaType; items: MediaSummary[]; owned: Set<number> };

const WIDTH = 92;

export function SimilarRow({ type, items, owned }: Props) {
  const router = useRouter();
  if (items.length === 0) return null;
  return (
    <View>
      <PanelHead title={type === 'tv' ? 'Similar shows' : 'Similar movies'} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {items.map((s) => (
          <View key={s.tmdbId} style={{ width: WIDTH }}>
            <Poster title={s.title} coverUrl={s.coverUrl} width={WIDTH} onPress={() => router.push(`/title/${s.type}/${s.tmdbId}`)} />
            <Text numberOfLines={2} style={styles.name}>{s.title}</Text>
            <Text numberOfLines={1} style={styles.meta}>
              {[yearOf(s.releaseDate), owned.has(s.tmdbId) ? 'In your library' : ''].filter(Boolean).join(' · ')}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { gap: 12, paddingBottom: 4 },
  name: { marginTop: 8, fontSize: 12, fontWeight: '600', lineHeight: 15 },
  meta: { marginTop: 2, fontSize: 11, color: colors.dim },
});
