import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

import { Text } from './Text';

type Props = {
  label: string;
  /** Pressed state: filled warm white. */
  active?: boolean;
  /** Small count after the label (web: `<small>`). */
  count?: number | string;
  icon?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Filter chip: 34px full-radius, outlined; filled primary when `active`. */
export function Chip({ label, active, count, icon, onPress, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={({ pressed }) => [styles.base, active && styles.active, pressed && !active && { backgroundColor: colors.hover }, style]}>
      {icon}
      <Text style={{ fontSize: 13, color: active ? colors.onPrimary : colors.soft }}>{label}</Text>
      {count != null ? (
        <Text style={{ fontSize: 11, color: active ? colors.onPrimary : colors.soft, opacity: 0.7 }}>{count}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
});
