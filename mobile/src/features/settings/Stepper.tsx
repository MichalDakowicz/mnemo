import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

type Props = { value: number; min: number; max: number; noun: string; onChange: (next: number) => void };

function Step({ label, disabled, onPress, children }: { label: string; disabled: boolean; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && { backgroundColor: colors.hover }, disabled && { opacity: 0.35 }]}>
      {children}
    </Pressable>
  );
}

export function Stepper({ value, min, max, noun, onChange }: Props) {
  return (
    <View style={styles.stepper}>
      <Step label={`Fewer ${noun}`} disabled={value <= min} onPress={() => onChange(Math.max(min, value - 1))}>
        <Minus size={14} strokeWidth={2.4} color={colors.text} />
      </Step>
      <Text mono accessibilityLiveRegion="polite" style={styles.value}>
        {value}
      </Text>
      <Step label={`More ${noun}`} disabled={value >= max} onPress={() => onChange(Math.min(max, value + 1))}>
        <Plus size={14} strokeWidth={2.4} color={colors.text} />
      </Step>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  btn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { minWidth: 34, textAlign: 'center', fontSize: 15, color: colors.textBright },
});
