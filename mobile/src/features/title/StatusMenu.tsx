import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ActionSheet } from '@/components/ui/ActionSheet';
import { Text } from '@/components/ui/Text';
import { STATUS_OPTIONS, type StatusKey } from '@/lib/titleStatus';
import { colors } from '@/theme/colors';

type Props = { value: StatusKey; isTv: boolean; onPick: (key: StatusKey) => void };

/** The watch-status pill; its radio menu opens as a bottom sheet (web `.ti-menu`). */
export function StatusMenu({ value, isTv, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const current = STATUS_OPTIONS.find((o) => o.key === value) ?? STATUS_OPTIONS[0];

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Watch status: ${current.label}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.pill, pressed && { backgroundColor: colors.hover }]}>
        <View style={[styles.dot, value === 'watched' && { backgroundColor: colors.good }]} />
        <Text style={styles.label}>{current.label}</Text>
        <ChevronDown size={14} color={colors.text} />
      </Pressable>
      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Watch status"
        options={STATUS_OPTIONS.map((o) => ({
          key: o.key,
          label: `${o.label}  ·  ${isTv ? o.tvHint : o.hint}`,
          selected: o.key === value,
          onPress: () => onPick(o.key),
        }))}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pill: { height: 44, paddingHorizontal: 18, borderRadius: 999, borderWidth: 1, borderColor: colors.lineStrong, flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.text },
  label: { fontSize: 14, fontWeight: '500' },
});
