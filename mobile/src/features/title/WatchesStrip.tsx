import { ChevronDown, Minus, Plus } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { EditForm } from '@/lib/editForm';
import { formDatedPasses } from '@/lib/editForm';
import { stepUndatedWatches } from '@/lib/watchCounts';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

import { Collapse } from './Collapse';
import { useScrollIntoView } from './ScrollIntoView';
import type { TitleForm } from './useTitleForm';

type Props = { form: EditForm; tf: TitleForm };

/** The count with its minus and plus either side and no pill around it. */
function Counter({ value, label, onDec, onInc }: { value: number; label: string; onDec: () => void; onInc: () => void }) {
  return (
    <View accessibilityRole="adjustable" accessibilityLabel={label} style={styles.count}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${label}`} hitSlop={6} onPress={onDec} style={styles.step}>
        <Minus size={14} color={colors.muted} />
      </Pressable>
      <Text tracking={-0.03} style={styles.big}>{value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${label}`} hitSlop={6} onPress={onInc} style={styles.step}>
        <Plus size={14} color={colors.muted} />
      </Pressable>
    </View>
  );
}

/**
 * How many times you watched it, watches you only remember (no date), and where you stopped,
 * which opens a drawer the way the rating does.
 */
export function WatchesStrip({ form, tf }: Props) {
  const [open, setOpen] = useState(false);
  const box = useRef<View>(null);
  const scrollIntoView = useScrollIntoView();
  const s = form.status;
  const isTv = form.type === 'tv';
  const total = s.timesWatched || 0;
  const position = form.lastWatchedPosition.trim();

  const bumpTotal = (delta: number) =>
    tf.commit((f) => {
      const next = Math.max(1, (f.status.timesWatched || 0) + delta);
      const undated = delta < 0 ? f.status.undatedWatches + delta : f.status.undatedWatches;
      return { ...f, status: { ...f.status, timesWatched: next, undatedWatches: Math.max(0, Math.min(undated, next)) } };
    });
  const bumpUndated = (delta: 1 | -1) =>
    tf.commit((f) => {
      const step = stepUndatedWatches(f.status, delta, { datedPasses: formDatedPasses(f), derived: f.type === 'tv' });
      return { ...f, status: { ...f.status, watched: f.status.watched || step.undatedWatches > 0, ...step } };
    });

  return (
    <View ref={box} accessibilityLabel="Your watches" style={styles.strip}>
      <View style={styles.cols}>
        {s.watched ? (
          <View style={styles.col}>
            <Text style={styles.k}>Watched</Text>
            {isTv ? (
              <Text tracking={-0.03} style={styles.big}>{total}×</Text>
            ) : (
              <Counter value={total || 1} label="times watched" onDec={() => bumpTotal(-1)} onInc={() => bumpTotal(1)} />
            )}
          </View>
        ) : null}
        <View style={styles.col}>
          <Text style={styles.k}>Watched before (no date)</Text>
          <Counter value={s.undatedWatches} label="undated watches" onDec={() => bumpUndated(-1)} onInc={() => bumpUndated(1)} />
        </View>
        {s.inProgress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: open }}
            onPress={() => setOpen((o) => !o)}
            style={styles.col}>
            <View style={styles.stopHead}>
              <Text style={styles.k}>Stopped at</Text>
              <ChevronDown size={14} color={colors.dim} style={open ? styles.flip : undefined} />
            </View>
            {position ? <Text mono style={styles.pos}>{position}</Text> : null}
          </Pressable>
        ) : null}
      </View>
      {s.inProgress ? (
        <Collapse open={open}>
          <TextInput
            accessibilityLabel="Last watched position"
            value={form.lastWatchedPosition}
            onChangeText={(v) => tf.update({ lastWatchedPosition: v })}
            onFocus={() => scrollIntoView(box.current)}
            placeholder={isTv ? 'e.g. S02E05 at 23:15' : 'e.g. 45:30'}
            placeholderTextColor={colors.dim}
            selectionColor={colors.primary}
            style={styles.input}
          />
        </Collapse>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { marginTop: 26 },
  cols: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, columnGap: 28, alignItems: 'flex-start' },
  col: { gap: 8, minWidth: 0 },
  k: { fontSize: 12, color: colors.dim },
  big: { fontSize: 24, fontWeight: '600', minWidth: 14, textAlign: 'center' },
  count: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  step: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stopHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pos: { fontSize: 17, fontWeight: '500' },
  flip: { transform: [{ rotate: '180deg' }] },
  input: {
    height: 42,
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.wash,
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 13,
    paddingHorizontal: 14,
  },
});
