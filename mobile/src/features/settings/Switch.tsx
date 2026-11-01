import { Switch as RNSwitch } from 'react-native';

import { colors } from '@/theme/colors';

/** RN Switch styled to the tokens: warm-white thumb on a dim track, filled track when on. */
export function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (next: boolean) => void }) {
  return (
    <RNSwitch
      value={checked}
      onValueChange={onChange}
      accessibilityLabel={label}
      trackColor={{ false: colors.active, true: colors.good }}
      thumbColor={checked ? colors.primary : colors.muted}
      ios_backgroundColor={colors.active}
    />
  );
}
