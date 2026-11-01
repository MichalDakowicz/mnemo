import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

type Props = { label: string; value: number; onChange: (v: number) => void };

/** Ten tap segments (0.5 steps). Tapping the current one clears it, as in Radar. */
export function TickRating({ label, value, onChange }: Props) {
  return (
    <View>
      <View style={styles.head}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text mono style={styles.val}>{value.toFixed(1)} / 5</Text>
      </View>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.ticks}>
        {Array.from({ length: 10 }, (_, i) => {
          const v = (i + 1) / 2;
          const on = value >= v;
          return (
            <Pressable
              key={v}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${label} ${v.toFixed(1)} of 5`}
              onPress={() => onChange(value === v ? 0 : v)}
              style={styles.tick}>
              <View style={[styles.seg, on && { backgroundColor: colors.primary }]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 2 },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 1.1, color: colors.dim },
  val: { fontSize: 13, fontWeight: '500' },
  ticks: { flexDirection: 'row', gap: 4 },
  tick: { flex: 1, minWidth: 0, height: 36, justifyContent: 'center' },
  seg: { height: 6, borderRadius: 3, backgroundColor: colors.sheen },
});
