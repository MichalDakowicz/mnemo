import { Image } from 'expo-image';
import { Check, Minus, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Art } from '@/components/media/Art';
import { Text } from '@/components/ui/Text';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { CachedEpisode } from '@/lib/seasonCache';
import { formatDate } from '@/lib/titleFacts';
import { shortDay } from '@/lib/titleStatus';
import { colors } from '@/theme/colors';
import { DURATION, ease } from '@/theme/motion';

import { Collapse } from './Collapse';

type Props = {
  season: number;
  episode: CachedEpisode;
  count: number;
  lastWatch: string | null;
  /** null = read-only (title not in the library). */
  onToggle: (() => void) | null;
  onBump: (delta: number) => void;
};

const FULL = { w: 104, h: 58 };
const MIN = { w: 72, h: 40 };
const SCRIM = `${colors.ground}cc`;
const CODE_BG = '#0009';

export function EpisodeRow({ season, episode, count, lastWatch, onToggle, onBump }: Props) {
  const [min, setMin] = useState(false);
  const reduce = usePrefersReducedMotion();
  const size = useSharedValue(0);
  const done = count > 0;
  const n = episode.episode_number;
  const name = episode.name || `Episode ${n}`;
  const aired = formatDate(episode.air_date);
  const watched = shortDay(lastWatch);

  useEffect(() => {
    size.value = withTiming(min ? 1 : 0, { duration: reduce ? 0 : DURATION - 50, easing: ease });
  }, [min, reduce, size]);
  const thumb = useAnimatedStyle(() => ({
    width: FULL.w + (MIN.w - FULL.w) * size.value,
    height: FULL.h + (MIN.h - FULL.h) * size.value,
  }));
  const codeFade = useAnimatedStyle(() => ({ opacity: 1 - size.value }));

  return (
    <View style={[styles.row, min && { alignItems: 'center' }]}>
      <Animated.View style={[styles.thumb, thumb]}>
        {episode.still ? (
          <Image source={{ uri: episode.still }} contentFit="cover" transition={180} style={StyleSheet.absoluteFill} />
        ) : (
          <Art title={episode.name || `e${n}`} showTitle={false} />
        )}
        <Animated.View style={[styles.code, codeFade]} pointerEvents="none">
          <Text style={styles.codeText}>S{season} E{n}</Text>
        </Animated.View>
        {onToggle && !done ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`Mark watched: ${name}`} hitSlop={8} onPress={onToggle} style={styles.check}>
            <Check size={10} strokeWidth={3} color={colors.text} />
          </Pressable>
        ) : null}
        {onToggle && done ? (
          <View accessibilityLabel={`Watched ${count} time${count === 1 ? '' : 's'}`} style={styles.counter}>
            <Pressable accessibilityRole="button" accessibilityLabel="One fewer watch" hitSlop={6} onPress={() => onBump(-1)} style={styles.step}>
              <Minus size={10} color={colors.muted} />
            </Pressable>
            <Text mono style={styles.countText}>{count}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="One more watch" hitSlop={6} onPress={() => onBump(1)} style={styles.step}>
              <Plus size={10} color={colors.muted} />
            </Pressable>
          </View>
        ) : null}
      </Animated.View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: !min }} onPress={() => setMin((m) => !m)} style={styles.text}>
        <Text numberOfLines={min ? 1 : 2} style={[styles.title, done && { color: colors.muted }]}>{n}. {name}</Text>
        <Collapse open={!min}>
          <View style={styles.details}>
            <Text style={styles.meta}>{aired ?? 'Air date unknown'}{done && watched ? ` · Watched ${watched}` : ''}</Text>
            {episode.overview ? <Text numberOfLines={2} style={styles.desc}>{episode.overview}</Text> : null}
          </View>
        </Collapse>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, paddingVertical: 8, minWidth: 0 },
  thumb: { borderRadius: 8, overflow: 'hidden', backgroundColor: colors.panel },
  code: { position: 'absolute', left: 5, bottom: 5, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5, backgroundColor: CODE_BG },
  codeText: { fontSize: 9, fontWeight: '600', letterSpacing: 0.5, color: colors.white },
  check: { position: 'absolute', top: 5, right: 5, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: SCRIM, borderWidth: 1, borderColor: colors.sheen },
  counter: { position: 'absolute', top: 4, right: 4, flexDirection: 'row', alignItems: 'center', height: 20, paddingHorizontal: 1, borderRadius: 10, backgroundColor: SCRIM, borderWidth: 1, borderColor: colors.sheen },
  step: { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  countText: { minWidth: 12, textAlign: 'center', fontSize: 11 },
  text: { flex: 1, minWidth: 0, justifyContent: 'center' },
  title: { fontSize: 13.5, fontWeight: '600' },
  details: { gap: 3, paddingTop: 3 },
  meta: { fontSize: 12, color: colors.dim },
  desc: { fontSize: 12, lineHeight: 17, color: colors.muted },
});
