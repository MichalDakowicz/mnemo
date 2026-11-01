import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { DURATION, ease } from '@/theme/motion';

type Props = { open: boolean; children: ReactNode };

/**
 * Height-animated disclosure (web `.ti-collapse`): always mounted so its content keeps state,
 * hidden from touch and from screen readers while shut. Height follows the content, so a list
 * that grows after opening still fits.
 */
export function Collapse({ open, children }: Props) {
  const reduce = usePrefersReducedMotion();
  const content = useSharedValue(0);
  const progress = useSharedValue(open ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: reduce ? 0 : DURATION + 50, easing: ease });
  }, [open, reduce, progress]);

  const frame = useAnimatedStyle(() => ({ height: content.value * progress.value, opacity: progress.value }));

  return (
    <Animated.View
      style={[styles.frame, frame]}
      pointerEvents={open ? 'auto' : 'none'}
      importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
      accessibilityElementsHidden={!open}>
      <View style={styles.inner} onLayout={(e) => { content.value = e.nativeEvent.layout.height; }}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden' },
  inner: { position: 'absolute', left: 0, right: 0, top: 0 },
});
