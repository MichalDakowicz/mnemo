import { Image, StyleSheet, View } from 'react-native';

// Faint film-grain overlay over everything (web `.grain`, opacity .09). A tiled noise PNG.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const grain = require('../../../assets/grain.png');

// The wrapper carries pointerEvents="none" as a prop: the overlay covers the whole screen and must never take a touch.
export function Grain() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Image source={grain} resizeMode="repeat" style={styles.grain} accessible={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFill, zIndex: 95 },
  grain: { width: '100%', height: '100%', opacity: 0.09 },
});
