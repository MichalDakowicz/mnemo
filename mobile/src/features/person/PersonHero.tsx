import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUpRight } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Text } from '@/components/ui/Text';
import { hueFromTitle } from '@/lib/hue';
import type { libraryStats } from '@/lib/personCredits';
import { formatDate } from '@/lib/titleFacts';
import type { PersonProfile } from '@/lib/tmdbExtra';
import { colors } from '@/theme/colors';

type Props = { profile: PersonProfile; kicker: string; stats: ReturnType<typeof libraryStats> };

function Src({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => void Linking.openURL(href)}
      style={styles.src}>
      <Text style={styles.srcText}>{children}</Text>
      <ArrowUpRight size={11} color={colors.muted} />
    </Pressable>
  );
}

export function PersonHero({ profile: p, kicker, stats }: Props) {
  const [open, setOpen] = useState(false);
  const hue = hueFromTitle(p.name);
  const born = formatDate(p.birthday);
  const longBio = p.biography.length > 280;
  const cells = [
    { label: 'In your library', value: String(stats.inLibrary), suffix: ` of ${stats.total}` },
    { label: 'Watched', value: String(stats.watched), suffix: '' },
    { label: 'Your average', value: stats.average ? stats.average.toFixed(1) : '—', suffix: stats.average ? ' /5' : '' },
  ];

  return (
    <View style={styles.hero} accessibilityLabel={p.name}>
      <View style={styles.portrait}>
        {p.profileUrl ? (
          <Image source={{ uri: p.profileUrl }} contentFit="cover" accessibilityLabel={p.name} style={StyleSheet.absoluteFill} />
        ) : (
          <>
            <LinearGradient
              colors={[`hsl(${hue}, 42%, 38%)`, `hsl(${(hue + 25) % 360}, 38%, 13%)`]}
              style={StyleSheet.absoluteFill}
            />
            <Svg viewBox="0 0 100 110" width="70%" height="70%" style={{ position: 'absolute', bottom: 0, alignSelf: 'center', opacity: 0.35 }}>
              <Circle cx="50" cy="34" r="22" fill={colors.white} />
              <Path d="M6 110c2-30 20-46 44-46s42 16 44 46z" fill={colors.white} />
            </Svg>
          </>
        )}
      </View>
      <View style={styles.info}>
        {kicker ? <Text style={styles.kicker}>{kicker.toUpperCase()}</Text> : null}
        <Text accessibilityRole="header" tracking={-0.04} style={styles.name}>
          {p.name}
        </Text>
        <View style={styles.srcs}>
          <Src href={`https://www.themoviedb.org/person/${p.id}`}>TMDB</Src>
          {p.imdbId ? <Src href={`https://www.imdb.com/name/${p.imdbId}`}>IMDb</Src> : null}
        </View>
        {born || p.placeOfBirth ? (
          <Text style={styles.born}>{[born ? `Born ${born}` : null, p.placeOfBirth].filter(Boolean).join(' · ')}</Text>
        ) : null}
        {p.biography ? (
          <>
            <Text numberOfLines={open ? undefined : 5} style={styles.bio}>
              {p.biography}
            </Text>
            {longBio ? (
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen((o) => !o)}>
                <Text style={styles.more}>{open ? 'Show less' : 'Read more'}</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
        <View style={styles.stats}>
          {cells.map((c) => (
            <View key={c.label} style={{ flex: 1 }}>
              <Text style={styles.statLabel}>{c.label}</Text>
              <Text>
                <Text mono style={styles.statValue}>
                  {c.value}
                </Text>
                <Text style={styles.statSuffix}>{c.suffix}</Text>
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 18, marginBottom: 28 },
  portrait: {
    width: 150,
    aspectRatio: 2 / 3,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.panel,
    boxShadow: '0 12px 28px #0008',
  },
  info: { gap: 8 },
  kicker: { fontSize: 11, letterSpacing: 1.2, color: colors.dim },
  name: { fontSize: 34, fontWeight: '600', lineHeight: 36 },
  srcs: { flexDirection: 'row', gap: 8 },
  src: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.chipBorder,
  },
  srcText: { fontSize: 11, fontWeight: '600', color: colors.muted },
  born: { fontSize: 13, color: colors.muted },
  bio: { fontSize: 13, lineHeight: 20, color: colors.soft },
  more: { fontSize: 13, fontWeight: '500', color: colors.textBright },
  stats: { flexDirection: 'row', gap: 12, marginTop: 8, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.hairline },
  statLabel: { fontSize: 11, color: colors.dim, marginBottom: 3 },
  statValue: { fontSize: 20, fontWeight: '500', color: colors.textBright },
  statSuffix: { fontSize: 11, color: colors.dim },
});
