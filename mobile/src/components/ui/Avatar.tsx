import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { hueFromTitle } from '@/lib/hue';

import { Text } from './Text';

/** Round avatar: the photo, or a hue-from-name gradient with the initial (same hue logic as generated covers). */
export function Avatar({ name, pfp, size = 40 }: { name: string; pfp?: string | null; size?: number }) {
  const h = hueFromTitle(name);
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size / 2 }]} accessibilityLabel={name}>
      {pfp ? (
        <Image source={{ uri: pfp }} contentFit="cover" style={StyleSheet.absoluteFill} />
      ) : (
        <>
          <LinearGradient colors={[`hsl(${h}, 42%, 38%)`, `hsl(${(h + 25) % 360}, 38%, 13%)`]} style={StyleSheet.absoluteFill} />
          <Text style={{ fontSize: size * 0.4, fontWeight: '600', color: '#fff' }}>{(name[0] ?? '?').toUpperCase()}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
