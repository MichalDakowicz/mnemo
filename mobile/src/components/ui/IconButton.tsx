import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  children: ReactNode;
  label: string;
  onPress?: () => void;
  size?: number;
  /** Filled warm white (the add control) or a pressed toggle. */
  variant?: 'plain' | 'primary';
  pressed?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Round icon-only button. Always carries an accessibility label: there is no visible text. */
export function IconButton({ children, label, onPress, size = 40, variant = 'plain', pressed: toggled, disabled, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!toggled, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        variant === 'primary' && { backgroundColor: colors.primary },
        toggled && variant === 'plain' && { backgroundColor: colors.active },
        pressed && variant === 'plain' && { backgroundColor: colors.hover },
        disabled && { opacity: 0.45 },
        style,
      ]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});
