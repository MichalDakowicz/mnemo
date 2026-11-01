import { useState } from 'react';
import { StyleSheet, View, type AccessibilityActionEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { colors } from '@/theme/colors';

type Props = { value: number; label: string; onChange: (v: number) => void };

const KNOB = 22;

/** 0-5 in 0.1 steps: drag or tap anywhere on the track (web: a range input under a styled track). */
export function PreciseSlider({ value, label, onChange }: Props) {
  const [width, setWidth] = useState(0);
  const pct = Math.max(0, Math.min(1, value / 5));

  const setFromX = (x: number) => {
    if (width <= 0) return;
    const next = Math.round(Math.max(0, Math.min(1, x / width)) * 50) / 10;
    if (next !== value) onChange(next);
  };

  // Horizontal drags take the slider; a vertical swipe still scrolls the page.
  const pan = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-6, 6])
    .failOffsetY([-12, 12])
    .onBegin((e) => setFromX(e.x))
    .onUpdate((e) => setFromX(e.x));
  const tap = Gesture.Tap().runOnJS(true).onEnd((e) => setFromX(e.x));
  const gesture = Gesture.Race(pan, tap);

  const step = (e: AccessibilityActionEvent) => {
    const delta = e.nativeEvent.actionName === 'increment' ? 0.5 : -0.5;
    onChange(Math.max(0, Math.min(5, Math.round((value + delta) * 10) / 10)));
  };

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min: 0, max: 5, now: value }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={step}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={styles.hit}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct * 100}%` }]} />
        </View>
        <View pointerEvents="none" style={[styles.knob, { left: pct * width - KNOB / 2 }]} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  hit: { height: 40, justifyContent: 'center' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.sheen, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.primary },
  knob: {
    position: 'absolute',
    top: (40 - KNOB) / 2,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ground,
    boxShadow: `0 0 0 1px ${colors.primary}, 0 2px 8px #0008`,
  },
});
