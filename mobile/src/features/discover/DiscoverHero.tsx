import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useScreenPadding } from '@/components/layout/Screen';
import { Text } from '@/components/ui/Text';
import { useOpenTitle } from '@/hooks/useOpenTitle';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMediaMetadata } from '@/hooks/useTmdb';
import { hueFromTitle } from '@/lib/hue';
import { colors } from '@/theme/colors';
import { PAGE_GUTTER } from '@/theme/layout';
import type { MediaType } from '@/types/movie';

import { HeroMeta } from './HeroMeta';
import { ReelStage } from './ReelStage';
import type { CardActions } from './useCardActions';
import { useDiscoverHero } from './useDiscoverHero';

const SETTLE_MS = 220;
const hsla = (h: number, s: number, l: number, a: number) => `hsla(${h % 360}, ${s}%, ${l}%, ${a})`;
const CLEAR = 'rgba(0,0,0,0)';

/** This week's trending titles as a snap carousel with the centred title's details under it. Mount with `key={type}`. */
export function DiscoverHero({ type, actions }: { type: MediaType; actions: CardActions }) {
  const hero = useDiscoverHero(type);
  const pad = useScreenPadding();
  const reduced = usePrefersReducedMotion();
  const openTitle = useOpenTitle();
  const [centre, setCentre] = useState(0);
  const [settled, setSettled] = useState(0);
  const kicker = `Trending this week · ${type === 'movie' ? 'films' : 'shows'}`;

  // Details are fetched for the poster the reel has come to rest on, not every one flicked past.
  useEffect(() => {
    const timer = setTimeout(() => setSettled(centre), SETTLE_MS);
    return () => clearTimeout(timer);
  }, [centre]);

  const current = hero.items[centre] ?? null;
  const details = useMediaMetadata(hero.items[settled]?.tmdbId ?? null, type);
  const shown = current && details.data && details.data.tmdbId === current.tmdbId ? details.data : null;

  if (!current) {
    return (
      <View accessibilityLabel={kicker} style={styles.empty}>
        <Text accessibilityRole="alert" style={styles.emptyText}>
          {hero.loading ? 'Loading what is trending…' : 'Trending titles are not available right now.'}
        </Text>
      </View>
    );
  }

  const hue = hueFromTitle(current.title);
  return (
    <View accessibilityLabel={kicker} style={[styles.hero, { marginTop: -pad.paddingTop, paddingTop: pad.paddingTop }]}>
      <Animated.View
        key={hue}
        pointerEvents="none"
        entering={FadeIn.duration(reduced ? 0 : 700)}
        exiting={FadeOut.duration(reduced ? 0 : 400)}
        style={styles.glow}>
        <LinearGradient colors={[hsla(hue, 55, 46, 0.34), hsla(hue + 24, 55, 34, 0.12), CLEAR]} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Text style={styles.kicker}>{kicker}</Text>
      <ReelStage items={hero.items} centre={centre} onCentre={setCentre} onOpen={(item) => openTitle(item.tmdbId, item.type)} />
      <View style={styles.stats}>
        {current.voteAverage > 0 ? (
          <View style={styles.rating}>
            <Text style={styles.ratingValue}>{current.voteAverage.toFixed(1)}</Text>
            <Text mono style={styles.ratingLabel}>TMDB</Text>
          </View>
        ) : (
          <View />
        )}
        <Text mono style={styles.count}>
          {centre + 1} / {hero.items.length}
        </Text>
      </View>
      <View style={{ paddingHorizontal: PAGE_GUTTER }}>
        <HeroMeta item={current} details={shown} actions={actions} onOpen={() => openTitle(current.tmdbId, current.type)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full bleed: climbs under the status bar and past the page gutter so the glow reaches the screen edges.
  hero: { marginHorizontal: -PAGE_GUTTER, marginBottom: 26 },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: 520 },
  kicker: { paddingHorizontal: PAGE_GUTTER, fontSize: 13, fontWeight: '500', color: colors.dim },
  stats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: PAGE_GUTTER },
  rating: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  ratingValue: { fontSize: 22, fontWeight: '500', letterSpacing: -0.4 },
  ratingLabel: { fontSize: 10, letterSpacing: 1.4, color: colors.dim },
  count: { fontSize: 12, color: colors.dim },
  empty: { minHeight: 220, alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  emptyText: { fontSize: 13, color: colors.muted },
});
