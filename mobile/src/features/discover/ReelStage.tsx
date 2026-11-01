import { useRef } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedReaction, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { DiscoverItem } from '@/lib/toDiscoveryMovie';

import { REEL_H, REEL_STEP, REEL_W, ReelPoster } from './ReelPoster';

type Props = {
  items: DiscoverItem[];
  centre: number;
  onCentre: (index: number) => void;
  onOpen: (item: DiscoverItem) => void;
};

const Gap = () => <View style={{ width: REEL_STEP - REEL_W }} />;

/** The trending reel: a centred snap carousel, full width. The poster in the middle drives the details below. */
export function ReelStage({ items, centre, onCentre, onOpen }: Props) {
  const { width } = useWindowDimensions();
  const scroll = useSharedValue(0);
  const listRef = useRef<FlatList<DiscoverItem>>(null);
  const side = (width - REEL_W) / 2;
  const last = items.length - 1;

  const onScroll = useAnimatedScrollHandler((e) => {
    scroll.value = e.contentOffset.x;
  });
  useAnimatedReaction(
    () => Math.max(0, Math.min(last, Math.round(scroll.value / REEL_STEP))),
    (index, prev) => {
      if (index !== prev) scheduleOnRN(onCentre, index);
    },
  );

  return (
    <Animated.FlatList
      ref={listRef}
      horizontal
      data={items}
      keyExtractor={(i) => `${i.type}-${i.tmdbId}`}
      renderItem={({ item, index }) => (
        <ReelPoster
          item={item}
          index={index}
          scroll={scroll}
          onPress={() => (index === centre ? onOpen(item) : listRef.current?.scrollToOffset({ offset: index * REEL_STEP, animated: true }))}
        />
      )}
      ItemSeparatorComponent={Gap}
      getItemLayout={(_, index) => ({ length: REEL_STEP, offset: index * REEL_STEP, index })}
      snapToInterval={REEL_STEP}
      decelerationRate="fast"
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      initialNumToRender={5}
      windowSize={5}
      accessibilityLabel="Trending titles. Swipe sideways to browse."
      style={{ height: REEL_H + 48, flexGrow: 0 }}
      contentContainerStyle={{ paddingHorizontal: side, paddingVertical: 24, alignItems: 'center' }}
    />
  );
}
