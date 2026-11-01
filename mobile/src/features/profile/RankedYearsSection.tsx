import { useRouter } from 'expo-router';
import { ChevronRight, Maximize2, Minimize2, Trophy } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { usePosterGrid } from '@/components/media/PosterGrid';
import { Chip } from '@/components/ui/Chip';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

import type { useRankedYears } from './useRankedYears';

const PODIUM = 6;

export function RankedYearsSection({ ranked }: { ranked: ReturnType<typeof useRankedYears> }) {
  const router = useRouter();
  const [listOpen, setListOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { cardWidth, gap } = usePosterGrid('normal', 32);
  const { selected, years } = ranked;
  return (
    <View>
      <SectionHead title="Ranked years" meta="By release year" />
      {!selected ? (
        <Text style={styles.note}>Rate the titles you finish and each release year gets its own ranking.</Text>
      ) : (
        <>
          <View style={styles.card}>
            <View style={styles.top}>
              <Trophy size={16} strokeWidth={1.8} color={colors.text} />
              <Text style={styles.topTitle}>{selected.year} ranked</Text>
              <Text style={styles.note}>{selected.entries.length}</Text>
              <View style={{ flex: 1 }} />
              {selected.entries.length > PODIUM ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  onPress={() => setExpanded((v) => !v)}
                  hitSlop={8}
                  style={styles.toggle}>
                  {expanded ? (
                    <Minimize2 size={13} color={colors.muted} />
                  ) : (
                    <Maximize2 size={13} color={colors.muted} />
                  )}
                  <Text style={styles.toggleText}>{expanded ? 'Compact' : 'Expand'}</Text>
                </Pressable>
              ) : null}
            </View>
            <View style={[styles.podium, { gap }]}>
              {(expanded ? selected.entries : selected.entries.slice(0, PODIUM)).map((e) => (
                <View key={e.movie.id} style={{ width: cardWidth }}>
                  <Poster
                    title={e.movie.title}
                    coverUrl={e.movie.coverUrl}
                    onPress={
                      e.movie.tmdbId != null
                        ? () => router.push(`/title/${e.movie.type}/${e.movie.tmdbId}` as never)
                        : undefined
                    }
                  />
                  <Text mono style={styles.rank}>
                    {e.rank}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: listOpen }}
            onPress={() => setListOpen((v) => !v)}
            style={styles.tile}>
            <Text style={styles.tileText}>All years</Text>
            <Text style={styles.note}>{years.length}</Text>
            <ChevronRight
              size={16}
              strokeWidth={2}
              color={colors.muted}
              style={{ transform: [{ rotate: listOpen ? '90deg' : '0deg' }] }}
            />
          </Pressable>
          {listOpen ? (
            <View style={styles.years}>
              {years.map((y) => (
                <Chip key={y.year} label={String(y.year)} active={y.year === selected.year} onPress={() => ranked.select(y.year)} />
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  note: { fontSize: 12, color: colors.dim },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.wash,
    borderWidth: 1,
    borderColor: colors.hairline,
    gap: 14,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topTitle: { fontSize: 14, fontWeight: '600' },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  toggleText: { fontSize: 12, color: colors.muted },
  podium: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 },
  rank: { marginTop: 5, fontSize: 12, textAlign: 'center', color: colors.muted },
  tile: {
    marginTop: 10,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tileText: { flex: 1, fontSize: 13, fontWeight: '500' },
  years: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
});
