import { StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { Poster } from '@/components/media/Poster';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';

export const REEL_W = 176;
export const REEL_H = REEL_W * 1.5;
export const REEL_STEP = REEL_W + 8;

type Props = { item: DiscoverItem; index: number; scroll: SharedValue<number>; onPress: () => void };

/** One poster of the carousel: shrinks, dims and tilts away from the centre like the web coverflow. */
export function ReelPoster({ item, index, scroll, onPress }: Props) {
  const style = useAnimatedStyle(() => {
    const off = index - scroll.value / REEL_STEP;
    const a = Math.abs(off);
    return {
      opacity: interpolate(a, [0, 1, 2.2], [1, 0.6, 0.25], 'clamp'),
      transform: [
        { translateY: interpolate(off, [-2, 0, 2], [26, 0, -16], 'clamp') },
        { scale: interpolate(a, [0, 1, 2], [1, 0.84, 0.7], 'clamp') },
        { rotate: `${interpolate(off, [-2, 0, 2], [-9, -1.5, 9], 'clamp')}deg` },
      ],
    };
  });
  return (
    <Animated.View style={[styles.item, style]}>
      <Poster title={item.title} coverUrl={item.coverUrl} onPress={onPress} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: { width: REEL_W, height: REEL_H },
});
