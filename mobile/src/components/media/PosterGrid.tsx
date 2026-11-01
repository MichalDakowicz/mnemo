import { useMemo, type ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { GRID_MIN_CARD, posterGridMetrics, POSTER_GRID_GAP } from '@/lib/posterGrid';
import { PAGE_GUTTER } from '@/theme/layout';

type Size = keyof typeof GRID_MIN_CARD;

/** Column count and card width for a full-width page grid. Small posters: 4 across a phone by default. */
export function usePosterGrid(size: Size = 'normal', gutter: number = PAGE_GUTTER) {
  const { width } = useWindowDimensions();
  return useMemo(() => {
    const available = width - gutter * 2;
    return { ...posterGridMetrics(available, POSTER_GRID_GAP, GRID_MIN_CARD[size]), gap: POSTER_GRID_GAP, available };
  }, [width, gutter, size]);
}

type Props<T> = {
  items: T[];
  keyOf: (item: T) => string;
  renderItem: (item: T, cardWidth: number) => ReactNode;
  size?: Size;
  /** Horizontal page padding the parent applies, if not the standard gutter. */
  gutter?: number;
};

/**
 * Wrapping poster grid for sets that live inside a ScrollView (rails' "see all", search results, genre pages).
 * For the full Library use a FlatList with `usePosterGrid` + numColumns instead: this renders every item.
 */
export function PosterGrid<T>({ items, keyOf, renderItem, size = 'normal', gutter }: Props<T>) {
  const { cardWidth, gap } = usePosterGrid(size, gutter);
  return (
    <View style={[styles.grid, { gap }]}>
      {items.map((item) => (
        <View key={keyOf(item)} style={{ width: cardWidth }}>
          {renderItem(item, cardWidth)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 18 },
});
