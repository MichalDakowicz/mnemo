import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { PosterGrid } from '@/components/media/PosterGrid';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { PAGE_GUTTER } from '@/theme/layout';

import { DiscoverCard } from './DiscoverCard';
import type { CardActions } from './useCardActions';
import type { DiscoverRow as Row } from './useDiscoveryFeed';

type Props = { row: Row; actions: CardActions; onOpenGenre: (genre: { id: number; name: string }) => void };

const CARD_W = 96;
const CARD_GAP = 10;

function TextButton({ label, onPress, expanded }: { label: string; onPress: () => void; expanded?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={expanded == null ? undefined : { expanded }} hitSlop={8} onPress={onPress}>
      <Text style={styles.tool}>{label}</Text>
    </Pressable>
  );
}

const Gap = () => <View style={{ width: CARD_GAP }} />;

/** One discovery section: a swipeable rail of titles. "See all" lays them out as a wrapped grid instead; genre rows can open the genre. */
export function DiscoverRow({ row, actions, onOpenGenre }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View accessibilityLabel={row.title} style={styles.section}>
      <View style={styles.head}>
        <View style={styles.titleWrap}>
          <Text accessibilityRole="header" tracking={-0.035} style={styles.title}>
            {row.title}
          </Text>
          {row.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{row.badge}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.tools}>
          {row.genre ? <TextButton label="Explore genre" onPress={() => onOpenGenre(row.genre!)} /> : null}
          <TextButton label={expanded ? 'Show less' : 'See all'} expanded={expanded} onPress={() => setExpanded((v) => !v)} />
        </View>
      </View>
      {expanded ? (
        <PosterGrid items={row.items} keyOf={(i) => `${i.type}-${i.tmdbId}`} renderItem={(item, w) => <DiscoverCard item={item} actions={actions} width={w} />} />
      ) : (
        <FlatList
          horizontal
          data={row.items}
          keyExtractor={(i) => `${i.type}-${i.tmdbId}`}
          renderItem={({ item }) => <DiscoverCard item={item} actions={actions} width={CARD_W} />}
          ItemSeparatorComponent={Gap}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={5}
          windowSize={5}
          style={styles.rail}
          contentContainerStyle={{ paddingHorizontal: PAGE_GUTTER }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 26 },
  head: { marginBottom: 10, gap: 4 },
  titleWrap: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  title: { fontSize: 18, fontWeight: '600', flexShrink: 1 },
  badge: { borderWidth: 1, borderColor: colors.chipBorder, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: '500', color: colors.dim },
  tools: { flexDirection: 'row', gap: 16 },
  tool: { fontSize: 13, color: colors.soft },
  // Bleeds past the page gutter so posters slide off the screen edge.
  rail: { marginHorizontal: -PAGE_GUTTER },
});
