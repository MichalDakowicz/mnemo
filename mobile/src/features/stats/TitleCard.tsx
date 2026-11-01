import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

type Props = {
  title: string;
  coverUrl?: string | null;
  meta?: ReactNode;
  /** Route to open; a title without a TMDB id has none and renders static. */
  to?: string | null;
  width: number;
  /** Overlay on the poster (rank badge). */
  badge?: ReactNode;
  /** Shown under the poster in place of the title. */
  caption?: ReactNode;
};

/** Poster + title + meta line; the poster is the press target. */
export function TitleCard({ title, coverUrl, meta, to, width, badge, caption }: Props) {
  const router = useRouter();
  return (
    <View style={{ width }}>
      <Poster title={title} coverUrl={coverUrl} width={width} onPress={to ? () => router.push(to) : undefined}>
        {badge}
      </Poster>
      <Text numberOfLines={1} style={styles.t}>{caption ?? title}</Text>
      {meta ? <Text numberOfLines={1} style={styles.m}>{meta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  t: { marginTop: 8, fontSize: 12, fontWeight: '600' },
  m: { marginTop: 2, fontSize: 11, color: colors.dim },
});
