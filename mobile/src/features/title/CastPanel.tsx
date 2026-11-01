import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Art } from '@/components/media/Art';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import type { CastMember } from '@/types/movie';

import { PanelHead } from './PanelHead';

const PHOTO_WIDTH = 92;
const SHADE = ['rgba(0,0,0,0)', 'rgba(0,0,0,0.53)'] as const;

function Person({ p }: { p: CastMember }) {
  const router = useRouter();
  const body = (
    <>
      <View style={styles.photo}>
        {p.profileUrl ? (
          <Image source={{ uri: p.profileUrl }} contentFit="cover" transition={180} style={StyleSheet.absoluteFill} />
        ) : (
          <>
            <Art title={p.name} showTitle={false} />
            <Svg viewBox="0 0 100 110" style={styles.silhouette} width="78%" height="70%" fill={colors.white}>
              <Circle cx="50" cy="34" r="22" />
              <Path d="M6 110c2-30 20-46 44-46s42 16 44 46z" />
            </Svg>
          </>
        )}
        <LinearGradient colors={SHADE} locations={[0.55, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
      </View>
      <Text numberOfLines={1} style={styles.name}>{p.name}</Text>
      {p.character ? <Text numberOfLines={1} style={styles.role}>{p.character}</Text> : null}
    </>
  );
  if (!p.id) return <View style={styles.person}>{body}</View>;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={p.character ? `${p.name} as ${p.character}` : p.name}
      onPress={() => router.push(`/person/${p.id}`)}
      style={({ pressed }) => [styles.person, pressed && styles.pressed]}>
      {body}
    </Pressable>
  );
}

export function CastPanel({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null;
  return (
    <View>
      <PanelHead title="Cast" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {cast.map((p, i) => <Person key={`${p.id ?? p.name}-${i}`} p={p} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { gap: 12, paddingBottom: 4 },
  person: { width: PHOTO_WIDTH },
  pressed: { transform: [{ scale: 0.97 }] },
  photo: { width: PHOTO_WIDTH, aspectRatio: 2 / 3, borderRadius: 6, overflow: 'hidden', backgroundColor: colors.panel, boxShadow: '0 8px 20px #0006' },
  silhouette: { position: 'absolute', left: '11%', bottom: 0, opacity: 0.32 },
  name: { marginTop: 8, fontSize: 12.5, fontWeight: '600' },
  role: { marginTop: 2, fontSize: 11, color: colors.soft },
});
