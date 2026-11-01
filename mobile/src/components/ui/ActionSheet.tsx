import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

import { Sheet } from './Sheet';
import { Text } from './Text';

export type ActionOption = { key: string; label: string; selected?: boolean; destructive?: boolean; onPress: () => void };

type Props = { open: boolean; onClose: () => void; title?: string; options: ActionOption[] };

/** A list of rows in a bottom Sheet (web `.mc-menu`, `.lib-menu`). Closes itself after a pick. */
export function ActionSheet({ open, onClose, title, options }: Props) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      {options.map((o) => (
        <Pressable
          key={o.key}
          accessibilityRole="menuitem"
          accessibilityState={{ selected: !!o.selected }}
          onPress={() => {
            onClose();
            o.onPress();
          }}
          style={({ pressed }) => [styles.row, o.selected && { backgroundColor: colors.active }, pressed && { backgroundColor: colors.hover }]}>
          <Text style={{ flex: 1, fontSize: 14, color: o.destructive ? colors.warn : o.selected ? colors.textBright : colors.soft }}>{o.label}</Text>
          {o.selected ? <Check size={16} color={colors.textBright} /> : null}
        </Pressable>
      ))}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: { height: 46, paddingHorizontal: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
});
