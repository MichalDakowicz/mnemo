import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

import { Art } from './Art';

type Props = {
  title: string;
  coverUrl?: string | null;
  /** Fixed width; height follows the 2:3 ratio. Omit to fill the parent. */
  width?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  radius?: number;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** The cover itself: 2:3, 6px radius, soft diagonal sheen, never a grey placeholder. Presses sink slightly. */
export function PosterCover({ title, coverUrl, radius = 6, children, style }: Pick<Props, 'title' | 'coverUrl' | 'radius' | 'children' | 'style'>) {
  return (
    <View style={[styles.cover, { borderRadius: radius }, style]}>
      {coverUrl ? <Image source={{ uri: coverUrl }} contentFit="cover" transition={180} recyclingKey={coverUrl} accessibilityLabel={title} style={StyleSheet.absoluteFill} /> : <Art title={title} />}
      <LinearGradient colors={[colors.sheen, 'rgba(255,255,255,0)']} locations={[0, 0.4]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} pointerEvents="none" style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

export function Poster({ title, coverUrl, width, onPress, onLongPress, radius, children, style }: Props) {
  const cover = <PosterCover title={title} coverUrl={coverUrl} radius={radius}>{children}</PosterCover>;
  const frame: ViewStyle = width ? { width } : { width: '100%' };
  if (!onPress && !onLongPress) return <View style={[frame, style]}>{cover}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [frame, pressed && styles.pressed, style]}>
      {cover}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    aspectRatio: 2 / 3,
    overflow: 'hidden',
    backgroundColor: colors.panel,
    boxShadow: '0 8px 20px #0006',
  },
  pressed: { transform: [{ scale: 0.97 }] },
});
