import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Art } from '@/components/media/Art';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

export const HERO_HEIGHT = 430;

const FADE = [`${colors.ground}59`, `${colors.ground}00`, `${colors.ground}00`, `${colors.ground}8c`, colors.ground] as const;
const FADE_AT = [0, 0.2, 0.42, 0.72, 1] as const;

type Props = { title: string; url: string | null; pending?: boolean };

/** Hero art behind the head: the TMDB backdrop (it settles in once loaded), or the generated cover with the title as a watermark. */
export function TitleBackdrop({ title, url, pending = false }: Props) {
  const [loaded, setLoaded] = useState(false);
  const showImage = !pending && !!url;
  return (
    <View style={styles.hero} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {!pending && !url ? (
        <>
          <Art title={title} showTitle={false} />
          <Text numberOfLines={3} tracking={-0.04} style={styles.mark}>{title}</Text>
        </>
      ) : null}
      {showImage ? (
        <Image
          source={{ uri: url }}
          contentFit="cover"
          transition={loaded ? 0 : 700}
          onLoad={() => setLoaded(true)}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <LinearGradient colors={FADE} locations={FADE_AT} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { position: 'absolute', left: 0, right: 0, top: 0, height: HERO_HEIGHT, overflow: 'hidden', backgroundColor: colors.ground },
  mark: { position: 'absolute', left: 20, right: 20, top: 80, fontSize: 56, lineHeight: 56, fontWeight: '600', textTransform: 'uppercase', color: colors.white, opacity: 0.16 },
});
