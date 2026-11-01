import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

type Props = {
  title: string;
  coverUrl?: string | null;
  width?: number;
  meta?: ReactNode;
  /** Route to open; a title without a TMDB id has none and renders static. */
  to?: string | null;
  /** Shown under the poster in place of the title. */
  caption?: string | null;
};

/** Poster + title + meta line (web stats/TitleCard). The poster is the tap target. */
export function TitleCard({ title, coverUrl, width, meta, to, caption }: Props) {
  const router = useRouter();
  return (
    <View style={width ? { width } : undefined}>
      <Poster title={title} coverUrl={coverUrl} onPress={to ? () => router.push(to as never) : undefined} />
      <Text numberOfLines={2} style={styles.title}>
        {caption ?? title}
      </Text>
      {meta ? (
        <Text numberOfLines={1} style={styles.meta}>
          {meta}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 7, fontSize: 12, fontWeight: '500', lineHeight: 15, letterSpacing: -0.12 },
  meta: { marginTop: 2, fontSize: 11, color: colors.dim },
});
