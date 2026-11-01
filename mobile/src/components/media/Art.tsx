import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { hueFromTitle } from '@/lib/hue';

const hsl = (h: number, s: number, l: number, a = 1) => `hsla(${((h % 360) + 360) % 360}, ${s}%, ${l}%, ${a})`;
const CLEAR = 'rgba(0,0,0,0)';

/**
 * Generated cover for missing art: hue + layout come from the title, never grey. Four variants like the web
 * `.art` / `.v1–v3`. Fills its parent; title type scales with the measured width so it fits at any poster size.
 */
export function Art({ title, showTitle = true }: { title: string; showTitle?: boolean }) {
  const [width, setWidth] = useState(110);
  const h = hueFromTitle(title);
  const variant = hueFromTitle(title + '!') % 4;
  const scale = Math.max(0.55, Math.min(1.2, width / 150));
  const label = { fontSize: Math.round(13 * scale), color: '#ffffffeb' };

  return (
    <View style={StyleSheet.absoluteFill} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {variant === 0 ? (
        <>
          <LinearGradient colors={[hsl(h, 42, 38), hsl(h + 25, 38, 13)]} start={{ x: 0.4, y: 0 }} end={{ x: 0.6, y: 1 }} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={[hsl(h, 70, 72, 0.45), CLEAR]} start={{ x: 0.3, y: 0.22 }} end={{ x: 0.75, y: 0.7 }} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={[CLEAR, hsl(h + 40, 60, 18, 0.7)]} start={{ x: 0.3, y: 0.3 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />
        </>
      ) : null}
      {variant === 1 ? (
        <>
          <LinearGradient colors={[hsl(h, 55, 58), hsl(h - 20, 55, 22), hsl(h - 30, 45, 8)]} locations={[0, 0.62, 1]} style={StyleSheet.absoluteFill} />
          <View style={[styles.sun, { backgroundColor: hsl(h, 80, 78, 0.9) }]} />
        </>
      ) : null}
      {variant === 2 ? (
        <>
          <View style={{ flex: 1, backgroundColor: hsl(h, 38, 46) }} />
          <View style={{ flex: 1, backgroundColor: hsl(h + 50, 32, 30) }} />
          <View style={{ flex: 1, backgroundColor: hsl(h + 100, 36, 16) }} />
        </>
      ) : null}
      {variant === 3 ? (
        <>
          <LinearGradient colors={[hsl(h, 22, 30), hsl(h, 20, 8)]} style={StyleSheet.absoluteFill} />
          <View style={styles.stripes} pointerEvents="none">
            {Array.from({ length: Math.ceil(width / 48) }, (_, i) => (
              <View key={i} style={[styles.stripe, { left: i * 48 + 46 }]} />
            ))}
          </View>
          <LinearGradient colors={[CLEAR, hsl(h, 80, 80, 0.25), CLEAR]} locations={[0.36, 0.44, 0.56]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
        </>
      ) : null}
      {showTitle ? (
        <View style={[styles.titleBox, variant === 2 && { bottom: undefined, top: '45%' }, variant === 1 && { bottom: 10 }]}>
          <Text
            numberOfLines={variant === 3 ? 4 : 3}
            style={[
              label,
              { fontWeight: '600', letterSpacing: -0.02 * label.fontSize },
              (variant === 1 || variant === 2) && { textAlign: 'center', textTransform: 'uppercase', fontWeight: '500', letterSpacing: 0.26 * 12 * scale, fontSize: Math.round(12 * scale), lineHeight: Math.round(18 * scale) },
              variant === 3 && { textTransform: 'uppercase', fontSize: Math.round(22 * scale), letterSpacing: 0.02 * 22 * scale },
            ]}>
            {title}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sun: { position: 'absolute', left: '41%', top: '33%', width: '18%', aspectRatio: 1, borderRadius: 999 },
  stripes: { ...StyleSheet.absoluteFill },
  stripe: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: '#0003' },
  titleBox: { position: 'absolute', left: 10, right: 10, bottom: 10 },
});
