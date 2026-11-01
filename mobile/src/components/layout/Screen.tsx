import type { ReactNode } from 'react';
import { ScrollView, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { DOCK_CLEARANCE, PAGE_GUTTER } from '@/theme/layout';

/** Page padding for a screen that scrolls itself (FlatList etc.): status bar on top, the dock below. */
export function useScreenPadding() {
  const insets = useSafeAreaInsets();
  return { paddingTop: insets.top + 16, paddingBottom: insets.bottom + DOCK_CLEARANCE, paddingHorizontal: PAGE_GUTTER };
}

type Props = ScrollViewProps & {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  /** Drop the horizontal gutter, for full-bleed rails and heroes that pad themselves. */
  bleed?: boolean;
};

/**
 * The page frame (web `.page`). No header bar: content starts under the status bar and ends clear of
 * the floating bottom dock. Every screen is a Screen, or a list that applies `useScreenPadding()`.
 */
export function Screen({ children, contentStyle, bleed, ...rest }: Props) {
  const pad = useScreenPadding();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.ground }}
      contentContainerStyle={[pad, bleed && { paddingHorizontal: 0 }, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...rest}>
      {children}
    </ScrollView>
  );
}
