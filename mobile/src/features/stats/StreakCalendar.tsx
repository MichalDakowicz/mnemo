import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { Text } from '@/components/ui/Text';
import type { StreakGrid } from '@/lib/streakGrid';
import { colors } from '@/theme/colors';

type Cell = StreakGrid['weeks'][number][number];

type Props = {
  title: string;
  note: string;
  goal: string;
  aria: string;
  unit: string;
  grid: StreakGrid;
};

const GAP = 1.5;
const ROWS = 7;
/** Level 1-3 are the text colour at rising opacity, like the web's #ece9e44d / #ece9e499 / #ece9e4. */
const LEVEL_OPACITY = [0, 0.3, 0.6, 1] as const;

function paint(c: Cell): { fill: string; opacity: number } | null {
  if (c.future) return null;
  if (c.goalMet) return { fill: colors.good, opacity: 1 };
  if (c.level) return { fill: colors.text, opacity: LEVEL_OPACITY[c.level] };
  return { fill: colors.white, opacity: 0.06 };
}

/** 53 Monday-anchored weeks, one column each; a busy day in a week that met its goal is drawn green. */
export function StreakCalendar({ title, note, goal, aria, grid }: Props) {
  const [width, setWidth] = useState(0);
  const weeks = grid.weeks.length;
  const size = width > 0 ? (width - GAP * (weeks - 1)) / weeks : 0;
  return (
    <View style={styles.block}>
      <View style={styles.head}>
        <Text accessibilityRole="header" tracking={-0.035} style={styles.title}>{title}</Text>
        <Text numberOfLines={1} style={styles.note}>{note}</Text>
      </View>
      <View accessible accessibilityRole="image" accessibilityLabel={aria} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {size > 0 ? (
          <Svg width={width} height={ROWS * size + (ROWS - 1) * GAP}>
            {grid.weeks.map((week, w) =>
              week.map((c, d) => {
                const p = paint(c);
                return p ? <Rect key={c.key} x={w * (size + GAP)} y={d * (size + GAP)} width={size} height={size} rx={1.2} fill={p.fill} fillOpacity={p.opacity} /> : null;
              }),
            )}
          </Svg>
        ) : (
          <View style={{ height: 60 }} />
        )}
      </View>
      <View style={styles.foot}>
        <Text mono style={styles.footText}>{grid.firstLabel}</Text>
        <Text style={styles.footText}>{goal}</Text>
        <Text mono style={styles.footText}>{grid.lastLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16, marginBottom: 28 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  title: { fontSize: 19, fontWeight: '600' },
  note: { flexShrink: 1, fontSize: 12, color: colors.dim },
  foot: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 10 },
  footText: { fontSize: 11, color: colors.dim },
});
