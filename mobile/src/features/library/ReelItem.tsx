import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { PosterCover } from '@/components/media/Poster';
import { mod } from '@/lib/discoverReel';
import type { Movie } from '@/types/movie';

export const REEL_CARD_WIDTH = 150;
const STEP = 92;
const VISIBLE = 3;

type Props = { movie: Movie; index: number; count: number; pos: SharedValue<number> };

/** One poster on the coverflow: its offset from the centre drives x, scale, tilt and fade. */
export function ReelItem({ movie, index, count, pos }: Props) {
  const style = useAnimatedStyle(() => {
    const off = mod(index - pos.value + count / 2, count) - count / 2;
    const a = Math.min(Math.abs(off), VISIBLE + 1);
    const sign = off < 0 ? -1 : 1;
    return {
      opacity: a > VISIBLE ? 0 : 1 - a * 0.2,
      zIndex: 100 - Math.round(a * 10),
      transform: [
        { perspective: 900 },
        { translateX: off * STEP },
        { rotateY: `${-sign * Math.min(a, 1.5) * 34}deg` },
        { scale: 1 - Math.min(a, VISIBLE) * 0.13 },
      ],
    };
  });
  return (
    <Animated.View pointerEvents="none" style={[styles.item, style]}>
      <PosterCover title={movie.title} coverUrl={movie.coverUrl} style={styles.cover} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: { position: 'absolute', width: REEL_CARD_WIDTH, left: '50%', marginLeft: -REEL_CARD_WIDTH / 2 },
  cover: { boxShadow: '0 20px 40px #000a, 0 0 0 1px #ffffff14' },
});
