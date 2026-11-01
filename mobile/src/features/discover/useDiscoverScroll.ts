import { useRef } from 'react';
import type { FlatList, LayoutChangeEvent } from 'react-native';

import { useScreenPadding } from '@/components/layout/Screen';

/** Scrolls the page list to the search field (the dock's Search item, opening a genre). */
export function useDiscoverScroll<T>() {
  const listRef = useRef<FlatList<T>>(null);
  const searchY = useRef(0);
  const { paddingTop } = useScreenPadding();

  return {
    listRef,
    onSearchLayout: (e: LayoutChangeEvent) => {
      searchY.current = e.nativeEvent.layout.y;
    },
    scrollToSearch: () => listRef.current?.scrollToOffset({ offset: Math.max(0, searchY.current + paddingTop - 12), animated: true }),
  };
}
