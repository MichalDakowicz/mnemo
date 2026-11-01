import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

import { Text } from './Text';

type Props = {
  label?: string;
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
  onPress?: () => void;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/** Full-radius button. `primary` is warm white with near-black text; `ghost` has no border. */
export function Pill({ label, icon, variant = 'default', onPress, disabled, height = 36, style, accessibilityLabel }: Props) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { height },
        primary && styles.primary,
        variant === 'ghost' && styles.ghost,
        pressed && !primary && { backgroundColor: colors.hover },
        pressed && primary && { backgroundColor: colors.white },
        disabled && { opacity: 0.45 },
        style,
      ]}>
      {icon}
      {label ? (
        <Text style={{ fontSize: 13, fontWeight: primary ? '600' : '500', color: primary ? colors.onPrimary : colors.text }}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  ghost: { borderColor: 'transparent' },
});
