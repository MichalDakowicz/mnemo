import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

type Props<T extends string> = { options: { value: T; label: string }[]; value: T; label: string; onChange: (next: T) => void };

/** Pill-shaped segmented control; the chosen segment is filled warm white. */
export function Segmented<T extends string>({ options, value, label, onChange }: Props<T>) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.seg}>
      {options.map((option) => {
        const on = value === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(option.value)}
            style={[styles.item, on && styles.on]}>
            <Text style={{ fontSize: 13, fontWeight: '500', color: on ? colors.onPrimary : colors.soft }}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  seg: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    alignSelf: 'flex-start',
  },
  item: { height: 30, paddingHorizontal: 14, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: colors.primary },
});
